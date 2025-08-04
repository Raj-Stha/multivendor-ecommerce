//before  59330c52b934de6efe878d61c01318cba01467da

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-toastify";

// const CreateContext = createContext();

// export const StoreProvider = ({ children }) => {
//   const { data: session } = useSession();
//   const [store, setStore] = useState({ wishlist: [], cart: [] });

//   const getCardItem = async () => {
//     try {
//       if (!session) return [];

//       const response = await fetch(`http://localhost:4000/api/v1/cart/get`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.backendToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("No Data found");
//       }

//       const data = await response.json();
//       const cartItems = data?.cart?.items || [];

//       const formattedItems = cartItems.map((item) => ({
//         productId: item.productId,
//         name: item.product.name,
//         slug: item.product.slug,
//         price: item.product.price,
//         image: item.product.image,
//         quantity: item.quantity,
//         stockStatus: item.product.stock > 0 ? "in_stock" : "out_of_stock",
//       }));

//       return formattedItems;
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const savedWishlist =
//           JSON.parse(localStorage.getItem("kinmel-wishlist")) || [];

//         const savedCart = await getCardItem();

//         setStore({ wishlist: savedWishlist, cart: savedCart });

//         const pendingAction = JSON.parse(
//           localStorage.getItem("kinmel-pending-action")
//         );

//         if (session && pendingAction) {
//           if (pendingAction.type === "cart") {
//             await addToCartAfterLogin(
//               pendingAction.product,
//               pendingAction.quantity
//             );
//           } else if (pendingAction.type === "wishlist") {
//             await addToWishlistAfterLogin(pendingAction.product);
//           }

//           localStorage.removeItem("kinmel-pending-action");
//         }
//       } catch (e) {
//         console.error("Error restoring store data:", e);
//       }
//     };

//     getData();
//   }, [session]);

//   const addToCartAfterLogin = async (product, quantity = 1) => {
//     try {
//       const response = await fetch("http://localhost:4000/api/v1/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session.backendToken}`,
//         },
//         body: JSON.stringify({
//           userId: session?.user?.id || session?.user?.user?.id,
//           cartItems: [
//             {
//               productId: product.id,
//               quantity,
//             },
//           ],
//         }),
//       });

//       if (!response.ok) {
//         toast.error("Unable to add to cart");
//         return;
//       }

//       toast.success("Added to cart");

//       const updatedCart = await getCardItem();
//       setStore((prev) => ({ ...prev, cart: updatedCart }));
//     } catch (error) {
//       toast.error("Error adding to cart");
//     }
//   };

//   const addToWishlistAfterLogin = async (product) => {
//     const itemIndex = store?.wishlist?.findIndex(
//       (item) => item.id === product.id
//     );

//     const updatedWishlist =
//       itemIndex !== -1
//         ? store.wishlist.filter((item) => item.id !== product.id)
//         : [...(store?.wishlist || []), product];

//     setStore((prev) => ({ ...prev, wishlist: updatedWishlist }));
//     localStorage.setItem("kinmel-wishlist", JSON.stringify(updatedWishlist));

//     toast.success("Wishlist updated");
//   };

//   return (
//     <CreateContext.Provider
//       value={{ store, setStore, addToCartAfterLogin, addToWishlistAfterLogin }}
//     >
//       {children}
//     </CreateContext.Provider>
//   );
// };

// export const useMyContext = () => useContext(CreateContext);

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const CreateContext = createContext();

export const StoreProvider = ({ children }) => {
  const { data: session } = useSession();
  const [store, setStore] = useState({ wishlist: [], cart: [] });

  const getCartItems = async () => {
    try {
      if (!session) return [];

      const response = await fetch(`http://localhost:4000/api/v1/cart/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("No Data found");
      }

      const data = await response.json();
      const cartItems = data?.cart?.items || [];

      return cartItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        sellPrice: item.product.sellPrice,
        image: item.product.image,
        quantity: item.quantity,
        stockStatus: item.product.stock > 0 ? "in_stock" : "out_of_stock",
      }));
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  };

  const getWishlistItems = async () => {
    if (!session) return [];

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/wishlist/get",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
        }
      );

      const data = await response.json();
      return data?.wishlist?.products || [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  };

  const toggleWishlistItem = async (product) => {
    if (!session) {
      toast.info("Please login to manage wishlist");
      return;
    }

    const isInWishlist = store?.wishlist?.some(
      (item) => item.id === product.id
    );

    try {
      const endpoint = isInWishlist ? "remove" : "add";
      const method = isInWishlist ? "DELETE" : "POST";

      await fetch(`http://localhost:4000/api/v1/wishlist/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      toast.success(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist"
      );

      const updatedWishlist = await getWishlistItems();
      setStore((prev) => ({ ...prev, wishlist: updatedWishlist }));
    } catch (error) {
      toast.error("Error updating wishlist");
      console.error("Wishlist error:", error);
    }
  };

  const addToCartAfterLogin = async (product, quantity = 1) => {
    if (!session?.backendToken) {
      toast.error("You are not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/v1/cart/add", {
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
            },
          ],
        }),
      });

      if (!response.ok) {
        toast.error("Unable to add to cart");
        return;
      }

      toast.success("Added to cart");
      const updatedCart = await getCartItems();
      setStore((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      toast.error("Error adding to cart");
      console.error(error);
    }
  };

  const addToWishlistAfterLogin = async (product) => {
    if (!session?.backendToken) {
      toast.error("You are not logged in");
      return;
    }

    try {
      const isInWishlist = store?.wishlist?.some(
        (item) => item.id === product.id
      );

      if (isInWishlist) {
        toast.info("Item already in wishlist");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/v1/wishlist/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: JSON.stringify({ productId: product.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to wishlist");
      }

      toast.success("Added to wishlist");
      const updatedWishlist = await getWishlistItems();
      setStore((prev) => ({ ...prev, wishlist: updatedWishlist }));
    } catch (error) {
      toast.error("Unable to update wishlist");
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (session) {
          const [cart, wishlist] = await Promise.all([
            getCartItems(),
            getWishlistItems(),
          ]);
          setStore({ cart, wishlist });
        }
      } catch (e) {
        console.error("Error loading store data:", e);
      }
    };

    loadData();
  }, [session]);

  return (
    <CreateContext.Provider
      value={{
        store,
        setStore,
        addToCartAfterLogin,
        addToWishlistAfterLogin,
        toggleWishlistItem,
        getCartItems,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useMyContext = () => useContext(CreateContext);
