import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import metricsRouter from "./routes/metrics.router";
import googleMetricsRouter from "./routes/google-metrics.router";
import exp from "constants";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(helmet());

const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use("/metrics", metricsRouter);

app.use("/google-metrics", googleMetricsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
