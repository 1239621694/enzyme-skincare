"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#262626",
          color: "#fafafa",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          fontSize: "0.875rem",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#14b8a6",
            secondary: "#fafafa",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fafafa",
          },
        },
      }}
    />
  );
}