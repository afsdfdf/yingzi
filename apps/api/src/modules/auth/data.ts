import type { UserRole } from "../../shared/types.js";

export interface AuthUserRecord {
  id: string;
  tenantId: string | null;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  status: "enabled" | "disabled";
  permissions: string[];
  lastLoginAt: string;
  createdAt: string;
}

export const authUsers: AuthUserRecord[] = [
  {
    id: "u_001",
    tenantId: null,
    name: "平台超管",
    phone: "13900000001",
    password: "Admin@123",
    role: "platform_super_admin",
    status: "enabled",
    permissions: ["dashboard:*", "merchant:*", "order:*", "product:*", "user:*"],
    lastLoginAt: "2026-04-01T08:10:00.000Z",
    createdAt: "2025-12-01T08:00:00.000Z"
  },
  {
    id: "u_002",
    tenantId: "tenant_001",
    name: "五金店老板",
    phone: "13900000002",
    password: "Merchant@123",
    role: "merchant_owner",
    status: "enabled",
    permissions: ["dashboard:read", "product:*", "order:*", "customer:*"],
    lastLoginAt: "2026-04-01T07:40:00.000Z",
    createdAt: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "u_003",
    tenantId: "tenant_003",
    name: "收银员小陈",
    phone: "13900000003",
    password: "Staff@123",
    role: "store_staff",
    status: "enabled",
    permissions: ["dashboard:read", "order:read"],
    lastLoginAt: "2026-03-31T12:00:00.000Z",
    createdAt: "2026-02-02T08:00:00.000Z"
  },
  {
    id: "u_004",
    tenantId: null,
    name: "普通用户张宁",
    phone: "13900000004",
    password: "User@123",
    role: "consumer",
    status: "enabled",
    permissions: ["storefront:*", "cart:*", "order:create", "order:read"],
    lastLoginAt: "2026-04-01T10:20:00.000Z",
    createdAt: "2026-03-10T08:00:00.000Z"
  }
];
