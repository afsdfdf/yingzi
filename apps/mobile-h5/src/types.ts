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
};

export type TabKey = "home" | "discover" | "cart" | "orders" | "profile";

export type Screen =
  | { type: "tab"; tab: TabKey }
  | { type: "merchant"; merchantId: string }
  | { type: "product"; productId: string };

export type CartItem = {
  productId: string;
  quantity: number;
};
