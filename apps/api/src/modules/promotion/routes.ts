import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { createPromotion, promotions, removePromotion, updatePromotion } from "./data.js";

const promotionBodySchema = z.object({
  title: z.string().min(2),
  type: z.enum(["coupon", "flash_sale", "featured"]),
  status: z.enum(["draft", "active", "ended"]),
  startAt: z.string(),
  endAt: z.string(),
  description: z.string().min(2)
});

export const promotionRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async () => ({ items: promotions })
  );

  app.get(
    "/:promotionId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ promotionId: z.string() }).parse(request.params);
      const promotion = promotions.find((item) => item.id === params.promotionId);
      if (!promotion) return reply.code(404).send({ message: "活动不存在" });
      return promotion;
    }
  );

  app.post(
    "/",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const body = promotionBodySchema.parse(request.body);
      return reply.code(201).send(createPromotion(body));
    }
  );

  app.patch(
    "/:promotionId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ promotionId: z.string() }).parse(request.params);
      const body = promotionBodySchema.partial().parse(request.body);
      const promotion = updatePromotion(params.promotionId, body);
      if (!promotion) return reply.code(404).send({ message: "活动不存在" });
      return promotion;
    }
  );

  app.delete(
    "/:promotionId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ promotionId: z.string() }).parse(request.params);
      const promotion = removePromotion(params.promotionId);
      if (!promotion) return reply.code(404).send({ message: "活动不存在" });
      return { success: true };
    }
  );
};
