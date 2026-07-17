import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";

const SECRET = "render-service-test-secret";
const originalSecret = process.env.ASTRO_SERVICE_SECRET;

beforeEach(() => {
  process.env.ASTRO_SERVICE_SECRET = SECRET;
});

afterEach(() => {
  if (originalSecret === undefined) delete process.env.ASTRO_SERVICE_SECRET;
  else process.env.ASTRO_SERVICE_SECRET = originalSecret;
});

describe("service authentication", () => {
  it("keeps the health endpoint public", async () => {
    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it.each([
    ["/chart/natal", undefined],
    ["/chart/natal", "wrong-secret"],
    ["/chart/natal", "x"],
    ["/transits/month-ahead", undefined],
    ["/transits/month-ahead", "wrong-secret"]
  ])("rejects unauthorized requests to %s", async (path, secret) => {
    const response = await request(app)
      .post(path)
      .set(secret ? { "X-Astro-Service-Secret": secret } : {})
      .send({});

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "SERVICE_UNAUTHORIZED" });
  });

  it("returns a generic 503 when the Render secret is not configured", async () => {
    delete process.env.ASTRO_SERVICE_SECRET;

    const response = await request(app).post("/chart/natal").send({});

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ error: "SERVICE_AUTH_UNAVAILABLE" });
  });

  it("allows the correct secret through to existing request validation", async () => {
    const response = await request(app)
      .post("/chart/natal")
      .set("X-Astro-Service-Secret", SECRET)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("VALIDATION_ERROR");
  });

  it("allows the correct secret through transit request validation", async () => {
    const response = await request(app)
      .post("/transits/month-ahead")
      .set("X-Astro-Service-Secret", SECRET)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("VALIDATION_ERROR");
  });
});
