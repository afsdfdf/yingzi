import { SectionTitle } from "../../components/SectionTitle";
import { formatCurrency } from "../../lib/format";
import type { AuthUser, OrderRecord } from "../../types";

const statuses = ["pending_payment", "pending_delivery", "pending_receipt", "completed", "after_sale"] as const;

type OrdersViewProps = {
  orders: OrderRecord[];
  currentUser: AuthUser | null;
  onOpenProduct: (productId: string) => void;
  onGoLogin: () => void;
};

function getStatusLabel(status: string) {
  switch (status) {
    case "pending_payment":
      return "待支付";
    case "pending_delivery":
      return "待发货";
    case "pending_receipt":
      return "待收货";
    case "completed":
      return "已完成";
    case "after_sale":
      return "售后中";
    case "cancelled":
      return "已取消";
    default:
      return status;
  }
}

export function OrdersView({ orders, currentUser, onOpenProduct, onGoLogin }: OrdersViewProps) {
  if (!currentUser) {
    return (
      <section className="section-block">
        <SectionTitle title="我的订单" subtitle="登录后可查看真实订单记录" right="未登录" />
        <div className="empty-state">
          <strong>登录后查看订单</strong>
          <span>用户端已支持真实订单接口，登录后可以查看待支付、待发货和售后中的订单。</span>
          <button className="primary-cta" onClick={onGoLogin}>
            去登录
          </button>
        </div>
      </section>
    );
  }

  const statusCards = statuses.map((status) => ({
    label: getStatusLabel(status),
    value: orders.filter((order) => order.status === status).length
  }));

  return (
    <>
      <section className="section-block">
        <SectionTitle title="我的订单" subtitle="常用订单状态快捷入口" />
        <div className="status-grid">
          {statusCards.map((item) => (
            <article key={item.label} className="status-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title="最近订单" subtitle="当前展示已登录用户的真实订单数据" />
        <div className="stack-list">
          {orders.map((item) => (
            <article
              key={item.id}
              className="list-card list-card-clickable"
              onClick={() => item.items[0] && onOpenProduct(item.items[0].productId)}
            >
              <div>
                <strong>{item.orderNo}</strong>
                <span>{item.items.map((orderItem) => orderItem.productName).join("、")}</span>
              </div>
              <div className="right-col">
                <strong>{formatCurrency(item.totalAmount)}</strong>
                <span>{getStatusLabel(item.status)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
