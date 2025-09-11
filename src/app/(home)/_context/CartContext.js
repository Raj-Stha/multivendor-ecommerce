"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getCart = useCallback(async () => {
    try {
      const url = `${baseUrl}/getcartdetails`;
      const formData = { page_number: 1, limit: 0 };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCart(data.details || []);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, [baseUrl]);

  const updateCart = async ({
    product_id,
    vendor_id,
    variant_id,
    order_count,
    type = "edit", // default to edit if not provided
  }) => {
    try {
      let finalQuantity = order_count;

      if (type === "add") {
        // check if product already exists
        const existing = cart.find(
          (item) =>
            item.product_id === product_id &&
            item.vendor_id === vendor_id &&
            item.variant_id === variant_id
        );

        if (existing) {
          finalQuantity = existing.cart_quantity + order_count;
        }
      }

      const url = `${baseUrl}/updatecart`;
      const body = {
        product_id,
        vendor_id,
        variant_id,
        order_count: finalQuantity,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update cart");

      await getCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  // const cartCount = cart.reduce((sum, item) => sum + item.cart_quantity, 0);
  const cartCount = cart.length;
  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        getCart,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
