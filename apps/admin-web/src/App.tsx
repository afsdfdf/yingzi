import { useEffect, useMemo, useState, type ReactNode } from "react";

type LoginUser = {
  id: string;
  tenantId: string | null;
  name: string;
  phone: string;
  role: string;
};

type LoginResponse = {
  token: string;
  user: LoginUser;
};

type Overview = {
  summary: {
    totalUsers: number;
    totalMerchants: number;
    totalOrders: number;
    totalTradeAmount: number;
  };
  orderTrend: Array<{ date: string; orders: number; amount: number }>;
};

type Merchant = {
  id: string;
  name: string;
  city: string;
  status: string;
  industryType: string;
};

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  totalAmount: number;
  status: string;
};

type Product = {
  id: string;
  merchantId: string;
  categoryName: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  status: "draft" | "on_sale" | "off_sale" | "blocked";
};

type Banner = {
  id: string;
  title: string;
  link: string;
  status: "online" | "offline";
  sort: number;
};

type Promotion = {
  id: string;
  title: string;
  type: string;
  status: "draft" | "active" | "ended";
  description: string;
};

type UserRow = {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: string;
};

type Config = {
  platformName: string;
  supportWechat: string;
  upload: { maxImageSizeMb: number; allowedImageTypes: string[] };
  payment: { enabled: boolean; provider: string };
};

type View =
  | "dashboard"
  | "merchant"
  | "product"
  | "banner"
  | "promotion"
  | "order"
  | "user"
  | "settings";

type ListRow = {
  title: string;
  sub: string;
  right?: string;
  control?: ReactNode;
};

const nav: Array<{ key: View; title: string; subtitle: string }> = [
  { key: "dashboard", title: "控制台", subtitle: "总览与趋势" },
  { key: "merchant", title: "商家管理", subtitle: "商户与门店" },
  { key: "product", title: "商品管理", subtitle: "发布与上下架" },
  { key: "banner", title: "横幅管理", subtitle: "首页轮播配置" },
  { key: "promotion", title: "促销活动", subtitle: "活动与优惠券" },
  { key: "order", title: "订单管理", subtitle: "订单与售后" },
  { key: "user", title: "用户管理", subtitle: "账号与权限" },
  { key: "settings", title: "系统设置", subtitle: "支付与上传" }
];

const demos = [
  ["平台超管", "13900000001", "Admin@123"],
  ["商户老板", "13900000002", "Merchant@123"],
  ["门店员工", "13900000003", "Staff@123"]
] as const;

const defaultProductForm = {
  merchantId: "m_001",
  categoryName: "门锁",
  name: "",
  price: "",
  stock: "",
  status: "draft" as Product["status"]
};

const defaultBannerForm = {
  title: "",
  imageUrl: "",
  link: "",
  sort: "1",
  status: "online" as Banner["status"]
};

const defaultPromotionForm = {
  title: "",
  type: "coupon",
  status: "draft" as Promotion["status"],
  startAt: "2026-04-01T00:00:00.000Z",
  endAt: "2026-04-07T23:59:59.000Z",
  description: ""
};

async function api<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function CardList({ rows }: { rows: ListRow[] }) {
  return (
    <div className="placeholder-list">
      {rows.map((row) => (
        <div key={`${row.title}-${row.sub}`} className="product-row">
          <div>
            <strong>{row.title}</strong>
            <span>{row.sub}</span>
          </div>
          <div className="product-row-actions">
            {row.right ? <strong>{row.right}</strong> : null}
            {row.control}
          </div>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [phone, setPhone] = useState("13900000001");
  const [password, setPassword] = useState("Admin@123");
  const [token, setToken] = useState("");
  const [view, setView] = useState<View>("dashboard");
  const [user, setUser] = useState<LoginUser | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [bannerForm, setBannerForm] = useState(defaultBannerForm);
  const [promotionForm, setPromotionForm] = useState(defaultPromotionForm);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPlatform = user?.role === "platform_super_admin" || user?.role === "platform_operator";
  const currentNav = useMemo(() => nav.find((item) => item.key === view) ?? nav[0], [view]);

  const loadAll = async (authToken: string) => {
    const [me, overviewData, merchantData, orderData, productData, bannerData, promotionData, userData, configData] =
      await Promise.all([
        api<LoginUser>("/api/v1/auth/me", authToken),
        api<Overview>("/api/v1/overview", authToken),
        api<{ items: Merchant[] }>("/api/v1/merchants", authToken).catch(() => ({ items: [] })),
        api<{ items: Order[] }>("/api/v1/orders", authToken),
        api<{ items: Product[] }>("/api/v1/products", authToken),
        api<{ items: Banner[] }>("/api/v1/banners", authToken).catch(() => ({ items: [] })),
        api<{ items: Promotion[] }>("/api/v1/promotions", authToken).catch(() => ({ items: [] })),
        api<{ items: UserRow[] }>("/api/v1/users", authToken).catch(() => ({ items: [] })),
        api<Config | null>("/api/v1/system/config", authToken).catch(() => null)
      ]);

    setUser(me);
    setOverview(overviewData);
    setMerchants(merchantData.items);
    setOrders(orderData.items);
    setProducts(productData.items);
    setBanners(bannerData.items);
    setPromotions(promotionData.items);
    setUsers(userData.items);
    setConfig(configData);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadAll(token).catch((loadError: Error) => setError(loadError.message));
  }, [token]);

  const run = async (task: () => Promise<void>, successMessage: string) => {
    setWorking(true);
    setError("");
    setSuccess("");

    try {
      await task();
      if (token) {
        await loadAll(token);
      }
      setSuccess(successMessage);
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "操作失败");
    } finally {
      setWorking(false);
    }
  };

  const renderDashboard = () => {
    if (!overview) {
      return null;
    }

    return (
      <>
        <div className="stats-grid">
          <article className="stat-card">
            <span>平台总用户</span>
            <strong>{overview.summary.totalUsers}</strong>
          </article>
          <article className="stat-card">
            <span>总商户数</span>
            <strong>{overview.summary.totalMerchants}</strong>
          </article>
          <article className="stat-card">
            <span>总订单数</span>
            <strong>{overview.summary.totalOrders}</strong>
          </article>
          <article className="stat-card">
            <span>总交易额</span>
            <strong>{`Y ${overview.summary.totalTradeAmount.toLocaleString()}`}</strong>
          </article>
        </div>
        <div className="content-grid">
          <section className="module-card">
            <div className="module-head">
              <h3>近 7 天订单趋势</h3>
              <span>经营热度</span>
            </div>
            <CardList
              rows={overview.orderTrend.map((item) => ({
                title: item.date,
                sub: `${item.orders} 单`,
                right: `Y ${item.amount.toLocaleString()}`
              }))}
            />
          </section>
          <section className="module-card">
            <div className="module-head">
              <h3>当前接入规模</h3>
              <span>模块概览</span>
            </div>
            <CardList
              rows={[
                { title: "商家管理", sub: `${merchants.length} 家商户` },
                { title: "商品管理", sub: `${products.length} 件商品` },
                { title: "横幅与活动", sub: `${banners.length} 个横幅 / ${promotions.length} 个活动` }
              ]}
            />
          </section>
        </div>
      </>
    );
  };

  const renderMerchants = () => (
    <section className="module-card">
      <div className="module-head">
        <h3>商家管理</h3>
        <span>{`${merchants.length} 家商户`}</span>
      </div>
      <CardList
        rows={merchants.map((merchant) => ({
          title: merchant.name,
          sub: `${merchant.city} · ${merchant.industryType}`,
          right: merchant.status,
          control: isPlatform ? (
            <select
              value={merchant.status}
              onChange={(event) =>
                void run(
                  () =>
                    api(`/api/v1/merchants/${merchant.id}/status`, token, {
                      method: "PATCH",
                      body: JSON.stringify({ status: event.target.value })
                    }).then(() => undefined),
                  "商户状态已更新"
                )
              }
            >
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已驳回</option>
              <option value="suspended">已暂停</option>
            </select>
          ) : undefined
        }))}
      />
    </section>
  );

  const renderProducts = () => (
    <div className="product-layout">
      <section className="module-card">
        <div className="module-head">
          <h3>发布商品</h3>
          <span>基础信息</span>
        </div>
        <div className="form-grid">
          {isPlatform ? (
            <label>
              所属商户
              <select
                value={productForm.merchantId}
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, merchantId: event.target.value }))
                }
              >
                {merchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label>
            商品分类
            <input
              value={productForm.categoryName}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, categoryName: event.target.value }))
              }
            />
          </label>
          <label>
            商品名称
            <input
              value={productForm.name}
              onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label>
            销售价
            <input
              value={productForm.price}
              onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
            />
          </label>
          <label>
            库存
            <input
              value={productForm.stock}
              onChange={(event) => setProductForm((current) => ({ ...current, stock: event.target.value }))}
            />
          </label>
          <label>
            状态
            <select
              value={productForm.status}
              onChange={(event) =>
                setProductForm((current) => ({
                  ...current,
                  status: event.target.value as Product["status"]
                }))
              }
            >
              <option value="draft">草稿</option>
              <option value="on_sale">上架</option>
              <option value="off_sale">下架</option>
              <option value="blocked">屏蔽</option>
            </select>
          </label>
        </div>
        <button
          className="primary-button wide-button"
          disabled={working}
          onClick={() =>
            void run(
              () =>
                api("/api/v1/products", token, {
                  method: "POST",
                  body: JSON.stringify({
                    ...(isPlatform ? { merchantId: productForm.merchantId } : {}),
                    categoryName: productForm.categoryName,
                    name: productForm.name,
                    price: Number(productForm.price),
                    stock: Number(productForm.stock),
                    status: productForm.status
                  })
                }).then(() => setProductForm(defaultProductForm)),
              "商品发布成功"
            )
          }
        >
          {working ? "提交中..." : "发布商品"}
        </button>
      </section>

      <section className="module-card">
        <div className="module-head">
          <h3>商品列表</h3>
          <span>{`${products.length} 件`}</span>
        </div>
        <CardList
          rows={products.map((product) => ({
            title: product.name,
            sub: `${product.categoryName} · 库存 ${product.stock} · 销量 ${product.sales}`,
            right: `Y ${product.price}`,
            control: (
              <select
                value={product.status}
                onChange={(event) =>
                  void run(
                    () =>
                      api(`/api/v1/products/${product.id}/status`, token, {
                        method: "PATCH",
                        body: JSON.stringify({ status: event.target.value })
                      }).then(() => undefined),
                    "商品状态已更新"
                  )
                }
              >
                <option value="draft">草稿</option>
                <option value="on_sale">上架</option>
                <option value="off_sale">下架</option>
                <option value="blocked">屏蔽</option>
              </select>
            )
          }))}
        />
      </section>
    </div>
  );

  const renderBanners = () => (
    <div className="product-layout">
      <section className="module-card">
        <div className="module-head">
          <h3>新增横幅</h3>
          <span>轮播配置</span>
        </div>
        <div className="form-grid">
          <label>
            标题
            <input
              value={bannerForm.title}
              onChange={(event) => setBannerForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label>
            图片地址
            <input
              value={bannerForm.imageUrl}
              onChange={(event) =>
                setBannerForm((current) => ({ ...current, imageUrl: event.target.value }))
              }
            />
          </label>
          <label>
            跳转链接
            <input
              value={bannerForm.link}
              onChange={(event) => setBannerForm((current) => ({ ...current, link: event.target.value }))}
            />
          </label>
          <label>
            排序
            <input
              value={bannerForm.sort}
              onChange={(event) => setBannerForm((current) => ({ ...current, sort: event.target.value }))}
            />
          </label>
          <label>
            状态
            <select
              value={bannerForm.status}
              onChange={(event) =>
                setBannerForm((current) => ({
                  ...current,
                  status: event.target.value as Banner["status"]
                }))
              }
            >
              <option value="online">上线</option>
              <option value="offline">下线</option>
            </select>
          </label>
        </div>
        <button
          className="primary-button wide-button"
          disabled={working}
          onClick={() =>
            void run(
              () =>
                api("/api/v1/banners", token, {
                  method: "POST",
                  body: JSON.stringify({ ...bannerForm, sort: Number(bannerForm.sort) })
                }).then(() => setBannerForm(defaultBannerForm)),
              "横幅已创建"
            )
          }
        >
          {working ? "提交中..." : "新增横幅"}
        </button>
      </section>

      <section className="module-card">
        <div className="module-head">
          <h3>横幅列表</h3>
          <span>{`${banners.length} 条`}</span>
        </div>
        <CardList
          rows={banners.map((banner) => ({
            title: banner.title,
            sub: `排序 ${banner.sort} · ${banner.link}`,
            right: banner.status,
            control: (
              <select
                value={banner.status}
                onChange={(event) =>
                  void run(
                    () =>
                      api(`/api/v1/banners/${banner.id}`, token, {
                        method: "PATCH",
                        body: JSON.stringify({ status: event.target.value })
                      }).then(() => undefined),
                    "横幅状态已更新"
                  )
                }
              >
                <option value="online">上线</option>
                <option value="offline">下线</option>
              </select>
            )
          }))}
        />
      </section>
    </div>
  );

  const renderPromotions = () => (
    <div className="product-layout">
      <section className="module-card">
        <div className="module-head">
          <h3>新增活动</h3>
          <span>活动配置</span>
        </div>
        <div className="form-grid">
          <label>
            标题
            <input
              value={promotionForm.title}
              onChange={(event) =>
                setPromotionForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </label>
          <label>
            类型
            <select
              value={promotionForm.type}
              onChange={(event) =>
                setPromotionForm((current) => ({ ...current, type: event.target.value }))
              }
            >
              <option value="coupon">优惠券</option>
              <option value="flash_sale">秒杀</option>
              <option value="featured">专题推荐</option>
            </select>
          </label>
          <label>
            状态
            <select
              value={promotionForm.status}
              onChange={(event) =>
                setPromotionForm((current) => ({
                  ...current,
                  status: event.target.value as Promotion["status"]
                }))
              }
            >
              <option value="draft">草稿</option>
              <option value="active">进行中</option>
              <option value="ended">已结束</option>
            </select>
          </label>
          <label>
            开始时间
            <input
              value={promotionForm.startAt}
              onChange={(event) =>
                setPromotionForm((current) => ({ ...current, startAt: event.target.value }))
              }
            />
          </label>
          <label>
            结束时间
            <input
              value={promotionForm.endAt}
              onChange={(event) =>
                setPromotionForm((current) => ({ ...current, endAt: event.target.value }))
              }
            />
          </label>
          <label>
            说明
            <input
              value={promotionForm.description}
              onChange={(event) =>
                setPromotionForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
        </div>
        <button
          className="primary-button wide-button"
          disabled={working}
          onClick={() =>
            void run(
              () =>
                api("/api/v1/promotions", token, {
                  method: "POST",
                  body: JSON.stringify(promotionForm)
                }).then(() => setPromotionForm(defaultPromotionForm)),
              "活动已创建"
            )
          }
        >
          {working ? "提交中..." : "新增活动"}
        </button>
      </section>

      <section className="module-card">
        <div className="module-head">
          <h3>活动列表</h3>
          <span>{`${promotions.length} 个`}</span>
        </div>
        <CardList
          rows={promotions.map((promotion) => ({
            title: promotion.title,
            sub: `${promotion.type} · ${promotion.description}`,
            right: promotion.status,
            control: (
              <select
                value={promotion.status}
                onChange={(event) =>
                  void run(
                    () =>
                      api(`/api/v1/promotions/${promotion.id}`, token, {
                        method: "PATCH",
                        body: JSON.stringify({ status: event.target.value })
                      }).then(() => undefined),
                    "活动状态已更新"
                  )
                }
              >
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="ended">已结束</option>
              </select>
            )
          }))}
        />
      </section>
    </div>
  );

  const renderOrders = () => (
    <section className="module-card">
      <div className="module-head">
        <h3>订单管理</h3>
        <span>{`${orders.length} 笔订单`}</span>
      </div>
      <CardList
        rows={orders.map((order) => ({
          title: order.orderNo,
          sub: `${order.customerName} · Y ${order.totalAmount}`,
          right: order.status,
          control: (
            <select
              value={order.status}
              onChange={(event) =>
                void run(
                  () =>
                    api(`/api/v1/orders/${order.id}/status`, token, {
                      method: "PATCH",
                      body: JSON.stringify({ status: event.target.value })
                    }).then(() => undefined),
                  "订单状态已更新"
                )
              }
            >
              <option value="pending_payment">待支付</option>
              <option value="pending_delivery">待发货</option>
              <option value="pending_receipt">待收货</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
              <option value="after_sale">售后中</option>
            </select>
          )
        }))}
      />
    </section>
  );

  const renderUsers = () => (
    <section className="module-card">
      <div className="module-head">
        <h3>用户管理</h3>
        <span>{`${users.length} 个账号`}</span>
      </div>
      <CardList
        rows={users.map((entry) => ({
          title: `${entry.name} · ${entry.role}`,
          sub: `${entry.phone} · ${entry.status}`
        }))}
      />
    </section>
  );

  const renderSettings = () => (
    <section className="module-card">
      <div className="module-head">
        <h3>系统设置</h3>
        <span>基础配置</span>
      </div>
      {config ? (
        <CardList
          rows={[
            { title: config.platformName, sub: `客服微信：${config.supportWechat}` },
            {
              title: "上传限制",
              sub: `${config.upload.maxImageSizeMb}MB · ${config.upload.allowedImageTypes.join(", ")}`
            },
            {
              title: "支付配置",
              sub: `${config.payment.enabled ? "已启用" : "未启用"} · ${config.payment.provider}`
            }
          ]}
        />
      ) : (
        <div className="placeholder-row">
          <strong>暂无权限</strong>
          <span>请使用平台管理员账号查看</span>
        </div>
      )}
    </section>
  );

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return renderDashboard();
      case "merchant":
        return renderMerchants();
      case "product":
        return renderProducts();
      case "banner":
        return renderBanners();
      case "promotion":
        return renderPromotions();
      case "order":
        return renderOrders();
      case "user":
        return renderUsers();
      case "settings":
        return renderSettings();
      default:
        return null;
    }
  };

  if (!token) {
    return (
      <div className="admin-root">
        <div className="login-shell">
          <section className="login-brand">
            <div className="hero-badge">YINGZI GUARDIAN</div>
            <h1>影子护卫多业态综合管理平台</h1>
            <p>通用左导航后台已接入商家、商品、横幅、促销、订单、用户和系统配置模块。</p>
          </section>

          <section className="login-card">
            <div className="section-eyebrow">管理端登录</div>
            <h2>进入后台</h2>
            <p>使用演示账号可直接体验当前可用模块。</p>
            <label>
              手机号
              <input value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label>
              密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button
              className="primary-button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError("");
                try {
                  const data = await api<LoginResponse>("/api/v1/auth/login", undefined, {
                    method: "POST",
                    body: JSON.stringify({ phone, password })
                  });
                  setToken(data.token);
                  setUser(data.user);
                } catch (loginError) {
                  setError(loginError instanceof Error ? loginError.message : "登录失败");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "登录中..." : "登录后台"}
            </button>
            <div className="preset-list">
              {demos.map((item) => (
                <button
                  key={item[1]}
                  className="preset-chip"
                  onClick={() => {
                    setPhone(item[1]);
                    setPassword(item[2]);
                    setError("");
                  }}
                >
                  {item[0]}
                </button>
              ))}
            </div>
            {error ? <div className="error-box">{error}</div> : null}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-mark">YG</div>
            <div>
              <strong>影子护卫</strong>
              <span>综合管理后台</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            {nav.map((item) => (
              <button
                key={item.key}
                className={view === item.key ? "nav-link active" : "nav-link"}
                onClick={() => setView(item.key)}
              >
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <header className="topbar">
            <div>
              <div className="section-eyebrow">当前模块</div>
              <h2>{currentNav.title}</h2>
              <p>{currentNav.subtitle}</p>
            </div>
            <div className="topbar-actions">
              <div className="user-pill">
                <strong>{user?.name}</strong>
                <span>{user?.role}</span>
              </div>
              <button
                className="ghost-button"
                onClick={() => {
                  setToken("");
                  setUser(null);
                  setError("");
                  setSuccess("");
                }}
              >
                退出
              </button>
            </div>
          </header>

          {success ? <div className="success-box">{success}</div> : null}
          {error ? <div className="error-box">{error}</div> : null}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
