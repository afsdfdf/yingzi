import { SectionTitle } from "../../components/SectionTitle";
import type { Product } from "../../types";

const mockOrderStates = [
  { label: "待支付", value: 2 },
  { label: "待发货", value: 4 },
  { label: "待收货", value: 1 },
  { label: "售后中", value: 1 }
];

type OrdersViewProps = {
  products: Product[];
  onOpenProduct: (productId: string) => void;
};

export function OrdersView({ products, onOpenProduct }: OrdersViewProps) {
  const recent = products.slice(0, 3);

  return (
    <>
      <section className="section-block">
        <SectionTitle title="我的订单" subtitle="常用订单状态快速入口" />
        <div className="status-grid">
          {mockOrderStates.map((item) => (
            <article key={item.label} className="status-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title="最近订单" subtitle="当前以演示数据承接订单流转" />
        <div className="stack-list">
          {recent.map((item, index) => (
            <article
              key={item.id}
              className="list-card list-card-clickable"
              onClick={() => onOpenProduct(item.id)}
            >
              <div>
                <strong>{`YZ-ORDER-00${index + 1}`}</strong>
                <span>{item.name}</span>
              </div>
              <div className="right-col">
                <strong>{`Y ${item.price}`}</strong>
                <span>{index === 0 ? "待发货" : index === 1 ? "已完成" : "售后中"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
