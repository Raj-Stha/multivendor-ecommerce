// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

//   const getUser = useCallback(async () => {
//     try {
//       const url = `${baseUrl}/getuserdetails`;
//       const formData = { page_number: 1, limit: 0 };

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         setUser(null);
//         return;
//       }

//       const data = await res.json();
//       setUser(data.details || null);
//     } catch (err) {
//       console.error("Error loading user:", err);
//       setUser(null);
//     }
//   }, [baseUrl]);

//   const logoutUser = useCallback(async () => {
//     try {
//       const url = `${baseUrl}/logoutuser`;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       if (!res.ok) {
//         console.error("Logout failed");
//         return false;
//       }

//       const data = await res.json();

//       setUser(null); // clear user state
//       getUser();
//       return true;
//     } catch (err) {
//       console.error("Error logging out:", err);
//       return false;
//     }
//   }, [baseUrl]);

//   useEffect(() => {
//     getUser();
//   }, [getUser]);

//   return (
//     <UserContext.Provider value={{ user, getUser, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

//   // Update localStorage whenever user state changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const isLogged = user && (Array.isArray(user) ? user.length > 0 : true);
//       localStorage.setItem("userLogged", isLogged ? "true" : "false");
//     }
//   }, [user]);

//   const getUser = useCallback(async () => {
//     try {
//       const url = `${baseUrl}/getuserdetails`;
//       const formData = { page_number: 1, limit: 0 };

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         setUser(null);
//         return;
//       }

//       const data = await res.json();

//       let userDetails = null;
//       if (Array.isArray(data.details) && data.details.length > 0) {
//         userDetails = data.details[0]; // first user object
//       } else if (data.details && typeof data.details === "object") {
//         userDetails = data.details; // direct object
//       }
//       setUser(data.details);
//     } catch (err) {
//       console.error("Error loading user:", err);
//       setUser(null);
//     }
//   }, [baseUrl]);

//   const logoutUser = useCallback(async () => {
//     try {
//       const url = `${baseUrl}/logoutuser`;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       if (!res.ok) {
//         console.error("Logout failed");
//         return false;
//       }

//       const data = await res.json();

//       setUser(null); // clear user state
//       getUser();
//       return true;
//     } catch (err) {
//       console.error("Error logging out:", err);
//       return false;
//     }
//   }, [baseUrl]);

//   useEffect(() => {
//     getUser();
//   }, [getUser]);

//   return (
//     <UserContext.Provider value={{ user, getUser, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

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

      let userDetails = null;
      if (Array.isArray(data.details) && data.details.length > 0) {
        userDetails = data.details[0];
      } else if (data.details && typeof data.details === "object") {
        userDetails = data.details;
      }

      setUser(data.details);
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
