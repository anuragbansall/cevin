import { AMQPSession } from "@cloudamqp/amqp-client"
import { config } from "./config.js"

// The session reconnects automatically and recovers consumers
export function connect() {
  return AMQPSession.connect(config.CLOUDAMQP_URL)
}