"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <>
      {children}

      {/* React Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-white !text-gray-900 !rounded-lg !shadow-lg !jost-text"
        progressClassName="!bg-blue-600"
      />

      {/* React Hot Toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "var(--font-jost), sans-serif",
            background: "white",
            color: "#111827", // text-gray-900
            borderRadius: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      />
    </>
  );
}
