import { MerchantCard } from "../../components/MerchantCard";
import { ProductCard } from "../../components/ProductCard";
import { SectionTitle } from "../../components/SectionTitle";
import type { HomeResponse, Merchant, Product } from "../../types";

const quickEntries = [
  { title: "附近门店", desc: "按城市和距离浏览", icon: "店" },
  { title: "爆款热卖", desc: "平台精选商品", icon: "热" },
  { title: "优惠专区", desc: "领券后再下单", icon: "券" },
  { title: "AI 导购", desc: "快速找到合适商品", icon: "AI" }
];

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
  const featuredMerchants = props.merchants.slice(0, 3);
  const visibleProducts =
    props.selectedMerchant === "all"
      ? props.products
      : props.products.filter((item) => item.merchantId === props.selectedMerchant);

  return (
    <>
      <section className="hero-card">
        <div className="hero-headline">
          <span className="hero-chip">YINGZI USER</span>
          <h1>影子护卫用户端</h1>
          <p>覆盖建材五金、拍卖臻选和连锁零售的统一商城入口。</p>
        </div>
        <div className="hero-tags">
          {(props.home?.categories ?? []).map((item) => (
            <span key={item.code} className="hero-tag">
              {item.name}
            </span>
          ))}
        </div>
      </section>

      {props.home?.banners?.length ? (
        <section className="banner-stack">
          {props.home.banners.map((banner, index) => (
            <article key={banner.id} className={`banner-card banner-${index + 1}`}>
              <strong>{banner.title}</strong>
              <span>{banner.subtitle}</span>
            </article>
          ))}
        </section>
      ) : null}

      <section className="quick-grid">
        {quickEntries.map((item, index) => (
          <button
            key={item.title}
            className="quick-card quick-card-button"
            onClick={() => props.onQuickEntry(index < 2 ? "discover" : "promotion")}
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
          subtitle="先选店铺，再看店内商品"
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
          subtitle="支持点击进入商品详情和商户页"
          right={`${visibleProducts.length} 件`}
        />
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actionLabel="查看"
              onOpen={props.onOpenProduct}
            />
          ))}
        </div>
      </section>

      <section className="section-block promo-block">
        <SectionTitle
          title="平台活动"
          subtitle="优惠券、公告和 AI 导购入口会继续扩展"
          right="进行中"
        />
        <div className="promo-card">
          <strong>新人礼包</strong>
          <p>首单优惠、积分奖励和推荐活动已预留展示位，后续会接入真实活动配置。</p>
        </div>
      </section>
    </>
  );
}
