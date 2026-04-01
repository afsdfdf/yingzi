import { ProductCard } from "../../components/ProductCard";
import { SectionTitle } from "../../components/SectionTitle";
import { formatIndustry } from "../../lib/format";
import type { Merchant, Product } from "../../types";

type MerchantDetailViewProps = {
  merchant: Merchant;
  products: Product[];
  onBack: () => void;
  onOpenProduct: (productId: string) => void;
};

export function MerchantDetailView({
  merchant,
  products,
  onBack,
  onOpenProduct
}: MerchantDetailViewProps) {
  const merchantProducts = products.filter((item) => item.merchantId === merchant.id);

  return (
    <>
      <section className="detail-hero">
        <button className="back-button" onClick={onBack}>
          返回
        </button>
        <img className="detail-cover" src={merchant.coverImage} alt={merchant.name} />
        <div className="detail-body">
          <h1>{merchant.name}</h1>
          <p>
            {merchant.city} · {formatIndustry(merchant.industryType)}
          </p>
        </div>
      </section>

      <section className="section-block">
        <SectionTitle
          title="门店相册"
          subtitle="展示店铺环境和到店场景"
          right={`${merchant.galleryImages.length} 张`}
        />
        <div className="gallery-strip">
          {merchant.galleryImages.map((image) => (
            <img key={image} className="gallery-thumb" src={image} alt={merchant.name} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle
          title="店内商品"
          subtitle="点击商品可进入商品详情"
          right={`${merchantProducts.length} 件`}
        />
        <div className="product-grid">
          {merchantProducts.map((product) => (
            <ProductCard key={product.id} product={product} actionLabel="详情" onOpen={onOpenProduct} />
          ))}
        </div>
      </section>
    </>
  );
}
