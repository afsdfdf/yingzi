import Fastify from "fastify";
import { authPlugin } from "./plugins/auth.js";
import { registerRoutes } from "./routes/index.js";

export function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "yingzi-api",
      timestamp: new Date().toISOString()
    };
  });

  app.get("/", async () => {
    return {
      name: "yingzi-guardian-platform-api",
      status: "running",
      docs: {
        health: "/health",
        login: "POST /api/v1/auth/login",
        me: "GET /api/v1/auth/me",
        overview: "GET /api/v1/overview",
        merchants: "GET /api/v1/merchants",
        products: "GET /api/v1/products",
        orders: "GET /api/v1/orders"
      },
      demoAccounts: [
        { role: "platform_super_admin", phone: "13900000001", password: "Admin@123" },
        { role: "merchant_owner", phone: "13900000002", password: "Merchant@123" },
        { role: "store_staff", phone: "13900000003", password: "Staff@123" }
      ]
    };
  });

  app.register(authPlugin);
  registerRoutes(app);

  return app;
}
