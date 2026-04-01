import type { FastifyPluginAsync } from "fastify";

export const systemRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/config",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator"])]
    },
    async () => {
      return {
        platformName: "影子护卫多业态综合管理平台",
        supportWechat: "yingzi-guard-service",
        upload: {
          maxImageSizeMb: 10,
          allowedImageTypes: ["jpg", "jpeg", "png", "webp"]
        },
        payment: {
          enabled: false,
          provider: "mock"
        }
      };
    }
  );
};
