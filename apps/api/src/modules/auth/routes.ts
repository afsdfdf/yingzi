import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { authUsers } from "./data.js";

const loginSchema = z.object({
  phone: z.string().min(11).max(11),
  password: z.string().min(6)
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = authUsers.find((item) => item.phone === body.phone);

    if (!user || user.password !== body.password) {
      return reply.code(401).send({
        message: "手机号或密码错误"
      });
    }

    if (user.status !== "enabled") {
      return reply.code(403).send({
        message: "账号已被禁用"
      });
    }

    const token = await reply.jwtSign({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      name: user.name
    });

    return {
      token,
      user: {
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions
      }
    };
  });

  app.get("/me", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.code(401).send({
        message: "Unauthorized",
        detail: error instanceof Error ? error.message : "Invalid token"
      });
    }

    const user = authUsers.find((item) => item.id === request.user.userId);

    if (!user) {
      return {
        id: request.user.userId,
        tenantId: request.user.tenantId,
        name: request.user.name,
        role: request.user.role
      };
    }

    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions,
      lastLoginAt: user.lastLoginAt
    };
  });
};
