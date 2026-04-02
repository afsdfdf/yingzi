import { MerchantCard } from "../../components/MerchantCard";
import { ProductCard } from "../../components/ProductCard";
import { SectionTitle } from "../../components/SectionTitle";
import type { Merchant, Product } from "../../types";

type DiscoverViewProps = {
  merchants: Merchant[];
  products: Product[];
  onOpenMerchant: (merchantId: string) => void;
  onOpenProduct: (productId: string) => void;
};

export function DiscoverView({ merchants, products, onOpenMerchant, onOpenProduct }: DiscoverViewProps) {
  return (
    <>
      <section className="section-block">
        <SectionTitle title="店铺广场" subtitle="按业态和城市浏览商户" right={`${merchants.length} 家`} />
        <div className="merchant-list">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} onOpen={onOpenMerchant} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title="精选商品" subtitle="跨行业商品统一浏览" right={`${products.length} 件`} />
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} actionLabel="详情" onOpen={onOpenProduct} />
          ))}
        </div>
      </section>
    </>
  );
}
