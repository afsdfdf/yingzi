type TopBarProps = {
  onSearchClick: () => void;
};

export function TopBar({ onSearchClick }: TopBarProps) {
  return (
    <div className="topbar-wrap">
      <div className="topbar">
        <div className="location-pill">
          <span className="location-dot" />
          上海
        </div>
        <button className="search-pill" onClick={onSearchClick}>
          搜索商户、商品和活动
        </button>
        <button className="login-pill">登录</button>
      </div>
    </div>
  );
}
