import { products } from "../product/data.js";

export interface CartItemRecord {
  productId: string;
  quantity: number;
}

export interface CartRecord {
  userId: string;
  items: CartItemRecord[];
  updatedAt: string;
}

const carts: CartRecord[] = [
  {
    userId: "u_004",
    items: [{ productId: "p_003", quantity: 2 }],
    updatedAt: "2026-04-01T10:25:00.000Z"
  }
];

function touchCart(cart: CartRecord) {
  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function getOrCreateCart(userId: string) {
  const existing = carts.find((item) => item.userId === userId);
  if (existing) {
    return existing;
  }

  const record: CartRecord = {
    userId,
    items: [],
    updatedAt: new Date().toISOString()
  };
  carts.push(record);
  return record;
}

export function addCartItem(userId: string, productId: string, quantity: number) {
  const cart = getOrCreateCart(userId);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    throw new Error("商品不存在");
  }

  if (quantity <= 0) {
    throw new Error("商品数量必须大于 0");
  }

  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  return touchCart(cart);
}

export function updateCartItem(userId: string, productId: string, quantity: number) {
  const cart = getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId === productId);

  if (!existing) {
    return null;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.productId !== productId);
  } else {
    existing.quantity = quantity;
  }

  return touchCart(cart);
}

export function removeCartItem(userId: string, productId: string) {
  const cart = getOrCreateCart(userId);
  const nextItems = cart.items.filter((item) => item.productId !== productId);

  if (nextItems.length === cart.items.length) {
    return null;
  }

  cart.items = nextItems;
  return touchCart(cart);
}

export function clearCart(userId: string) {
  const cart = getOrCreateCart(userId);
  cart.items = [];
  return touchCart(cart);
}
