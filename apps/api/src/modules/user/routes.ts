import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { paginate } from "../../shared/pagination.js";
import { users } from "./data.js";

const userQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  keyword: z.string().optional(),
  role: z
    .enum([
      "platform_super_admin",
      "platform_operator",
      "merchant_owner",
      "store_manager",
      "store_staff",
      "consumer",
      "partner"
    ])
    .optional()
});

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator"])]
    },
    async (request) => {
      const query = userQuerySchema.parse(request.query);
      const filtered = users.filter((user) => {
        const matchedKeyword = query.keyword
          ? user.name.includes(query.keyword) || user.phone.includes(query.keyword)
          : true;
        const matchedRole = query.role ? user.role === query.role : true;

        return matchedKeyword && matchedRole;
      });

      return paginate(filtered, query);
    }
  );
};
