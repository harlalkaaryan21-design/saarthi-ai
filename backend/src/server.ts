import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import paymentRoutes from "./routes/payment";
import whatsappRoutes from "./routes/whatsapp";
import agentRoutes from "./routes/agent";

app.use("/api/payment", paymentRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/agent", agentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Saarthi AI Backend is running",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});