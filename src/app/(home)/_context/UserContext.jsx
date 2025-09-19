"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const getUser = useCallback(async () => {
    try {
      const url = `${baseUrl}/getuserdetails`;
      const formData = { page_number: 1, limit: 0 };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      console.log("Fetched user:", data);
      setUser(data.details || null);
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

      const data = await res.json();
      console.log("Logout response:", data);

      setUser(null); // clear user state
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
