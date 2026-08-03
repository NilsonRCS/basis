import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error.js";
import { userRoutes } from "@/presentation/http/routes/user.routes.js";
import { makeUserControllers } from "./factories/user.factory.js";

function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof ZodError) {
      await reply.status(422).send({
        statusCode: 422,
        error: "Validation Error",
        issues: error.issues,
      });
      return;
    }

    if (error instanceof AppError) {
      await reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.message,
      });
      return;
    }

    app.log.error(error);
    await reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
    });
  });

  app.setNotFoundHandler((_request, reply) => {
    void reply.status(404).send({ statusCode: 404, error: "Route not found" });
  });

  app.get("/health", async () => ({ status: "tá vivo" }));

  void app.register(userRoutes(makeUserControllers()), { prefix: "/api" });

  return app;
}

export { buildApp };