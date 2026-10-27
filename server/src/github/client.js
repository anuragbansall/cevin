import { App } from "@octokit/app";
import { readFileSync } from "fs";
import { config } from "../config/config.js";

function getPrivateKey() {
  if (config.GITHUB_PRIVATE_KEY) {
    // Render passes the key as an env var with literal \n — expand them
    return config.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n");
  }
  return readFileSync(config.GITHUB_PRIVATE_KEY_PATH, "utf8");
}

const app = new App({
  appId: config.GITHUB_APP_ID,
  privateKey: getPrivateKey(),
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
