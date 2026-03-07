"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { parseLatLon, getLocationAddress } from "@/lib/getLocationAddress";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  // Helper to set a cookie
  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  };

  // Helper to delete a cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  };

  // Update cookie whenever user state changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isLogged = user && (Array.isArray(user) ? user.length > 0 : true);
      if (isLogged) {
        setCookie("userLogged", "true");
      } else {
        deleteCookie("userLogged");
      }
    }
  }, [user]);

  // const getUser = useCallback(async () => {
  //   try {
  //     const url = `${baseUrl}/getuserdetails`;
  //     const formData = { page_number: 1, limit: 0 };

  //     const res = await fetch(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify(formData),
  //     });

  //     if (!res.ok) {
  //       setUser(null);
  //       return;
  //     }

  //     const data = await res.json();

  //     console.log(data);

  //     let userDetails = null;
  //     if (Array.isArray(data.details) && data.details.length > 0) {
  //       userDetails = data.details[0];
  //     } else if (data.details && typeof data.details === "object") {
  //       userDetails = data.details;
  //     }

  //     setUser(data.details);
  //   } catch (err) {
  //     console.error("Error loading user:", err);
  //     setUser(null);
  //   }
  // }, [baseUrl]);

  const getUser = useCallback(async () => {
    try {
      const url = `${baseUrl}/getuserdetails`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      let users = data.details || [];

      // convert location → address once
      if (Array.isArray(users)) {
        users = await Promise.all(
          users.map(async (u) => {
            if (!u?.delivery_location) return u;

            const coords = parseLatLon(u.delivery_location);
            if (!coords) return u;

            const address = await getLocationAddress(coords.lat, coords.lon);

            return {
              ...u,
              delivery_address: address,
            };
          }),
        );
      }

      setUser(users);

      console.log(users);
    } catch (err) {
      console.error("Error loading user:", err);
      setUser(null);
    }
  }, [baseUrl]);

  const logoutUser = useCallback(async () => {
    try {
      const url = `${baseUrl}/logoutuser`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed");
        return false;
      }

      await res.json();

      setUser(null);
      deleteCookie("userLogged");
      if (typeof window !== "undefined") {
        localStorage.removeItem("popStatus");
        // localStorage.removeItem("user_location");
      }
      return true;
    } catch (err) {
      console.error("Error logging out:", err);
      return false;
    }
  }, [baseUrl]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <UserContext.Provider value={{ user, getUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
