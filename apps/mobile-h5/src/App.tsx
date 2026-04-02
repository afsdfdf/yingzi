import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { TopBar } from "./components/TopBar";
import { CartView } from "./features/views/CartView";
import { DiscoverView } from "./features/views/DiscoverView";
import { HomeView } from "./features/views/HomeView";
import { MerchantDetailView } from "./features/views/MerchantDetailView";
import { OrdersView } from "./features/views/OrdersView";
import { ProductDetailView } from "./features/views/ProductDetailView";
import { ProfileView } from "./features/views/ProfileView";
import { getStoredToken, request, setStoredToken } from "./lib/api";
import type {
  AuthUser,
  CartItem,
  CartResponse,
  HomeResponse,
  ListResponse,
  LoginResponse,
  Merchant,
  OrderRecord,
  Product,
  Screen,
  TabKey
} from "./types";

const homeScreen: Screen = { type: "tab", tab: "home" };
const demoLogin = {
  phone: "13900000004",
  password: "User@123"
};

export function App() {
  const [stack, setStack] = useState<Screen[]>([homeScreen]);
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [authPending, setAuthPending] = useState(false);

  const screen = stack[stack.length - 1] ?? homeScreen;
  const activeTab = useMemo<TabKey>(() => {
    const tabScreen = [...stack].reverse().find((item) => item.type === "tab");
    return tabScreen?.type === "tab" ? tabScreen.tab : "home";
  }, [stack]);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [homeData, merchantData, productData] = await Promise.all([
          request<HomeResponse>("/api/v1/storefront/home"),
          request<ListResponse<Merchant>>("/api/v1/storefront/merchants"),
          request<ListResponse<Product>>("/api/v1/storefront/products")
        ]);

        setHome(homeData);
        setMerchants(merchantData.items.filter((item) => item.status !== "suspended"));
        setProducts(productData.items.filter((item) => item.status !== "blocked"));
        setError("");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "页面数据加载失败");
      }
    };

    void loadPublicData();
  }, []);

  useEffect(() => {
    if (!getStoredToken()) {
      return;
    }

    void hydrateConsumer();
  }, []);

  const currentMerchant =
    screen.type === "merchant" ? merchants.find((item) => item.id === screen.merchantId) : undefined;
  const currentProduct =
    screen.type === "product" ? products.find((item) => item.id === screen.productId) : undefined;
  const productMerchant = currentProduct
    ? merchants.find((item) => item.id === currentProduct.merchantId)
    : undefined;

  const cartCount = useMemo(
    () => (currentProduct ? cart.find((item) => item.productId === currentProduct.id)?.quantity ?? 0 : 0),
    [cart, currentProduct]
  );

  async function hydrateConsumer() {
    try {
      const [me, cartData, orderData] = await Promise.all([
        request<AuthUser>("/api/v1/auth/me"),
        request<CartResponse>("/api/v1/cart"),
        request<ListResponse<OrderRecord>>("/api/v1/orders")
      ]);

      setCurrentUser(me);
      setCart(cartData.items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
      setOrders(orderData.items);
      setError("");
    } catch (loadError) {
      setStoredToken("");
      setCurrentUser(null);
      setCart([]);
      setOrders([]);
      setError(loadError instanceof Error ? loadError.message : "登录状态已失效，请重新登录");
    }
  }

  async function loginAsConsumer(phone: string, password: string) {
    setAuthPending(true);
    try {
      const login = await request<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password })
      });

      setStoredToken(login.token);
      setCurrentUser(login.user);
      await hydrateConsumer();
      setError("");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败");
    } finally {
      setAuthPending(false);
    }
  }

  async function logout() {
    setStoredToken("");
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setError("");
  }

  const openTab = (tab: TabKey) => setStack([{ type: "tab", tab }]);
  const pushScreen = (nextScreen: Screen) => setStack((current) => [...current, nextScreen]);
  const openMerchant = (merchantId: string) => pushScreen({ type: "merchant", merchantId });
  const openProduct = (productId: string) => pushScreen({ type: "product", productId });
  const goBack = () => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : [homeScreen]));
  };

  async function addToCart(productId: string) {
    if (!currentUser) {
      openTab("profile");
      setError("请先登录用户账号后再加入购物车");
      return;
    }

    try {
      await request("/api/v1/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 })
      });
      await hydrateConsumer();
    } catch (cartError) {
      setError(cartError instanceof Error ? cartError.message : "加入购物车失败");
    }
  }

  async function checkoutCart() {
    if (!currentUser || cart.length === 0) {
      openTab("profile");
      setError("请先登录并添加商品后再结算");
      return;
    }

    try {
      await request<OrderRecord>("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: currentUser.name,
          customerPhone: currentUser.phone,
          address: "上海市浦东新区演示地址 88 号",
          remark: "移动端演示下单",
          items: cart
        })
      });

      await hydrateConsumer();
      openTab("orders");
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "创建订单失败");
    }
  }

  const renderScreen = () => {
    if (screen.type === "merchant" && currentMerchant) {
      return (
        <MerchantDetailView
          merchant={currentMerchant}
          products={products}
          onBack={goBack}
          onOpenProduct={openProduct}
        />
      );
    }

    if (screen.type === "product" && currentProduct) {
      return (
        <ProductDetailView
          product={currentProduct}
          merchant={productMerchant}
          cartCount={cartCount}
          onBack={goBack}
          onOpenMerchant={openMerchant}
          onAddToCart={addToCart}
        />
      );
    }

    if (activeTab === "discover") {
      return (
        <DiscoverView
          merchants={merchants}
          products={products}
          onOpenMerchant={openMerchant}
          onOpenProduct={openProduct}
        />
      );
    }

    if (activeTab === "cart") {
      return (
        <CartView
          cart={cart}
          products={products}
          currentUser={currentUser}
          onOpenProduct={openProduct}
          onCheckout={checkoutCart}
          onGoLogin={() => openTab("profile")}
        />
      );
    }

    if (activeTab === "orders") {
      return (
        <OrdersView
          orders={orders}
          currentUser={currentUser}
          onOpenProduct={openProduct}
          onGoLogin={() => openTab("profile")}
        />
      );
    }

    if (activeTab === "profile") {
      return (
        <ProfileView
          currentUser={currentUser}
          authPending={authPending}
          demoPhone={demoLogin.phone}
          demoPassword={demoLogin.password}
          onLogin={loginAsConsumer}
          onLogout={logout}
        />
      );
    }

    return (
      <HomeView
        home={home}
        merchants={merchants}
        products={products}
        selectedMerchant={selectedMerchant}
        onSelectMerchant={setSelectedMerchant}
        onOpenMerchant={openMerchant}
        onOpenProduct={openProduct}
        onQuickEntry={(kind) => openTab(kind === "discover" ? "discover" : "profile")}
      />
    );
  };

  return (
    <div className="mobile-shell">
      <TopBar
        onSearchClick={() => openTab("discover")}
        userLabel={currentUser ? currentUser.name : "登录"}
        onUserClick={() => openTab("profile")}
      />
      {renderScreen()}
      {error ? <div className="error-box">{error}</div> : null}
      <BottomNav activeTab={activeTab} onChange={openTab} />
    </div>
  );
}
