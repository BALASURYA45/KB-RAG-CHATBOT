import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { adminRouter } from "./routes/admin.route.js";
import { chatRouter } from "./routes/chat.route.js";
import { healthRouter } from "./routes/health.route.js";
import { ticketRouter } from "./routes/ticket.route.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { env } from "./utils/env.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendOrigin,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.use("/api/admin", adminRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/tickets", ticketRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
