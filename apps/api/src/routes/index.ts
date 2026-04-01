import type { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/routes.js";
import { bannerRoutes } from "../modules/banner/routes.js";
import { cartRoutes } from "../modules/cart/routes.js";
import { dashboardRoutes } from "../modules/dashboard/routes.js";
import { merchantRoutes } from "../modules/merchant/routes.js";
import { orderRoutes } from "../modules/order/routes.js";
import { productRoutes } from "../modules/product/routes.js";
import { promotionRoutes } from "../modules/promotion/routes.js";
import { storefrontRoutes } from "../modules/storefront/routes.js";
import { systemRoutes } from "../modules/system/routes.js";
import { userRoutes } from "../modules/user/routes.js";

export function registerRoutes(app: FastifyInstance) {
  app.register(
    async (api) => {
      api.register(authRoutes, { prefix: "/auth" });
      api.register(cartRoutes, { prefix: "/cart" });
      api.register(storefrontRoutes, { prefix: "/storefront" });
      api.register(dashboardRoutes, { prefix: "/overview" });
      api.register(userRoutes, { prefix: "/users" });
      api.register(merchantRoutes, { prefix: "/merchants" });
      api.register(productRoutes, { prefix: "/products" });
      api.register(bannerRoutes, { prefix: "/banners" });
      api.register(promotionRoutes, { prefix: "/promotions" });
      api.register(orderRoutes, { prefix: "/orders" });
      api.register(systemRoutes, { prefix: "/system" });
    },
    { prefix: "/api/v1" }
  );
}
