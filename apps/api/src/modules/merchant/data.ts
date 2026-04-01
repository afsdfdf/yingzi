import type { MerchantStatus } from "../../shared/types.js";

export interface MerchantRecord {
  id: string;
  tenantId: string;
  name: string;
  industryType: "building_materials" | "auction" | "retail";
  contactName: string;
  contactPhone: string;
  city: string;
  address: string;
  businessHours: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  status: MerchantStatus;
  storeCount: number;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantMutationInput {
  tenantId: string;
  name: string;
  industryType: MerchantRecord["industryType"];
  contactName: string;
  contactPhone: string;
  city: string;
  address: string;
  businessHours: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  status: MerchantStatus;
  storeCount: number;
  employeeCount: number;
}

export const merchants: MerchantRecord[] = [
  {
    id: "m_001",
    tenantId: "tenant_001",
    name: "盈泰五金建材",
    industryType: "building_materials",
    contactName: "刘成",
    contactPhone: "13800000001",
    city: "上海",
    address: "上海市闵行区虹桥建材市场 A12",
    businessHours: "08:30-20:30",
    description: "主营门锁、合页、卫浴五金和工程辅材，支持门店自提与同城配送。",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80"
    ],
    status: "approved",
    storeCount: 3,
    employeeCount: 18,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-03-30T09:00:00.000Z"
  },
  {
    id: "m_002",
    tenantId: "tenant_002",
    name: "盛景拍卖中心",
    industryType: "auction",
    contactName: "陈敏",
    contactPhone: "13800000002",
    city: "杭州",
    address: "杭州市上城区文博路 88 号",
    businessHours: "09:00-18:00",
    description: "提供艺术收藏、珠宝器物和专题拍卖服务，支持预展与线下竞拍。",
    coverImage: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80"
    ],
    status: "pending",
    storeCount: 1,
    employeeCount: 6,
    createdAt: "2026-02-08T09:00:00.000Z",
    updatedAt: "2026-03-29T09:00:00.000Z"
  },
  {
    id: "m_003",
    tenantId: "tenant_003",
    name: "邻里优选连锁店",
    industryType: "retail",
    contactName: "周洁",
    contactPhone: "13800000003",
    city: "苏州",
    address: "苏州市工业园区湖西商业街 19 号",
    businessHours: "07:30-22:00",
    description: "社区零售门店，覆盖日配粮油、家庭清洁和即时到家商品。",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=900&q=80"
    ],
    status: "approved",
    storeCount: 12,
    employeeCount: 65,
    createdAt: "2025-12-20T09:00:00.000Z",
    updatedAt: "2026-04-01T08:00:00.000Z"
  }
];

export function createMerchant(input: MerchantMutationInput) {
  const timestamp = new Date().toISOString();
  const record: MerchantRecord = {
    id: `m_${String(merchants.length + 1).padStart(3, "0")}`,
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  merchants.unshift(record);
  return record;
}

export function updateMerchant(id: string, input: Partial<MerchantMutationInput>) {
  const merchant = merchants.find((item) => item.id === id);

  if (!merchant) {
    return null;
  }

  Object.assign(merchant, input);
  merchant.updatedAt = new Date().toISOString();
  return merchant;
}

export function removeMerchant(id: string) {
  const index = merchants.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = merchants.splice(index, 1);
  return removed;
}
