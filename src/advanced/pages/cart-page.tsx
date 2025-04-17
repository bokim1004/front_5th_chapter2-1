import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";

export function CartPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { products } = useCartStore();

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items" /> {/* 여긴 추가 예정 */}
        <div id="cart-total" className="text-xl font-bold my-4" />
        <select
          className="border rounded p-2 mr-2"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id} disabled={product.q === 0}>
              {product.name} - {product.val}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            // 장바구니 추가 이벤트 핸들러
          }}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2" />
      </div>
    </div>
  );
}
