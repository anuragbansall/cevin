import { readFile, runBash } from "../ai-tools/tools.js";
import { connect } from "../config/amqp.js";
import { config } from "../config/config.js";
import { consume } from "./consumer.js";
import { Sandbox } from 'e2b'

const session = await connect();

try {
  await consume(session, "github-issues", async (message) => {
    const data = JSON.parse(message);

    console.log("🎉 Received GitHub issue!");
    // console.log("Repository:", data.repository);
    // console.log("Issue:", data.issue);

    const time = Date.now();
    const sandbox = await Sandbox.create({
      apiKey: config.E2B_API_KEY
    });

    const timeTook = (Date.now() - time) / 1000;
    console.log("✅ E2B sandbox created:", sandbox.sandboxId);
    console.log("Sandox started in " + timeTook + "s.");

    try {
      const REPO_PATH = `/home/user/${data.repository?.name}`;
      const REPO_URL = data.repository?.html_url;

      console.log("Cloning repository...");
      await sandbox.commands.run(`git clone --depth 1 ${REPO_URL} ${REPO_PATH}`, { timeoutMs: 120_000 });
      console.log("Repository cloned successfully...");

      try {
        // TODO: RUN AI Tool calls in this sandbox
        // Testing/mocking tools
        const out = await runBash(sandbox, "pwd", REPO_PATH);
        console.log(out);
  
        const out2 = await readFile(sandbox, REPO_PATH + '/Readme.md');
        console.log(out2);
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      console.error("❌ Sandbox command failed:", error);
    } finally {
      try {
        await sandbox.kill();
        console.log("✅ Sandbox stopped:", sandbox.sandboxId);
      } catch (cleanupError) {
        console.error(
          "❌ Failed to stop sandbox:",
          sandbox.sandboxId,
          cleanupError
        );
      }
    }
  });

  console.log("👂 Waiting for GitHub issues...");
} catch (error) {
  console.error("Worker error:", error);
  await session.stop();
  process.exitCode = 1;
}

process.on("SIGINT", async () => {
  await session.stop();
  process.exit(0);
});
