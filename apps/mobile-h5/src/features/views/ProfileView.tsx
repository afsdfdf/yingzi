import { SectionTitle } from "../../components/SectionTitle";

export function ProfileView() {
  return (
    <>
      <section className="section-block profile-hero">
        <div>
          <div className="avatar-badge">YG</div>
          <h2>游客账号</h2>
          <p>会员中心、优惠券、积分、地址管理和客服入口都会放在这里。</p>
        </div>
        <button>立即登录</button>
      </section>

      <section className="section-block">
        <SectionTitle title="我的服务" subtitle="用户中心常用入口" />
        <div className="status-grid">
          <article className="status-card">
            <strong>12</strong>
            <span>优惠券</span>
          </article>
          <article className="status-card">
            <strong>680</strong>
            <span>积分</span>
          </article>
          <article className="status-card">
            <strong>2</strong>
            <span>地址</span>
          </article>
          <article className="status-card">
            <strong>AI</strong>
            <span>智能助手</span>
          </article>
        </div>
      </section>
    </>
  );
}
