import { describe, expect, it } from 'vitest';
import { APICallError, NoObjectGeneratedError } from 'ai';
import { classifyInterpretError } from '../app/api/tarot/interpret/classifier';

function apiError(statusCode: number) {
  return new APICallError({
    message: `status ${statusCode}`,
    url: 'https://ai-gateway.vercel.sh',
    requestBodyValues: {},
    statusCode,
  });
}

describe('classifyInterpretError', () => {
  it('maps 401/403 to SHARED_KEY_UNAVAILABLE 503', () => {
    for (const status of [401, 403]) {
      const classified = classifyInterpretError(apiError(status));
      expect(classified.code).toBe('SHARED_KEY_UNAVAILABLE');
      expect(classified.status).toBe(503);
    }
  });

  it('maps 402/429 to SHARED_QUOTA_EXCEEDED 429', () => {
    for (const status of [402, 429]) {
      const classified = classifyInterpretError(apiError(status));
      expect(classified.code).toBe('SHARED_QUOTA_EXCEEDED');
      expect(classified.status).toBe(429);
    }
  });

  it('maps other API statuses to SHARED_REQUEST_FAILED 502', () => {
    const classified = classifyInterpretError(apiError(500));
    expect(classified.code).toBe('SHARED_REQUEST_FAILED');
    expect(classified.status).toBe(502);
  });

  it('maps timeout aborts to SHARED_REQUEST_TIMEOUT 504', () => {
    for (const name of ['TimeoutError', 'AbortError']) {
      const classified = classifyInterpretError(new DOMException('timed out', name));
      expect(classified.code).toBe('SHARED_REQUEST_TIMEOUT');
      expect(classified.status).toBe(504);
    }
  });

  it('maps NoObjectGeneratedError to BAD_RESPONSE_FORMAT 502', () => {
    const noObjectError = new NoObjectGeneratedError({
      message: 'malformed',
      response: { id: 'test', timestamp: new Date(), modelId: 'test-model' },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      finishReason: 'stop',
    } as ConstructorParameters<typeof NoObjectGeneratedError>[0]);
    const classified = classifyInterpretError(noObjectError);
    expect(classified.code).toBe('BAD_RESPONSE_FORMAT');
    expect(classified.status).toBe(502);
  });

  it('maps missing-credentials errors to SHARED_KEY_UNAVAILABLE 503', () => {
    const classified = classifyInterpretError(new Error('No OIDC token available for AI Gateway'));
    expect(classified.code).toBe('SHARED_KEY_UNAVAILABLE');
    expect(classified.status).toBe(503);
  });

  it('maps unknown errors to SHARED_REQUEST_FAILED 502', () => {
    const classified = classifyInterpretError(new Error('something odd'));
    expect(classified.code).toBe('SHARED_REQUEST_FAILED');
    expect(classified.status).toBe(502);
  });
});
