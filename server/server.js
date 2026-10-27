import express from "express";
import { config } from "./src/config/config.js";
import githubWebhookRouter from "./src/routes/GithubWebhook.js";
import { startWorker } from "./src/message-queue/worker.js";

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Server is running!" });
})

app.use("/api/github/webhook", githubWebhookRouter);

app.listen(config.PORT, () => {
  console.log('Server is running...');
})

startWorker().catch((err) => {
  console.error("Failed to start worker:", err);
  process.exit(1);
})