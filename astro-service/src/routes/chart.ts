import { Router } from "express";
import { ZodError } from "zod";
import { buildNatalChart, CalculationError } from "../lib/natalChart";
import { chartRequestSchema } from "../validation/chartRequest";

export const chartRouter = Router();

chartRouter.post("/natal", async (req, res) => {
  try {
    const input = chartRequestSchema.parse(req.body);
    const chart = await buildNatalChart(input);
    res.status(200).json(chart);
  } catch (error) {
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
