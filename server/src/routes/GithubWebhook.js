import express from "express";
import { publish } from "../message-queue/publisher.js";
import { connect } from "../config/amqp.js";

const githubWebhookRouter = express.Router();

const sessionPromise = connect();

// Deduplication: track (repo, issue_number) pairs already queued.
// Prevents duplicate sandboxes from GitHub redeliveries of the same opened event.
const queuedIssues = new Set();

githubWebhookRouter.post("/", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const action = req.body?.action;

    console.log("Event:", event);
    console.log("Action:", action);

    if (event === "issues" && action === "opened") {
      console.log("🎉 A new GitHub issue was opened!");

      const { issue, repository, installation } = req.body;

      if (!issue || !repository) {
        return res.status(400).json({
          error: "Missing issue or repository in webhook payload",
        });
      }

      const jobKey = `${repository.full_name}#${issue.number}`;
      if (queuedIssues.has(jobKey)) {
        console.log(`⚠️  Duplicate delivery skipped: ${jobKey}`);
        return res.sendStatus(200);
      }
      queuedIssues.add(jobKey);

      const session = await sessionPromise;

      await publish(
        session,
        "github-issues",
        JSON.stringify({
          event,
          action,
          issue,
          repository,
          installation: installation
            ? { id: installation.id }
            : undefined,
          deliveryId: req.headers["x-github-delivery"],
        })
      );

      console.log("Installation ID:", installation?.id);
      console.log("✅ GitHub issue queued successfully");
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return res.sendStatus(500);
  }
});

export default githubWebhookRouter;
