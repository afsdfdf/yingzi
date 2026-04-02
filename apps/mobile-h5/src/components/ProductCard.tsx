import { formatCurrency } from "../lib/format";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  actionLabel?: string;
  onOpen: (productId: string) => void;
};

export function ProductCard({ product, actionLabel = "查看详情", onOpen }: ProductCardProps) {
  return (
    <article className="product-card">
      <div
        className="product-cover"
        style={{
          backgroundImage: `linear-gradient(140deg, rgba(255,223,184,0.28), rgba(239,171,104,0.32)), url(${product.imageUrl})`
        }}
      >
        <span>{product.categoryName}</span>
      </div>
      <div className="product-body">
        <strong>{product.name}</strong>
        <div className="product-meta">
          <span>{`销量 ${product.sales}`}</span>
          <span>{product.status === "on_sale" ? "在售" : "预览"}</span>
        </div>
        <div className="product-footer">
          <em>{formatCurrency(product.price)}</em>
          <button onClick={() => onOpen(product.id)}>{actionLabel}</button>
        </div>
      </div>
    </article>
  );
}
