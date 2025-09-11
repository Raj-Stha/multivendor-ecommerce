"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async (limit = 100, page_number = 1) => {
    try {
      const res = await fetch(`${API_BASE}/getwishlistdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ limit, page_number }),
      });
      const data = await res.json();
      // Use data.details instead of data.wishlist
      setWishlist(data?.details || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast.error("Failed to load wishlist");
    }
  };

  const toggleWishlistItem = async (product_id, variant_id, vendor_id) => {
    try {
      await fetch(`${API_BASE}/updatewishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ product_id, variant_id, vendor_id }),
      });
      toast.success("Wishlist updated successfully");
      await loadWishlist();
    } catch (error) {
      console.error(error);
      toast.error("Error updating wishlist");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlistItem,
        wishlistCount: wishlist.length, // this will now reflect data.details length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
