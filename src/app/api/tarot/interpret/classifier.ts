import { APICallError, NoObjectGeneratedError } from 'ai';

export interface ClassifiedInterpretError {
  code:
    | 'SHARED_KEY_UNAVAILABLE'
    | 'SHARED_QUOTA_EXCEEDED'
    | 'SHARED_REQUEST_TIMEOUT'
    | 'BAD_RESPONSE_FORMAT'
    | 'SHARED_REQUEST_FAILED';
  status: number;
  message: string;
}

export function classifyInterpretError(error: unknown): ClassifiedInterpretError {
  if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return {
      code: 'SHARED_REQUEST_TIMEOUT',
      status: 504,
      message: 'The shared reading request timed out.',
    };
  }

  if (NoObjectGeneratedError.isInstance(error)) {
    return {
      code: 'BAD_RESPONSE_FORMAT',
      status: 502,
      message: 'The AI service returned a malformed interpretation.',
    };
  }

  if (APICallError.isInstance(error)) {
    const status = error.statusCode ?? 0;
    if (status === 401 || status === 403) {
      return {
        code: 'SHARED_KEY_UNAVAILABLE',
        status: 503,
        message: 'Shared AI access is not configured on the server.',
      };
    }
    if (status === 402 || status === 429) {
      return {
        code: 'SHARED_QUOTA_EXCEEDED',
        status: 429,
        message: 'Shared AI quota is currently exhausted.',
      };
    }
    return {
      code: 'SHARED_REQUEST_FAILED',
      status: 502,
      message: 'The shared AI request failed.',
    };
  }

  // The gateway provider throws a plain Error when no OIDC token / API key is
  // available locally (before any HTTP call is made).
  if (error instanceof Error && /oidc|api key|authentication|credentials/i.test(error.message)) {
    return {
      code: 'SHARED_KEY_UNAVAILABLE',
      status: 503,
      message: 'Shared AI access is not configured on the server.',
    };
  }

  return {
    code: 'SHARED_REQUEST_FAILED',
    status: 502,
    message: 'The shared AI request failed.',
  };
}
