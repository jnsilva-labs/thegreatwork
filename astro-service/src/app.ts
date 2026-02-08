import express from "express";
import rateLimit from "express-rate-limit";
import { chartRouter } from "./routes/chart";

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

app.use("/chart", chartRateLimit, chartRouter);
