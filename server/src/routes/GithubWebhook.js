import express from 'express';

const githubWebhookRouter = express.Router();

githubWebhookRouter.post("/", (req, res) => {
  console.log("Webhook received!");
  console.log("Event:", req.headers["x-github-event"]);
  console.log("Action:", req.body?.action);

  res.sendStatus(200);
});

export default githubWebhookRouter;