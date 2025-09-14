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
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

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
      console.log(data);
      setUser(data.details || null);
    } catch (err) {
      console.error("Error loading user:", err);
      setUser(null);
    }
  }, [baseUrl]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <UserContext.Provider value={{ user, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
