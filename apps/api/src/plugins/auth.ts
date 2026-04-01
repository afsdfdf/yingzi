import jwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import type { UserRole } from "../shared/types.js";

const authPluginImpl: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "yingzi-dev-secret"
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send({
        message: "Unauthorized",
        detail: error instanceof Error ? error.message : "Invalid token"
      });
    }
  });

  app.decorate("authorize", (roles: UserRole[]) => {
    return async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.code(401).send({
          message: "Unauthorized",
          detail: error instanceof Error ? error.message : "Invalid token"
        });
        return;
      }

      if (!roles.includes(request.user.role)) {
        reply.code(403).send({
          message: "Forbidden",
          detail: `Required roles: ${roles.join(", ")}`
        });
      }
    };
  });
};

export const authPlugin = fp(authPluginImpl, {
  name: "auth-plugin"
});
