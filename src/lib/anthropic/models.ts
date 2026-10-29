// Claude model selection for the AI reading services. Each service can be
// repointed without a code change via its env var; both default to Sonnet,
// which fits the route timeouts and budget. Alternatives: 'claude-opus-5-5'
// (premium), 'claude-haiku-5-5' (cheapest).
export const TAROT_MODEL = process.env.ANTHROPIC_TAROT_MODEL ?? 'claude-sonnet-5-5';
export const ASTRO_MODEL = process.env.ANTHROPIC_ASTRO_MODEL ?? 'claude-sonnet-5-5';
