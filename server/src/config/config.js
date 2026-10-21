import { configDotenv } from "dotenv";
configDotenv();

export const config = {
  PORT: process.env.PORT,
  GITHUB_APP_ID: process.env.GITHUB_APP_ID,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_PRIVATE_KEY_PATH: process.env.GITHUB_PRIVATE_KEY_PATH,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
}