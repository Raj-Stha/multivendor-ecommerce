"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const { data: session } = useSession()
    const [cart, setCart] = useState([])

    const syncLocalCartWithBackend = async () => {
        const localCart = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]")
        if (!session?.backendToken || !localCart.length) return

        try {
            await fetch("http://localhost:4000/api/v1/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.backendToken}`,
                },
                body: JSON.stringify({
                    userId: session?.user?.id || session?.user?.user?.id,
                    cartItems: localCart.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        variantId: item.variantId, // Include variantId
                    })),
                }),
            })
            localStorage.removeItem("multivendor_guest_cart")
            await loadCartFromBackend()
        } catch (error) {
            console.error("Sync cart failed:", error)
        }
    }

    const loadCartFromBackend = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/v1/cart/get", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.backendToken}`,
                },
            })
            const data = await res.json()
            const items = data?.cart?.items || []
            setCart(
                items.map((item) => ({
                    id: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    originalPrice: item.product.originalPrice,
                    image: item.product.image,
                    quantity: item.quantity,
                    inStock: item.product.stock > 0,
                    variantId: item.variantId, // Include variantId
                    sku: item.sku,
                })),
            )
        } catch (error) {
            console.error("Error loading cart:", error)
        }
    }

    const loadCart = () => {
        if (session?.backendToken) {
            loadCartFromBackend()
        } else {
            const localCart = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]")
            setCart(localCart)
        }
    }

    const addToCart = async (product, quantity = 1) => {
        if (!product) return

        // Check stock based on the product's inStock property (which should be set based on variant)
        if (product.inStock === false) {
            toast.error(`"${product.name}" is out of stock.`)
            return
        }

        if (!session?.backendToken) {
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]")
            const found = existing.find((item) => item.id === product.id && item.variantId === product.variantId)
            if (found) {
                found.quantity += quantity
            } else {
                existing.push({ ...product, quantity })
            }
            localStorage.setItem("multivendor_guest_cart", JSON.stringify(existing))
            setCart(existing)
            toast.success(`Added "${product.name}" to cart`)
        } else {
            try {
                const res = await fetch("http://localhost:4000/api/v1/cart/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.backendToken}`,
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id || session?.user?.user?.id,
                        cartItems: [
                            {
                                productId: product.id,
                                quantity,
                                variantId: product.variantId, // Include variantId
                            },
                        ],
                    }),
                })
                if (res.ok) {
                    await loadCartFromBackend()
                    toast.success(`Added "${product.name}" to cart`)
                } else {
                    toast.error("Failed to add to cart")
                }
            } catch (error) {
                toast.error("Failed to add to cart")
            }
        }
    }

    const removeFromCart = async (productId, variantId) => {
        if (!session?.backendToken) {
            // Guest user - update localStorage
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]")
            const updatedCart = existing.filter((item) => !(item.id === productId && item.variantId === variantId))
            localStorage.setItem("multivendor_guest_cart", JSON.stringify(updatedCart))
            setCart(updatedCart)
            toast.info("Item removed from cart")
        } else {
            // Authenticated user - make API call
            try {
                const res = await fetch("http://localhost:4000/api/v1/cart/remove", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.backendToken}`,
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id || session?.user?.user?.id,
                        productId,
                        variantId,
                    }),
                })
                if (res.ok) {
                    await loadCartFromBackend()
                    toast.info("Item removed from cart")
                } else {
                    toast.error("Failed to remove item from cart")
                }
            } catch (error) {
                console.error("Error removing item:", error)
                toast.error("Failed to remove item from cart")
            }
        }
    }

    const updateQuantity = async (productId, variantId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, variantId)
            return
        }

        if (!session?.backendToken) {
            // Guest user - update localStorage
            const existing = JSON.parse(localStorage.getItem("multivendor_guest_cart") || "[]")
            const updatedCart = existing.map((item) =>
                item.id === productId && item.variantId === variantId ? { ...item, quantity: newQuantity } : item,
            )
            localStorage.setItem("multivendor_guest_cart", JSON.stringify(updatedCart))
            setCart(updatedCart)
        } else {
            // Authenticated user - make API call
            try {
                const res = await fetch("http://localhost:4000/api/v1/cart/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.backendToken}`,
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id || session?.user?.user?.id,
                        productId,
                        variantId,
                        quantity: newQuantity,
                    }),
                })
                if (res.ok) {
                    await loadCartFromBackend()
                } else {
                    toast.error("Failed to update quantity")
                }
            } catch (error) {
                console.error("Error updating quantity:", error)
                toast.error("Failed to update quantity")
            }
        }
    }

    const clearCart = async () => {
        if (!session?.backendToken) {
            // Guest user - clear localStorage
            localStorage.removeItem("multivendor_guest_cart")
            setCart([])
            toast.success("Cart cleared")
        } else {
            // Authenticated user - make API call to clear backend cart
            try {
                const res = await fetch("http://localhost:4000/api/v1/cart/clear", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.backendToken}`,
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id || session?.user?.user?.id,
                    }),
                })
                if (res.ok) {
                    setCart([])
                    toast.success("Cart cleared")
                } else {
                    toast.error("Failed to clear cart")
                }
            } catch (error) {
                console.error("Error clearing cart:", error)
                toast.error("Failed to clear cart")
            }
        }
    }

    useEffect(() => {
        loadCart()
        if (session) syncLocalCartWithBackend()
    }, [session])

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

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
    )
}

export const useCart = () => useContext(CartContext)
