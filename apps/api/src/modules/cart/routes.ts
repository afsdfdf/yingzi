import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { products } from "../product/data.js";
import { addCartItem, clearCart, getOrCreateCart, removeCartItem, updateCartItem } from "./data.js";

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive()
});

const cartUpdateSchema = z.object({
  quantity: z.coerce.number().int()
});

export const cartRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request) => {
      const cart = getOrCreateCart(request.user.userId);

      return {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          product: products.find((entry) => entry.id === item.productId) ?? null
        }))
      };
    }
  );

  app.post(
    "/items",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request, reply) => {
      try {
        const body = cartItemSchema.parse(request.body);
        return reply.code(201).send(addCartItem(request.user.userId, body.productId, body.quantity));
      } catch (error) {
        return reply.code(400).send({
          message: error instanceof Error ? error.message : "加入购物车失败"
        });
      }
    }
  );

  app.patch(
    "/items/:productId",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const body = cartUpdateSchema.parse(request.body);
      const cart = updateCartItem(request.user.userId, params.productId, body.quantity);

      if (!cart) {
        return reply.code(404).send({ message: "购物车商品不存在" });
      }

      return cart;
    }
  );

  app.delete(
    "/items/:productId",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const cart = removeCartItem(request.user.userId, params.productId);

      if (!cart) {
        return reply.code(404).send({ message: "购物车商品不存在" });
      }

      return { success: true };
    }
  );

  app.delete(
    "/",
    {
      preHandler: [app.authorize(["consumer"])]
    },
    async (request) => {
      clearCart(request.user.userId);
      return { success: true };
    }
  );
};
