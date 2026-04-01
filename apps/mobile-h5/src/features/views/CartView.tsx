import { SectionTitle } from "../../components/SectionTitle";
import type { CartItem, Product } from "../../types";

type CartViewProps = {
  cart: CartItem[];
  products: Product[];
  onOpenProduct: (productId: string) => void;
};

export function CartView({ cart, products, onOpenProduct }: CartViewProps) {
  const cartRows = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { ...product, quantity: item.quantity };
    })
    .filter(Boolean) as Array<Product & { quantity: number }>;

  return (
    <section className="section-block">
      <SectionTitle title="购物车" subtitle="已加入的商品" right={`${cartRows.length} 件`} />
      <div className="stack-list">
        {cartRows.map((item) => (
          <article
            key={item.id}
            className="list-card list-card-clickable"
            onClick={() => onOpenProduct(item.id)}
          >
            <div>
              <strong>{item.name}</strong>
              <span>{item.categoryName}</span>
            </div>
            <div className="right-col">
              <strong>{`Y ${item.price}`}</strong>
              <span>x{item.quantity}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="summary-bar">
        <div>
          <span>合计</span>
          <strong>{`Y ${cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1)}`}</strong>
        </div>
        <button className="primary-cta">去结算</button>
      </div>
    </section>
  );
}
