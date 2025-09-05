"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { data: session } = useSession();
    const [cart, setCart] = useState([]);

    // Helper function to generate unique cart item ID
    const generateCartItemId = (productId, variantId = null) => {
        return `${productId}-${variantId || 'no-variant'}-${Date.now()}`;
    };

    // Helper function to find cart item
    const findCartItem = (cartItems, productId, variantId = null) => {
        return cartItems.find(item =>
            item.id === productId &&
            (item.variantId || null) === (variantId || null)
        );
    };

    // Load cart from backend
    const loadCartFromBackend = useCallback(async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/get-cart`, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${session.accessToken}`,
                },
            });
            const data = await res.json();
            const items = data?.items || [];

            setCart(
                items.map((item) => {
                    const product = item.product;
                    const variant = item.variant;

                    // Determine price from variant or product
                    let price;
                    if (variant) {
                        price = variant.sellPrice && variant.sellPrice > 0 ? variant.sellPrice : variant.price;
                    } else {
                        price = product.sellPrice && product.sellPrice > 0 ? product.sellPrice : product.price;
                    }

                    return {
                        id: product.id,
                        name: product.name,
                        price: price || 0,
                        originalPrice: variant?.price || product.price || 0,
                        image: variant?.image || product.image || product.preview,
                        quantity: item.quantity,
                        inStock: variant?.stock || product.stock,
                        variantId: variant?.id || null,
                        sku: variant?.sku || "",
                        cartItemId: item.id, // Backend cart item ID for updates
                        subtotal: item.subtotal || 0,
                        uniqueKey: `${product.id}-${variant?.id || 'no-variant'}-${item.id}`, // Unique key for rendering
                    };
                })
            );
        } catch (err) {
            console.error("Error loading cart:", err);
        }
    }, [session?.accessToken]);

    // Sync local/guest cart with backend
    const syncLocalCartWithBackend = useCallback(async () => {
        const localCart = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]");
        if (!session?.accessToken || !localCart.length) return;

        try {
            const payloadArray = localCart.map((item) => ({
                productId: item.id,
                variantId: item.variantId ?? item.variant?.id ?? null,
                quantity: item.quantity,
            }));

            const payload = payloadArray.length === 1 ? payloadArray[0] : { items: payloadArray };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                console.log("✅ Synced cart with backend");
                localStorage.removeItem("multivendor_guest_cart"); // 🔥 remove only on success
                await loadCartFromBackend();
            } else {
                console.error("❌ Sync cart failed: Server returned error");
                // ⚠️ keep guest cart in localStorage
            }
        } catch (err) {
            console.error("❌ Sync cart failed:", err);
            // ⚠️ keep guest cart in localStorage
        }
    }, [session?.accessToken, loadCartFromBackend]);

    // Load cart (guest or backend)
    const loadCart = useCallback(() => {
        if (session?.accessToken) {
            loadCartFromBackend();
        } else {
            const localCart = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]");
            // Ensure each item has a unique key for rendering
            const cartWithKeys = localCart.map((item, index) => ({
                ...item,
                uniqueKey: item.uniqueKey || `${item.id}-${item.variantId || 'no-variant'}-${index}`,
            }));
            setCart(cartWithKeys);
        }
    }, [session?.accessToken, loadCartFromBackend]);

    // Add product to cart
    const addToCart = async (product, quantity = 1) => {
        if (!product) return;

        if (product.stock === "out_of_stock") {
            // toast.error(`"${product.name}" is out of stock.`);
            return;
        }

        let variantId = null;
        let selectedVariant = null;

        if (product.hasVariant) {
            variantId = product.variantId ?? product.variants?.[0]?.id ?? null;
            selectedVariant = product.variants?.find((v) => v.id === variantId) || null;
        }

        if (!session?.accessToken) {
            // Guest cart (local storage)
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]");

            const foundIndex = existing.findIndex(
                (item) => item.id === product.id && (item.variantId || null) === (variantId || null)
            );

            if (foundIndex > -1) {
                // ✅ Update quantity if already exists
                existing[foundIndex].quantity += quantity;
            } else {
                // ✅ Add new only if not found
                const productToStore = {
                    id: product.id,
                    name: product.name,
                    image: selectedVariant?.image || product.image || product.preview,
                    price: selectedVariant?.price ?? product.price,
                    sellPrice: selectedVariant?.sellPrice ?? product.sellPrice ?? 0,
                    quantity,
                    stock: selectedVariant?.stock ?? product.stock,
                    variantId: variantId || null, // Ensure null instead of undefined
                    uniqueKey: generateCartItemId(product.id, variantId), // Generate unique key
                };

                if (product.hasVariant && selectedVariant) {
                    productToStore.sku = selectedVariant.sku;
                    productToStore.variant = selectedVariant;
                }

                existing.push(productToStore);
            }

            localStorage.setItem("multivendor_guest_cart", JSON.stringify(existing));

            // Update state with unique keys
            const cartWithKeys = existing.map((item, index) => ({
                ...item,
                uniqueKey: item.uniqueKey || `${item.id}-${item.variantId || 'no-variant'}-${index}`,
            }));
            setCart(cartWithKeys);
            // toast.success(`Added "${product.name}" to cart`);
        } else {
            // Logged-in user
            try {
                const cartItem = findCartItem(cart, product.id, variantId);

                if (cartItem) {
                    // ✅ If exists in backend cart, just update quantity
                    await updateQuantity(product.id, cartItem.quantity + quantity, variantId);
                    // toast.success(`Increased quantity of "${product.name}"`);
                    return;
                }

                // Otherwise, add new item
                const payloadItem = {
                    productId: product.id,
                    variantId: variantId || null,
                    quantity,
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add-to-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify(payloadItem),
                });

                if (res.ok) {
                    await loadCartFromBackend();
                    // toast.success(`Added "${product.name}" to cart`);
                } else {
                    // toast.error("Failed to add to cart");
                }
            } catch (err) {
                console.error("❌ Error adding to cart:", err);
                // toast.error("Failed to add to cart");
            }
        }
    };

    const removeFromCart = async (productId, variantId = null) => {
        if (!session?.accessToken) {
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]");
            const updatedCart = existing.filter((item) => !(item.id === productId && (item.variantId || null) === (variantId || null)));
            localStorage.setItem("multivendor_guest_cart", JSON.stringify(updatedCart));

            // Update state with unique keys
            const cartWithKeys = updatedCart.map((item, index) => ({
                ...item,
                uniqueKey: item.uniqueKey || `${item.id}-${item.variantId || 'no-variant'}-${index}`,
            }));
            setCart(cartWithKeys);
            // toast.info("Item removed from cart");
        } else {
            try {
                const cartItem = findCartItem(cart, productId, variantId);
                if (!cartItem) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/remove-from-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify({ itemId: cartItem.cartItemId }),
                });
                if (res.ok) {
                    await loadCartFromBackend();
                    // toast.info("Item removed from cart");
                } else {
                    // toast.error("Failed to remove item from cart");
                }
            } catch (err) {
                console.error("Error removing item:", err);
                // toast.error("Failed to remove item from cart");
            }
        }
    };

    const updateQuantity = async (productId, newQuantity, variantId = null) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, variantId);
            return;
        }

        if (!session?.accessToken) {
            // ✅ Guest cart
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]");
            const updatedCart = existing.map((item) =>
                item.id === productId && (item.variantId || null) === (variantId || null)
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            localStorage.setItem("multivendor_guest_cart", JSON.stringify(updatedCart));

            const cartWithKeys = updatedCart.map((item, index) => ({
                ...item,
                uniqueKey: item.uniqueKey || `${item.id}-${item.variantId || 'no-variant'}-${index}`,
            }));
            setCart(cartWithKeys);

            // 🎉 Show toast
            const updatedItem = updatedCart.find(
                (item) => item.id === productId && (item.variantId || null) === (variantId || null)
            );
            // toast.success(`Updated quantity of "${updatedItem?.name || "item"}" to ${newQuantity}`);
        } else {
            try {
                const cartItem = findCartItem(cart, productId, variantId);
                if (!cartItem) return;

                const currentQuantity = cartItem.quantity;
                const action = newQuantity > currentQuantity ? "increment" : "decrement";
                const diff = Math.abs(newQuantity - currentQuantity);

                for (let i = 0; i < diff; i++) {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/update-cart-quantity`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${session.accessToken}`,
                        },
                        body: JSON.stringify({ itemId: cartItem.cartItemId, action }),
                    });
                    if (!res.ok) {
                        // toast.error("Failed to update quantity");
                        return;
                    }
                }

                await loadCartFromBackend();

                // 🎉 Show toast
                // toast.success(`Updated quantity of "${cartItem.name}" to ${newQuantity}`);
            } catch (err) {
                console.error("Error updating quantity:", err);
                // toast.error("Failed to update quantity");
            }
        }
    };

    const clearCart = async () => {
        if (!session?.accessToken) {
            localStorage.removeItem("multivendor_guest_cart");
            setCart([]);
            // toast.success("Cart cleared");
        } else {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/clear-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (res.ok) {
                    setCart([]);
                    // toast.success("Cart cleared");
                } else {
                    // toast.error("Failed to clear cart");
                }
            } catch (err) {
                console.error("Error clearing cart:", err);
                // toast.error("Failed to clear cart");
            }
        }
    };

    useEffect(() => {
        loadCart();
        if (session) syncLocalCartWithBackend();
    }, [session, loadCart, syncLocalCartWithBackend]);

    const cartTotal = cart.reduce((total, item) => {
        let price = 0;

        if (item.hasVariant) {
            // For variant products, check sellPrice first
            price = item.variant?.sellPrice > 0
                ? item.variant.sellPrice
                : item.variant?.price || 0;
        } else {
            // For non-variant products, check product sellPrice first
            price = item.sellPrice > 0
                ? item.sellPrice
                : item.price || 0;
        }

        return total + price * (item.quantity || 0);
    }, 0);


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount: cart.length,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);