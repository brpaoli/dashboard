import express, { Request, Response } from "express";
import { googleMetrics } from "../controllers/google-metrics.controller";

const googleMetricsRouter = express.Router();

googleMetricsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const metrics = await googleMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics", details: error });
  }
});

export default googleMetricsRouter;