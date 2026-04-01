export interface BannerRecord {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  status: "online" | "offline";
  sort: number;
  createdAt: string;
}

export const banners: BannerRecord[] = [
  {
    id: "b_001",
    title: "首页春季焕新",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    link: "/campaign/spring",
    status: "online",
    sort: 1,
    createdAt: "2026-04-01T09:00:00.000Z"
  },
  {
    id: "b_002",
    title: "拍卖臻品预展",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
    link: "/campaign/auction",
    status: "offline",
    sort: 2,
    createdAt: "2026-04-01T09:10:00.000Z"
  }
];

export function createBanner(input: Omit<BannerRecord, "id" | "createdAt">) {
  const record: BannerRecord = {
    ...input,
    id: `b_${String(banners.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString()
  };
  banners.unshift(record);
  return record;
}

export function updateBanner(id: string, input: Partial<Omit<BannerRecord, "id" | "createdAt">>) {
  const banner = banners.find((item) => item.id === id);
  if (!banner) return null;
  Object.assign(banner, input);
  return banner;
}

export function removeBanner(id: string) {
  const index = banners.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const [removed] = banners.splice(index, 1);
  return removed;
}
