export interface PromotionRecord {
  id: string;
  title: string;
  type: "coupon" | "flash_sale" | "featured";
  status: "draft" | "active" | "ended";
  startAt: string;
  endAt: string;
  description: string;
}

export const promotions: PromotionRecord[] = [
  {
    id: "promo_001",
    title: "五金满减券",
    type: "coupon",
    status: "active",
    startAt: "2026-04-01T00:00:00.000Z",
    endAt: "2026-04-07T23:59:59.000Z",
    description: "满 299 减 50，适用于建材五金专区。"
  },
  {
    id: "promo_002",
    title: "连锁门店秒杀",
    type: "flash_sale",
    status: "draft",
    startAt: "2026-04-08T00:00:00.000Z",
    endAt: "2026-04-10T23:59:59.000Z",
    description: "限时爆款专区活动。"
  }
];

export function createPromotion(input: Omit<PromotionRecord, "id">) {
  const record: PromotionRecord = {
    ...input,
    id: `promo_${String(promotions.length + 1).padStart(3, "0")}`
  };
  promotions.unshift(record);
  return record;
}

export function updatePromotion(id: string, input: Partial<Omit<PromotionRecord, "id">>) {
  const promotion = promotions.find((item) => item.id === id);
  if (!promotion) return null;
  Object.assign(promotion, input);
  return promotion;
}

export function removePromotion(id: string) {
  const index = promotions.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const [removed] = promotions.splice(index, 1);
  return removed;
}
