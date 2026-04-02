import { SectionTitle } from "../../components/SectionTitle";
import { formatCurrency } from "../../lib/format";
import type { AuthUser, CartItem, Product } from "../../types";

type CartViewProps = {
  cart: CartItem[];
  products: Product[];
  currentUser: AuthUser | null;
  onOpenProduct: (productId: string) => void;
  onCheckout: () => void;
  onGoLogin: () => void;
};

export function CartView({
  cart,
  products,
  currentUser,
  onOpenProduct,
  onCheckout,
  onGoLogin
}: CartViewProps) {
  const cartRows = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { ...product, quantity: item.quantity };
    })
    .filter(Boolean) as Array<Product & { quantity: number }>;

  if (!currentUser) {
    return (
      <section className="section-block">
        <SectionTitle title="购物车" subtitle="登录后可同步查看和结算购物车" right="未登录" />
        <div className="empty-state">
          <strong>请先登录用户账号</strong>
          <span>登录后可以保存购物车、创建订单并查看订单状态。</span>
          <button className="primary-cta" onClick={onGoLogin}>
            去登录
          </button>
        </div>
      </section>
    );
  }

  if (!cartRows.length) {
    return (
      <section className="section-block">
        <SectionTitle title="购物车" subtitle="已加入的商品会出现在这里" right="0 件" />
        <div className="empty-state">
          <strong>购物车还是空的</strong>
          <span>先去首页或逛店页挑几件商品，再回来统一结算。</span>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <SectionTitle title="购物车" subtitle="确认商品后可以统一结算" right={`${cartRows.length} 件`} />
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
              <strong>{formatCurrency(item.price)}</strong>
              <span>{`x${item.quantity}`}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="summary-bar">
        <div>
          <span>合计</span>
          <strong>{formatCurrency(cartRows.reduce((sum, item) => sum + item.price * item.quantity, 0))}</strong>
        </div>
        <button className="primary-cta" onClick={onCheckout}>
          提交订单
        </button>
      </div>
    </section>
  );
}
