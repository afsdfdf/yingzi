import { useState } from "react";
import { SectionTitle } from "../../components/SectionTitle";
import type { AuthUser } from "../../types";

const serviceEntries = [
  { value: "12", label: "优惠券" },
  { value: "680", label: "积分" },
  { value: "2", label: "地址" },
  { value: "AI", label: "智能助手" }
];

const accountEntries = ["个人资料", "收货地址", "订单售后", "帮助中心", "在线客服"];

type ProfileViewProps = {
  currentUser: AuthUser | null;
  authPending: boolean;
  demoPhone: string;
  demoPassword: string;
  onLogin: (phone: string, password: string) => void;
  onLogout: () => void;
};

export function ProfileView({
  currentUser,
  authPending,
  demoPhone,
  demoPassword,
  onLogin,
  onLogout
}: ProfileViewProps) {
  const [phone, setPhone] = useState(demoPhone);
  const [password, setPassword] = useState(demoPassword);

  if (!currentUser) {
    return (
      <>
        <section className="section-block profile-hero">
          <div>
            <div className="avatar-badge">YG</div>
            <h2>游客账号</h2>
            <p>先登录演示用户账号，就可以查看真实购物车、订单和个人中心入口。</p>
          </div>
        </section>

        <section className="section-block">
          <SectionTitle title="用户登录" subtitle="当前先使用演示消费者账号联调用户端功能" />
          <div className="form-stack">
            <label className="form-field">
              <span>手机号</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label className="form-field">
              <span>密码</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button className="primary-cta wide-cta" onClick={() => onLogin(phone, password)} disabled={authPending}>
              {authPending ? "登录中..." : "登录演示账号"}
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="section-block profile-hero">
        <div>
          <div className="avatar-badge">{currentUser.name.slice(0, 1)}</div>
          <h2>{currentUser.name}</h2>
          <p>{`${currentUser.phone} · ${currentUser.role === "consumer" ? "普通用户" : currentUser.role}`}</p>
        </div>
        <button onClick={onLogout}>退出登录</button>
      </section>

      <section className="section-block">
        <SectionTitle title="我的服务" subtitle="用户中心常用入口" />
        <div className="status-grid">
          {serviceEntries.map((entry) => (
            <article key={entry.label} className="status-card">
              <strong>{entry.value}</strong>
              <span>{entry.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title="账户与帮助" subtitle="登录后可查看完整会员权益和售后记录" />
        <div className="stack-list">
          {accountEntries.map((entry) => (
            <article key={entry} className="list-card">
              <div>
                <strong>{entry}</strong>
                <span>进入对应功能页</span>
              </div>
              <div className="right-col">
                <strong>查看</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
