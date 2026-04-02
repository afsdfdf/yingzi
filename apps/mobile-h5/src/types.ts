export type Merchant = {
  id: string;
  name: string;
  city: string;
  coverImage: string;
  galleryImages: string[];
  industryType: string;
  status: string;
};

export type Product = {
  id: string;
  merchantId: string;
  categoryName: string;
  name: string;
  imageUrl: string;
  galleryImages: string[];
  price: number;
  sales: number;
  status: string;
};

export type HomeResponse = {
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
  }>;
  categories: Array<{
    code: string;
    name: string;
  }>;
};

export type ListResponse<T> = {
  items: T[];
  total?: number;
};

export type AuthUser = {
  id: string;
  tenantId: string | null;
  name: string;
  phone: string;
  role: string;
  permissions?: string[];
  lastLoginAt?: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartItemWithProduct = CartItem & {
  product: Product | null;
};

export type CartResponse = {
  userId: string;
  updatedAt: string;
  items: CartItemWithProduct[];
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type OrderRecord = {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  itemCount: number;
  status: string;
  address: string;
  remark: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type TabKey = "home" | "discover" | "cart" | "orders" | "profile";

export type Screen =
  | { type: "tab"; tab: TabKey }
  | { type: "merchant"; merchantId: string }
  | { type: "product"; productId: string };
