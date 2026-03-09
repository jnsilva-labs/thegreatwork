import { Router } from "express";
import { ZodError } from "zod";
import { CalculationError } from "../lib/natalChart";
import { buildMonthAheadTransits } from "../lib/transits";
import { monthAheadRequestSchema } from "../validation/monthAheadRequest";

export const transitRouter = Router();

transitRouter.post("/month-ahead", async (req, res) => {
  try {
    const input = monthAheadRequestSchema.parse(req.body);
    const payload = await buildMonthAheadTransits(input);
    res.status(200).json(payload);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        details: error.flatten()
      });
      return;
    }

    if (error instanceof CalculationError) {
      res.status(422).json({
        error: "CALCULATION_ERROR",
        message: error.message
      });
      return;
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Unexpected server error"
    });
  }
});
