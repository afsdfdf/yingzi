import type { FastifyPluginAsync } from "fastify";
import { dashboardSummary, orderTrend } from "./data.js";

export const dashboardRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager",
          "store_staff"
        ])
      ]
    },
    async () => {
      return {
        summary: dashboardSummary,
        orderTrend
      };
    }
  );
};
