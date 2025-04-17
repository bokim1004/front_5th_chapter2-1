import { create } from "zustand";
import { products } from "../data/products";
import { CartStore } from "../types/store-type";
import { cloneProducts } from "../utils/product/products";

export const useCartStore = create<CartStore>((set, get) => ({
  products: cloneProducts(products),
  lastSelected: null,
  finalTotal: 0,
  originalTotal: 0,
  itemCount: 0,
  discountRate: 0,
  cart: [],

  setLastSelected: (id) => set({ lastSelected: id }),

  // 장바구니 금액 계산
  updateCartTotals: (originalTotal, finalTotal, itemCount, discountRate) =>
    set({
      originalTotal,
      finalTotal,
      itemCount,
      discountRate,
    }),

  updateProductPrice: (id: string, newPrice: number) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, val: newPrice } : p)),
    })),

  //장바구니 추가
  addToCart: (productId: string) =>
    set((state) => {
      const product = state.products.find((product) => product.id === productId);
      if (!product || product.q <= 0) return state;

      const existingItem = state.cart.find((item) => item.id === productId);

      const updatedCart = existingItem
        ? state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.cart, { ...product, quantity: 1 }];

      const updatedProducts = state.products.map((product) =>
        product.id === productId ? { ...product, q: product.q - 1 } : product,
      );

      return {
        cart: updatedCart,
        products: updatedProducts,
        lastSelected: productId,
      };
    }),

  //장바구니 초기화
  resetCart: () =>
    set({
      products: cloneProducts(products),
      lastSelected: null,
      finalTotal: 0,
      originalTotal: 0,
      itemCount: 0,
      discountRate: 0,
    }),

  // 장바구니 담긴 제품 수량 변경
  changeCartItemQuantity: (productId, delta) => {
    const { cart, products } = get();
    const item = cart.find((c) => c.id === productId);
    const product = products.find((p) => p.id === productId);
    if (!item || !product) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      set({
        cart: cart.filter((c) => c.id !== productId),
        products: products.map((p) => (p.id === productId ? { ...p, q: p.q + item.quantity } : p)),
      });
    } else if (newQuantity <= product.q + item.quantity) {
      set({
        cart: cart.map((c) => (c.id === productId ? { ...c, quantity: newQuantity } : c)),
        products: products.map((p) => (p.id === productId ? { ...p, q: p.q - delta } : p)),
      });
    } else {
      alert("재고가 부족합니다.");
    }
  },

  // 장바구니 담긴 제품 제거
  removeCartItem: (productId) => {
    const { cart, products } = get();
    const item = cart.find((c) => c.id === productId);
    if (!item) return;

    set({
      cart: cart.filter((c) => c.id !== productId),
      products: products.map((p) => (p.id === productId ? { ...p, q: p.q + item.quantity } : p)),
    });
  },
}));
