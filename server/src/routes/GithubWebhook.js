import express from "express";
import { publish } from "../message-queue/publisher.js";
import { connect } from "../config/amqp.js";

const githubWebhookRouter = express.Router();

const sessionPromise = connect();

githubWebhookRouter.post("/", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const action = req.body?.action;

    console.log("Event:", event);
    console.log("Action:", action);

    if (event === "issues" && action === "opened") {
      console.log("🎉 A new GitHub issue was opened!");

      const issue = req.body.issue;
      const repository = req.body.repository;

      const session = await sessionPromise;

      await publish(session, "github-issues", JSON.stringify({
        event,
        action,
        issue,
        repository,
      }));
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.sendStatus(500);
  }
});

export default githubWebhookRouter;