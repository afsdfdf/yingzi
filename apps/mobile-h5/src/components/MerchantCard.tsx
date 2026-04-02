import { formatIndustry } from "../lib/format";
import type { Merchant } from "../types";

type MerchantCardProps = {
  merchant: Merchant;
  onOpen: (merchantId: string) => void;
};

export function MerchantCard({ merchant, onOpen }: MerchantCardProps) {
  return (
    <article className="merchant-card">
      <img className="merchant-thumb" src={merchant.coverImage} alt={merchant.name} />
      <div className="merchant-content">
        <strong>{merchant.name}</strong>
        <span>{`${merchant.city} · ${formatIndustry(merchant.industryType)}`}</span>
        <small>{merchant.status === "approved" ? "营业中" : "待完善"}</small>
      </div>
      <button onClick={() => onOpen(merchant.id)}>进店</button>
    </article>
  );
}
