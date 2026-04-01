import "@fastify/jwt";
import "fastify";
import type { UserRole } from "../shared/types.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      tenantId: string | null;
      role: UserRole;
      name: string;
    };
    user: {
      userId: string;
      tenantId: string | null;
      role: UserRole;
      name: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: import("fastify").preHandlerHookHandler;
    authorize: (roles: UserRole[]) => import("fastify").preHandlerHookHandler;
  }
}
