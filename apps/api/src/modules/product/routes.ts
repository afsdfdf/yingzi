import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { merchants } from "../merchant/data.js";
import { paginate } from "../../shared/pagination.js";
import { createProduct, products, removeProduct, setProductStatus, updateProduct } from "./data.js";

const productQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  keyword: z.string().optional(),
  merchantId: z.string().optional(),
  status: z.enum(["draft", "on_sale", "off_sale", "blocked"]).optional()
});

const productBodySchema = z.object({
  merchantId: z.string().optional(),
  categoryName: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(6),
  imageUrl: z.string().url(),
  galleryImages: z.array(z.string().url()).min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  status: z.enum(["draft", "on_sale", "off_sale", "blocked"])
});

const productUpdateSchema = productBodySchema.partial();

function canAccessTenant(role: string, productTenantId: string, requestTenantId: string | null) {
  return role === "platform_super_admin" || role === "platform_operator"
    ? true
    : productTenantId === requestTenantId;
}

function resolveMerchantContext(userRole: string, tenantId: string | null, merchantId?: string) {
  if (userRole === "platform_super_admin" || userRole === "platform_operator") {
    const merchant = merchants.find((item) => item.id === merchantId);
    return merchant ? { tenantId: merchant.tenantId, merchantId: merchant.id } : null;
  }

  const merchant = merchants.find((item) => item.tenantId === tenantId);
  return merchant ? { tenantId: merchant.tenantId, merchantId: merchant.id } : null;
}

export const productRoutes: FastifyPluginAsync = async (app) => {
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
    async (request) => {
      const query = productQuerySchema.parse(request.query);
      const filtered = products.filter((product) => {
        const matchedKeyword = query.keyword
          ? product.name.includes(query.keyword) || product.categoryName.includes(query.keyword)
          : true;
        const matchedMerchant = query.merchantId ? product.merchantId === query.merchantId : true;
        const matchedStatus = query.status ? product.status === query.status : true;
        const matchedTenant = canAccessTenant(
          request.user.role,
          product.tenantId,
          request.user.tenantId
        );

        return matchedKeyword && matchedMerchant && matchedStatus && matchedTenant;
      });

      return paginate(filtered, query);
    }
  );

  app.get(
    "/:productId",
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
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const product = products.find((item) => item.id === params.productId);

      if (!product) {
        return reply.code(404).send({ message: "商品不存在" });
      }

      if (!canAccessTenant(request.user.role, product.tenantId, request.user.tenantId)) {
        return reply.code(403).send({ message: "无权查看其他商户商品" });
      }

      return product;
    }
  );

  app.post(
    "/",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager"
        ])
      ]
    },
    async (request, reply) => {
      const body = productBodySchema.parse(request.body);
      const context = resolveMerchantContext(request.user.role, request.user.tenantId, body.merchantId);

      if (!context) {
        return reply.code(400).send({ message: "无法匹配商品所属商户" });
      }

      const product = createProduct({
        tenantId: context.tenantId,
        merchantId: context.merchantId,
        categoryName: body.categoryName,
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        galleryImages: body.galleryImages,
        price: body.price,
        stock: body.stock,
        status: body.status
      });

      return reply.code(201).send(product);
    }
  );

  app.patch(
    "/:productId",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager"
        ])
      ]
    },
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const body = productUpdateSchema.parse(request.body);
      const existing = products.find((item) => item.id === params.productId);

      if (!existing) {
        return reply.code(404).send({ message: "商品不存在" });
      }

      if (!canAccessTenant(request.user.role, existing.tenantId, request.user.tenantId)) {
        return reply.code(403).send({ message: "无权编辑其他商户商品" });
      }

      return updateProduct(params.productId, body);
    }
  );

  app.patch(
    "/:productId/status",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager"
        ])
      ]
    },
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const body = z.object({ status: z.enum(["draft", "on_sale", "off_sale", "blocked"]) }).parse(request.body);
      const existing = products.find((item) => item.id === params.productId);

      if (!existing) {
        return reply.code(404).send({ message: "商品不存在" });
      }

      if (!canAccessTenant(request.user.role, existing.tenantId, request.user.tenantId)) {
        return reply.code(403).send({ message: "无权操作其他商户商品" });
      }

      return setProductStatus(params.productId, body.status);
    }
  );

  app.delete(
    "/:productId",
    {
      preHandler: [
        app.authorize([
          "platform_super_admin",
          "platform_operator",
          "merchant_owner",
          "store_manager"
        ])
      ]
    },
    async (request, reply) => {
      const params = z.object({ productId: z.string() }).parse(request.params);
      const existing = products.find((item) => item.id === params.productId);

      if (!existing) {
        return reply.code(404).send({ message: "商品不存在" });
      }

      if (!canAccessTenant(request.user.role, existing.tenantId, request.user.tenantId)) {
        return reply.code(403).send({ message: "无权删除其他商户商品" });
      }

      removeProduct(params.productId);
      return { success: true };
    }
  );
};
