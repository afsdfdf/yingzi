import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { paginate } from "../../shared/pagination.js";
import { clearCart } from "../cart/data.js";
import { createOrder, orders, updateOrderStatus } from "./data.js";

const orderStatuses = [
  "pending_payment",
  "pending_delivery",
  "pending_receipt",
  "completed",
  "cancelled",
  "after_sale"
] as const;

const orderQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  keyword: z.string().optional(),
  merchantId: z.string().optional(),
  status: z.enum(orderStatuses).optional()
});

const orderCreateSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(11),
  address: z.string().min(6),
  remark: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.coerce.number().int().positive()
      })
    )
    .min(1)
});

function canAccessOrder(
  role: string,
  requestTenantId: string | null,
  orderTenantId: string,
  orderUserId: string,
  currentUserId: string
) {
  if (role === "platform_super_admin" || role === "platform_operator") {
    return true;
  }

  if (role === "consumer") {
    return orderUserId === currentUserId;
  }

  return orderTenantId === requestTenantId;
}

export const orderRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager",
          "store_staff",
          "consumer"
        ])
      ]
    },
    async (request) => {
      const query = orderQuerySchema.parse(request.query);
      const filtered = orders.filter((order) => {
        const matchedKeyword = query.keyword
          ? order.orderNo.includes(query.keyword) || order.customerName.includes(query.keyword)
          : true;
        const matchedMerchant = query.merchantId ? order.merchantId === query.merchantId : true;
        const matchedStatus = query.status ? order.status === query.status : true;
        const matchedScope = canAccessOrder(
          request.user.role,
          request.user.tenantId,
          order.tenantId,
          order.userId,
          request.user.userId
        );

        return matchedKeyword && matchedMerchant && matchedStatus && matchedScope;
      });

      return paginate(filtered, query);
    }
  );

  app.get(
    "/:orderId",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager",
          "store_staff",
          "consumer"
        ])
      ]
    },
    async (request, reply) => {
      const params = z.object({ orderId: z.string() }).parse(request.params);
      const order = orders.find((item) => item.id === params.orderId);

      if (!order) {
        return reply.code(404).send({ message: "订单不存在" });
      }

      const matchedScope = canAccessOrder(
        request.user.role,
        request.user.tenantId,
        order.tenantId,
        order.userId,
        request.user.userId
      );

      if (!matchedScope) {
        return reply.code(403).send({ message: "无权查看该订单" });
      }

      return order;
    }
  );

  app.post(
    "/",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request, reply) => {
      try {
        const body = orderCreateSchema.parse(request.body);
        const order = createOrder({
          userId: request.user.userId,
          customerName: body.customerName,
          customerPhone: body.customerPhone,
          address: body.address,
          remark: body.remark,
          items: body.items
        });
        clearCart(request.user.userId);
        return reply.code(201).send(order);
      } catch (error) {
        return reply.code(400).send({
          message: error instanceof Error ? error.message : "创建订单失败"
        });
      }
    }
  );

  app.patch(
    "/:orderId/status",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager",
          "consumer"
        ])
      ]
    },
    async (request, reply) => {
      const params = z.object({ orderId: z.string() }).parse(request.params);
      const body = z.object({ status: z.enum(orderStatuses) }).parse(request.body);
      const order = orders.find((item) => item.id === params.orderId);

      if (!order) {
        return reply.code(404).send({ message: "订单不存在" });
      }

      const matchedScope = canAccessOrder(
        request.user.role,
        request.user.tenantId,
        order.tenantId,
        order.userId,
        request.user.userId
      );

      if (!matchedScope) {
        return reply.code(403).send({ message: "无权操作该订单" });
      }

      if (
        request.user.role === "consumer" &&
        !["cancelled", "completed", "after_sale"].includes(body.status)
      ) {
        return reply.code(403).send({ message: "当前角色不能设置该订单状态" });
      }

      return updateOrderStatus(params.orderId, body.status);
    }
  );
};
