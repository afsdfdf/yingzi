import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { banners } from "../banner/data.js";
import { merchants } from "../merchant/data.js";
import { products } from "../product/data.js";
import { promotions } from "../promotion/data.js";

export const storefrontRoutes: FastifyPluginAsync = async (app) => {
  app.get("/home", async () => {
    return {
      banners: banners
        .filter((item) => item.status === "online")
        .sort((left, right) => left.sort - right.sort)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.link
        })),
      categories: [
        { code: "building_materials", name: "建材五金" },
        { code: "auction", name: "拍卖精选" },
        { code: "retail", name: "连锁门店" },
        { code: "ai_service", name: "AI 导购" }
      ],
      promotions: promotions.filter((item) => item.status === "active")
    };
  });

  app.get("/merchants", async () => {
    return {
      items: merchants
        .filter((item) => item.status === "approved" || item.status === "pending")
        .map((item) => ({
          id: item.id,
          name: item.name,
          city: item.city,
          address: item.address,
          businessHours: item.businessHours,
          description: item.description,
          coverImage: item.coverImage,
          galleryImages: item.galleryImages,
          industryType: item.industryType,
          status: item.status
        }))
    };
  });

  app.get("/merchants/:merchantId", async (request, reply) => {
    const params = z.object({ merchantId: z.string() }).parse(request.params);
    const merchant = merchants.find((item) => item.id === params.merchantId);

    if (!merchant) {
      return reply.code(404).send({ message: "商户不存在" });
    }

    return {
      ...merchant,
      products: products.filter((item) => item.merchantId === merchant.id && item.status !== "blocked")
    };
  });

  app.get("/products", async () => {
    return {
      items: products
        .filter((item) => item.status === "on_sale" || item.status === "draft")
        .map((item) => ({
          id: item.id,
          merchantId: item.merchantId,
          categoryName: item.categoryName,
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          galleryImages: item.galleryImages,
          price: item.price,
          sales: item.sales,
          stock: item.stock,
          status: item.status
        }))
    };
  });

  app.get("/products/:productId", async (request, reply) => {
    const params = z.object({ productId: z.string() }).parse(request.params);
    const product = products.find((item) => item.id === params.productId);

    if (!product) {
      return reply.code(404).send({ message: "商品不存在" });
    }

    const merchant = merchants.find((item) => item.id === product.merchantId);

    return {
      ...product,
      merchant: merchant
        ? {
            id: merchant.id,
            name: merchant.name,
            city: merchant.city,
            address: merchant.address,
            coverImage: merchant.coverImage
          }
        : null
    };
  });
}
