import type { ProductStatus } from "../../shared/types.js";

export interface ProductRecord {
  id: string;
  tenantId: string;
  merchantId: string;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  price: number;
  stock: number;
  sales: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMutationInput {
  tenantId: string;
  merchantId: string;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  price: number;
  stock: number;
  status: ProductStatus;
}

export const products: ProductRecord[] = [
  {
    id: "p_001",
    tenantId: "tenant_001",
    merchantId: "m_001",
    categoryName: "门锁",
    name: "304 不锈钢防盗门锁",
    description: "适配入户门与仓库门，支持指纹、密码和机械钥匙三种开锁方式。",
    imageUrl: "https://images.unsplash.com/photo-1565538420870-da08ff96a207?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1565538420870-da08ff96a207?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582582429416-47fffe9f4d96?auto=format&fit=crop&w=900&q=80"
    ],
    price: 198,
    stock: 126,
    sales: 845,
    status: "on_sale",
    createdAt: "2026-02-02T08:00:00.000Z",
    updatedAt: "2026-04-01T07:00:00.000Z"
  },
  {
    id: "p_002",
    tenantId: "tenant_002",
    merchantId: "m_002",
    categoryName: "艺术拍品",
    name: "清代青花瓷瓶专场拍品",
    description: "馆藏级瓷器预展拍品，支持线下看样和专场竞拍登记。",
    imageUrl: "https://images.unsplash.com/photo-1578922864601-79dcc7cbcea9?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1578922864601-79dcc7cbcea9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    ],
    price: 68000,
    stock: 1,
    sales: 0,
    status: "draft",
    createdAt: "2026-03-01T08:00:00.000Z",
    updatedAt: "2026-03-18T07:00:00.000Z"
  },
  {
    id: "p_003",
    tenantId: "tenant_003",
    merchantId: "m_003",
    categoryName: "粮油副食",
    name: "家庭装东北大米 10kg",
    description: "连锁门店热销主粮，适合家庭采购，支持到店自提和次日达。",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80"
    ],
    price: 89.9,
    stock: 420,
    sales: 3120,
    status: "on_sale",
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-04-01T06:00:00.000Z"
  }
];

export function createProduct(input: ProductMutationInput) {
  const timestamp = new Date().toISOString();
  const nextId = `p_${String(products.length + 1).padStart(3, "0")}`;
  const record: ProductRecord = {
    id: nextId,
    ...input,
    sales: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  products.unshift(record);
  return record;
}

export function updateProduct(id: string, input: Partial<Omit<ProductMutationInput, "tenantId" | "merchantId">>) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    return null;
  }

  Object.assign(product, input);
  product.updatedAt = new Date().toISOString();
  return product;
}

export function setProductStatus(id: string, status: ProductStatus) {
  return updateProduct(id, { status });
}

export function removeProduct(id: string) {
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = products.splice(index, 1);
  return removed;
}
