import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { banners, createBanner, removeBanner, updateBanner } from "./data.js";

const bannerBodySchema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().url(),
  link: z.string().min(1),
  status: z.enum(["online", "offline"]),
  sort: z.coerce.number().int().nonnegative()
});

export const bannerRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async () => ({ items: banners })
  );

  app.get(
    "/:bannerId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ bannerId: z.string() }).parse(request.params);
      const banner = banners.find((item) => item.id === params.bannerId);
      if (!banner) return reply.code(404).send({ message: "横幅不存在" });
      return banner;
    }
  );

  app.post(
    "/",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const body = bannerBodySchema.parse(request.body);
      return reply.code(201).send(createBanner(body));
    }
  );

  app.patch(
    "/:bannerId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ bannerId: z.string() }).parse(request.params);
      const body = bannerBodySchema.partial().parse(request.body);
      const banner = updateBanner(params.bannerId, body);
      if (!banner) return reply.code(404).send({ message: "横幅不存在" });
      return banner;
    }
  );

  app.delete(
    "/:bannerId",
    { preHandler: [app.authorize(["platform_super_admin", "platform_operator"])] },
    async (request, reply) => {
      const params = z.object({ bannerId: z.string() }).parse(request.params);
      const banner = removeBanner(params.bannerId);
      if (!banner) return reply.code(404).send({ message: "横幅不存在" });
      return { success: true };
    }
  );
};
