export type UserRole =
  | "platform_super_admin"
  | "platform_operator"
  | "merchant_owner"
  | "store_manager"
  | "store_staff"
  | "consumer"
  | "partner";

export type MerchantStatus = "pending" | "approved" | "rejected" | "suspended";
export type ProductStatus = "draft" | "on_sale" | "off_sale" | "blocked";
export type OrderStatus =
  | "pending_payment"
  | "pending_delivery"
  | "pending_receipt"
  | "completed"
  | "cancelled"
  | "after_sale";

export interface PageQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface TenantScopedEntity {
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
