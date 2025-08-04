"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);

  const syncLocalWishlistWithBackend = async () => {
    const local = JSON.parse(
      localStorage.getItem("multivendor_guest_wishlist") || "[]"
    );
    if (!session?.backendToken || !local.length) return;
    try {
      for (const item of local) {
        await fetch("http://localhost:4000/api/v1/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: JSON.stringify({ productId: item.id }),
        });
      }
      localStorage.removeItem("multivendor_guest_wishlist");
      await loadWishlistFromBackend();
    } catch (error) {
      console.error("Sync wishlist failed:", error);
    }
  };

  const loadWishlistFromBackend = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/wishlist/get", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
      });
      const data = await res.json();
      setWishlist(data?.wishlist?.products || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const loadWishlist = () => {
    if (session?.backendToken) {
      loadWishlistFromBackend();
    } else {
      const local = JSON.parse(
        localStorage.getItem("multivendor_guest_wishlist") || "[]"
      );
      setWishlist(local);
    }
  };

  // Added showToast parameter
  const toggleWishlistItem = async (product, showToast = true) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (!session?.backendToken) {
      let local = JSON.parse(
        localStorage.getItem("multivendor_guest_wishlist") || "[]"
      );
      if (isInWishlist) {
        local = local.filter((item) => item.id !== product.id);
        if (showToast) toast.info(`Removed "${product.name}" from wishlist`);
      } else {
        local.push(product);
        if (showToast) toast.success(`Added "${product.name}" to wishlist`);
      }
      localStorage.setItem("multivendor_guest_wishlist", JSON.stringify(local));
      setWishlist(local);
    } else {
      const endpoint = isInWishlist ? "remove" : "add";
      const method = isInWishlist ? "DELETE" : "POST";
      try {
        await fetch(`http://localhost:4000/api/v1/wishlist/${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: JSON.stringify({ productId: product.id }),
        });
        if (showToast) {
          toast.success(
            isInWishlist
              ? `Removed "${product.name}" from wishlist`
              : `Added "${product.name}" to wishlist`
          );
        }
        await loadWishlistFromBackend();
      } catch (error) {
        if (showToast) toast.error("Error updating wishlist");
      }
    }
  };

  useEffect(() => {
    loadWishlist();
    if (session) syncLocalWishlistWithBackend();
  }, [session]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlistItem,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
