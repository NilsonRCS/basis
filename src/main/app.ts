import Fastify, { type FastifyInstance } from "fastify";

function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.get("/health", async () => {
    return { status: "tá vivo" };
  });

  return app;
}

export { buildApp };