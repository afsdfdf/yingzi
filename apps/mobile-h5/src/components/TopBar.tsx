type TopBarProps = {
  onSearchClick: () => void;
  userLabel: string;
  onUserClick: () => void;
};

export function TopBar({ onSearchClick, userLabel, onUserClick }: TopBarProps) {
  return (
    <div className="topbar-wrap">
      <div className="topbar">
        <div className="location-pill">
          <span className="location-dot" />
          上海
        </div>
        <button className="search-pill" onClick={onSearchClick}>
          搜索商户、商品、活动和服务
        </button>
        <button className="login-pill" onClick={onUserClick}>
          {userLabel}
        </button>
      </div>
    </div>
  );
}
