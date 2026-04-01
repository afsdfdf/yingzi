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
import { request } from "./lib/api";
import type { CartItem, HomeResponse, ListResponse, Merchant, Product, Screen, TabKey } from "./types";

const homeScreen: Screen = { type: "tab", tab: "home" };

export function App() {
  const [stack, setStack] = useState<Screen[]>([homeScreen]);
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");

  const screen = stack[stack.length - 1] ?? homeScreen;
  const activeTab = useMemo<TabKey>(() => {
    const tabScreen = [...stack].reverse().find((item) => item.type === "tab");
    return tabScreen?.type === "tab" ? tabScreen.tab : "home";
  }, [stack]);

  useEffect(() => {
    const load = async () => {
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

    void load();
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

  const openTab = (tab: TabKey) => setStack([{ type: "tab", tab }]);
  const pushScreen = (nextScreen: Screen) => setStack((current) => [...current, nextScreen]);
  const openMerchant = (merchantId: string) => pushScreen({ type: "merchant", merchantId });
  const openProduct = (productId: string) => pushScreen({ type: "product", productId });
  const goBack = () => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : [homeScreen]));
  };

  const addToCart = (productId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  };

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
      return <CartView cart={cart} products={products} onOpenProduct={openProduct} />;
    }

    if (activeTab === "orders") {
      return <OrdersView products={products} onOpenProduct={openProduct} />;
    }

    if (activeTab === "profile") {
      return <ProfileView />;
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
      <TopBar onSearchClick={() => openTab("discover")} />
      {renderScreen()}
      {error ? <div className="error-box">{error}</div> : null}
      <BottomNav activeTab={activeTab} onChange={openTab} />
    </div>
  );
}
