import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { paginate } from "../../shared/pagination.js";
import { createMerchant, merchants, removeMerchant, updateMerchant } from "./data.js";

const merchantQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  keyword: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional()
});

const merchantBodySchema = z.object({
  tenantId: z.string().optional(),
  name: z.string().min(2),
  industryType: z.enum(["building_materials", "auction", "retail"]),
  contactName: z.string().min(2),
  contactPhone: z.string().min(11),
  city: z.string().min(2),
  address: z.string().min(4),
  businessHours: z.string().min(3),
  description: z.string().min(6),
  coverImage: z.string().url(),
  galleryImages: z.array(z.string().url()).min(1),
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
  storeCount: z.coerce.number().int().nonnegative(),
  employeeCount: z.coerce.number().int().nonnegative()
});

function canAccessMerchant(requestRole: string, requestTenantId: string | null, merchantTenantId: string) {
  return requestRole === "platform_super_admin" || requestRole === "platform_operator"
    ? true
    : requestTenantId === merchantTenantId;
}

export const merchantRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator", "merchant_owner"])]
    },
    async (request) => {
      const query = merchantQuerySchema.parse(request.query);
      const filtered = merchants.filter((merchant) => {
        const matchedKeyword = query.keyword
          ? merchant.name.includes(query.keyword) || merchant.contactName.includes(query.keyword)
          : true;
        const matchedStatus = query.status ? merchant.status === query.status : true;
        const matchedTenant = canAccessMerchant(
          request.user.role,
          request.user.tenantId,
          merchant.tenantId
        );

        return matchedKeyword && matchedStatus && matchedTenant;
      });

      return paginate(filtered, query);
    }
  );

  app.get(
    "/:merchantId",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator", "merchant_owner"])]
    },
    async (request, reply) => {
      const params = z.object({ merchantId: z.string() }).parse(request.params);
      const merchant = merchants.find((item) => item.id === params.merchantId);

      if (!merchant) {
        return reply.code(404).send({ message: "商户不存在" });
      }

      if (!canAccessMerchant(request.user.role, request.user.tenantId, merchant.tenantId)) {
        return reply.code(403).send({ message: "不能查看其他商户信息" });
      }

      return merchant;
    }
  );

  app.post(
    "/",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator"])]
    },
    async (request, reply) => {
      const body = merchantBodySchema.parse(request.body);
      const tenantId = body.tenantId ?? `tenant_${String(merchants.length + 1).padStart(3, "0")}`;
      return reply.code(201).send(createMerchant({ ...body, tenantId }));
    }
  );

  app.patch(
    "/:merchantId",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator", "merchant_owner"])]
    },
    async (request, reply) => {
      const params = z.object({ merchantId: z.string() }).parse(request.params);
      const body = merchantBodySchema.partial().parse(request.body);
      const existing = merchants.find((item) => item.id === params.merchantId);

      if (!existing) {
        return reply.code(404).send({ message: "商户不存在" });
      }

      if (!canAccessMerchant(request.user.role, request.user.tenantId, existing.tenantId)) {
        return reply.code(403).send({ message: "无权编辑其他商户" });
      }

      return updateMerchant(params.merchantId, body);
    }
  );

  app.patch(
    "/:merchantId/status",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator"])]
    },
    async (request, reply) => {
      const params = z.object({ merchantId: z.string() }).parse(request.params);
      const body = z
        .object({ status: z.enum(["pending", "approved", "rejected", "suspended"]) })
        .parse(request.body);
      const merchant = merchants.find((item) => item.id === params.merchantId);
      if (!merchant) {
        return reply.code(404).send({ message: "商户不存在" });
      }

      merchant.status = body.status;
      merchant.updatedAt = new Date().toISOString();
      return merchant;
    }
  );

  app.delete(
    "/:merchantId",
    {
      preHandler: [app.authorize(["platform_super_admin", "platform_operator"])]
    },
    async (request, reply) => {
      const params = z.object({ merchantId: z.string() }).parse(request.params);
      const merchant = removeMerchant(params.merchantId);

      if (!merchant) {
        return reply.code(404).send({ message: "商户不存在" });
      }

      return { success: true };
    }
  );
};
