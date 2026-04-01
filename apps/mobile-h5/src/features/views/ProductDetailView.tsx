import type { Merchant, Product } from "../../types";

type ProductDetailViewProps = {
  product: Product;
  merchant?: Merchant;
  cartCount: number;
  onBack: () => void;
  onOpenMerchant: (merchantId: string) => void;
  onAddToCart: (productId: string) => void;
};

export function ProductDetailView({
  product,
  merchant,
  cartCount,
  onBack,
  onOpenMerchant,
  onAddToCart
}: ProductDetailViewProps) {
  return (
    <>
      <section className="detail-hero">
        <button className="back-button" onClick={onBack}>
          返回
        </button>
        <img className="detail-cover" src={product.imageUrl} alt={product.name} />
      </section>

      <section className="section-block">
        <div className="detail-body">
          <div className="detail-chip">{product.categoryName}</div>
          <h1>{product.name}</h1>
          <p>{`销量 ${product.sales} · ${product.status === "on_sale" ? "在售" : "预览中"}`}</p>
          <div className="detail-price">{`Y ${product.price}`}</div>
          <div className="detail-actions">
            <button className="ghost-cta" onClick={() => onAddToCart(product.id)}>
              {`加入购物车${cartCount > 0 ? ` (${cartCount})` : ""}`}
            </button>
            <button className="primary-cta" onClick={() => onAddToCart(product.id)}>
              立即购买
            </button>
          </div>
        </div>
      </section>

      {merchant ? (
        <section className="section-block">
          <div className="merchant-inline">
            <img className="merchant-thumb" src={merchant.coverImage} alt={merchant.name} />
            <div>
              <strong>{merchant.name}</strong>
              <span>{merchant.city}</span>
            </div>
            <button onClick={() => onOpenMerchant(merchant.id)}>进店</button>
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-title">
          <div>
            <h2>商品图集</h2>
            <p>查看细节图和展示图</p>
          </div>
          <span>{`${product.galleryImages.length} 张`}</span>
        </div>
        <div className="gallery-strip">
          {product.galleryImages.map((image) => (
            <img key={image} className="gallery-thumb" src={image} alt={product.name} />
          ))}
        </div>
      </section>
    </>
  );
}
