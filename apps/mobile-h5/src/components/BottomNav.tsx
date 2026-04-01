import type { TabKey } from "../types";

const navItems: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "home", label: "首页", icon: "首" },
  { key: "discover", label: "逛店", icon: "逛" },
  { key: "cart", label: "购物车", icon: "车" },
  { key: "orders", label: "订单", icon: "单" },
  { key: "profile", label: "我的", icon: "我" }
];

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={activeTab === item.key ? "nav-item active" : "nav-item"}
          onClick={() => onChange(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
