import express from "express";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { chartRouter } from "./routes/chart";
import { transitRouter } from "./routes/transits";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "64kb" }));

const chartRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "RATE_LIMITED",
    message: "Too many requests, try again shortly"
  }
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((req, res, next) => {
  const secret = process.env.ASTRO_SERVICE_SECRET?.trim();
  if (!secret) {
    res.status(503).json({ error: "SERVICE_AUTH_UNAVAILABLE" });
    return;
  }

  const supplied = req.get("X-Astro-Service-Secret");
  if (!supplied) {
    res.status(401).json({ error: "SERVICE_UNAUTHORIZED" });
    return;
  }

  const expectedBytes = Buffer.from(secret);
  const suppliedBytes = Buffer.from(supplied);
  if (
    suppliedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(suppliedBytes, expectedBytes)
  ) {
    res.status(401).json({ error: "SERVICE_UNAUTHORIZED" });
    return;
  }

  next();
});

app.use("/chart", chartRateLimit, chartRouter);
app.use("/transits", chartRateLimit, transitRouter);
