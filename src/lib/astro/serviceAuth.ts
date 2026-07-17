export class AstroServiceConfigurationError extends Error {
  constructor() {
    super("Astro service authentication is not configured.");
    this.name = "AstroServiceConfigurationError";
  }
}

export const getAstroServiceSecret = (): string => {
  const secret = process.env.ASTRO_SERVICE_SECRET?.trim();
  if (!secret) {
    throw new AstroServiceConfigurationError();
  }

  return secret;
};
