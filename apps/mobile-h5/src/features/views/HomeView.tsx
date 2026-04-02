import { MerchantCard } from "../../components/MerchantCard";
import { ProductCard } from "../../components/ProductCard";
import { SectionTitle } from "../../components/SectionTitle";
import { formatIndustry } from "../../lib/format";
import type { HomeResponse, Merchant, Product } from "../../types";

const quickEntries = [
  { key: "discover", title: "附近门店", desc: "按城市和距离浏览", icon: "店" },
  { key: "discover", title: "热卖榜单", desc: "平台精选好货", icon: "热" },
  { key: "promotion", title: "优惠专区", desc: "领券下单更划算", icon: "券" },
  { key: "promotion", title: "AI 导购", desc: "快速找合适商品", icon: "AI" }
] as const;

type HomeViewProps = {
  home: HomeResponse | null;
  merchants: Merchant[];
  products: Product[];
  selectedMerchant: string;
  onSelectMerchant: (merchantId: string) => void;
  onOpenMerchant: (merchantId: string) => void;
  onOpenProduct: (productId: string) => void;
  onQuickEntry: (kind: "discover" | "promotion") => void;
};

export function HomeView(props: HomeViewProps) {
  const featuredMerchants = props.merchants.slice(0, 4);
  const visibleProducts =
    props.selectedMerchant === "all"
      ? props.products.slice(0, 6)
      : props.products.filter((item) => item.merchantId === props.selectedMerchant).slice(0, 6);
  const banners = props.home?.banners ?? [];

  return (
    <>
      <section className="hero-card">
        {banners.length ? (
          <div className="hero-banner-carousel">
            {banners.map((banner, index) => (
              <article key={banner.id} className={`hero-banner hero-banner-${(index % 2) + 1}`}>
                <span className="hero-banner-tag">平台活动</span>
                <strong>{banner.title}</strong>
                <p>{banner.subtitle}</p>
              </article>
            ))}
          </div>
        ) : null}

        {banners.length > 1 ? (
          <div className="hero-banner-dots">
            {banners.map((banner, index) => (
              <span
                key={banner.id}
                className={index === 0 ? "hero-banner-dot active" : "hero-banner-dot"}
              />
            ))}
          </div>
        ) : null}

        <div className="hero-headline hero-headline-compact">
          <span className="hero-chip">YINGZI USER</span>
          <h1>影子护卫用户端</h1>
          <p>连接建材五金、拍卖精选和连锁零售的统一商城入口，随时浏览、比价、下单。</p>
        </div>

        <div className="hero-tags">
          {(props.home?.categories ?? []).map((item) => (
            <span key={item.code} className="hero-tag">
              {item.name}
            </span>
          ))}
        </div>

        <div className="hero-stats">
          <article className="hero-stat-card">
            <span>入驻商户</span>
            <strong>{props.merchants.length}</strong>
          </article>
          <article className="hero-stat-card">
            <span>在售商品</span>
            <strong>{props.products.length}</strong>
          </article>
          <article className="hero-stat-card">
            <span>重点业态</span>
            <strong>{formatIndustry(props.merchants[0]?.industryType ?? "retail")}</strong>
          </article>
        </div>
      </section>

      <section className="quick-grid">
        {quickEntries.map((item) => (
          <button
            key={`${item.title}-${item.key}`}
            className="quick-card quick-card-button"
            onClick={() => props.onQuickEntry(item.key)}
          >
            <div className="quick-icon">{item.icon}</div>
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </button>
        ))}
      </section>

      <section className="section-block">
        <SectionTitle
          title="推荐商户"
          subtitle="先选店铺，再看店内商品和服务"
          right={`${props.merchants.length} 家`}
        />
        <div className="merchant-tabs">
          <button
            className={props.selectedMerchant === "all" ? "merchant-tab active" : "merchant-tab"}
            onClick={() => props.onSelectMerchant("all")}
          >
            全部
          </button>
          {featuredMerchants.map((merchant) => (
            <button
              key={merchant.id}
              className={
                props.selectedMerchant === merchant.id ? "merchant-tab active" : "merchant-tab"
              }
              onClick={() => props.onSelectMerchant(merchant.id)}
            >
              {merchant.name}
            </button>
          ))}
        </div>
        <div className="merchant-list">
          {featuredMerchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} onOpen={props.onOpenMerchant} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle
          title="推荐商品"
          subtitle="支持直接进入商品详情，也可以回到商户页继续浏览"
          right={`${visibleProducts.length} 件`}
        />
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={props.onOpenProduct} />
          ))}
        </div>
      </section>

      <section className="section-block promo-block">
        <SectionTitle title="平台活动" subtitle="面向新客、会员和复购用户的运营位" right="持续更新" />
        <div className="promo-card">
          <strong>新人礼与限时活动</strong>
          <p>首单优惠、满减券、推荐购和 AI 导购入口已经预留，后续可以直接接真实活动配置。</p>
        </div>
      </section>
    </>
  );
}
