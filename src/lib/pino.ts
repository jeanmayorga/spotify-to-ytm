const pino = require("pino");
import { Logger } from "pino";

export const logger: Logger = pino({
  transport: process.env.VERCEL
    ? null
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
});
