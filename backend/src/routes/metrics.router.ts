import express, { Request, Response } from "express";
import { getServerMetrics } from "../controllers/metrics.controller";

const metricsRouter = express.Router();

metricsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const metrics = await getServerMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics", details: error });
  }
});

export default metricsRouter;