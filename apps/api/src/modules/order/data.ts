import type { OrderStatus } from "../../shared/types.js";
import { authUsers } from "../auth/data.js";
import { products } from "../product/data.js";

export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  tenantId: string;
  merchantId: string;
  userId: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  itemCount: number;
  status: OrderStatus;
  address: string;
  remark: string;
  items: OrderItemRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreationInput {
  userId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  remark?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export const orders: OrderRecord[] = [
  {
    id: "o_001",
    tenantId: "tenant_001",
    merchantId: "m_001",
    userId: "u_004",
    orderNo: "YZ202604010001",
    customerName: "王晓雨",
    customerPhone: "13900000004",
    totalAmount: 396,
    itemCount: 2,
    status: "pending_delivery",
    address: "上海市浦东新区秀沿路 88 弄 6 号楼 302",
    remark: "工作日白天送达",
    items: [
      { productId: "p_001", productName: "304 不锈钢防盗门锁", quantity: 2, price: 198 }
    ],
    createdAt: "2026-04-01T01:12:00.000Z",
    updatedAt: "2026-04-01T01:20:00.000Z"
  },
  {
    id: "o_002",
    tenantId: "tenant_003",
    merchantId: "m_003",
    userId: "u_004",
    orderNo: "YZ202604010002",
    customerName: "李佳豪",
    customerPhone: "13900000004",
    totalAmount: 269.7,
    itemCount: 3,
    status: "completed",
    address: "苏州市工业园区星湖街 188 号",
    remark: "",
    items: [
      { productId: "p_003", productName: "家庭装东北大米 10kg", quantity: 3, price: 89.9 }
    ],
    createdAt: "2026-04-01T02:15:00.000Z",
    updatedAt: "2026-04-01T05:00:00.000Z"
  },
  {
    id: "o_003",
    tenantId: "tenant_003",
    merchantId: "m_003",
    userId: "u_004",
    orderNo: "YZ202604010003",
    customerName: "陈思琪",
    customerPhone: "13900000004",
    totalAmount: 89.9,
    itemCount: 1,
    status: "after_sale",
    address: "苏州市高新区塔园路 66 号",
    remark: "申请换货",
    items: [
      { productId: "p_003", productName: "家庭装东北大米 10kg", quantity: 1, price: 89.9 }
    ],
    createdAt: "2026-04-01T03:45:00.000Z",
    updatedAt: "2026-04-01T06:10:00.000Z"
  }
];

export function updateOrderStatus(id: string, status: OrderStatus) {
  const order = orders.find((item) => item.id === id);
  if (!order) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}

export function createOrder(input: OrderCreationInput) {
  const user = authUsers.find((item) => item.id === input.userId);
  const normalizedItems = input.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);

    if (!product || item.quantity <= 0) {
      throw new Error("订单商品信息无效");
    }

    if (product.stock < item.quantity) {
      throw new Error(`商品库存不足: ${product.name}`);
    }

    return {
      product,
      quantity: item.quantity
    };
  });

  const merchantId = normalizedItems[0]?.product.merchantId;
  const tenantId = normalizedItems[0]?.product.tenantId;

  if (!merchantId || !tenantId) {
    throw new Error("订单商品不能为空");
  }

  const sameMerchant = normalizedItems.every((item) => item.product.merchantId === merchantId);

  if (!sameMerchant) {
    throw new Error("当前演示版本仅支持同一商户商品一起下单");
  }

  normalizedItems.forEach(({ product, quantity }) => {
    product.stock -= quantity;
    product.sales += quantity;
    product.updatedAt = new Date().toISOString();
  });

  const timestamp = new Date().toISOString();
  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
  const record: OrderRecord = {
    id: `o_${String(orders.length + 1).padStart(3, "0")}`,
    tenantId,
    merchantId,
    userId: input.userId,
    orderNo: `YZ${timestamp.slice(0, 10).replaceAll("-", "")}${String(orders.length + 1).padStart(4, "0")}`,
    customerName: input.customerName || user?.name || "匿名用户",
    customerPhone: input.customerPhone || user?.phone || "",
    totalAmount: Number(totalAmount.toFixed(2)),
    itemCount,
    status: "pending_payment",
    address: input.address,
    remark: input.remark ?? "",
    items: normalizedItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  orders.unshift(record);
  return record;
}
