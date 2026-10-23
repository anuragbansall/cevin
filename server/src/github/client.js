import { App } from "@octokit/app";
import { readFileSync } from "fs";
import { config } from "../config/config.js";

const app = new App({
  appId: config.GITHUB_APP_ID,
  privateKey: readFileSync(config.GITHUB_PRIVATE_KEY_PATH, "utf8"),
});

export async function getInstallationClient(installationId) {
  return app.getInstallationOctokit(Number(installationId));
}

export async function getInstallationToken(installationId) {
  const octokit = await getInstallationClient(installationId);
  const { data } = await octokit.request(
    "POST /app/installations/{installation_id}/access_tokens",
    { installation_id: Number(installationId) }
  );
  return data.token;
}
