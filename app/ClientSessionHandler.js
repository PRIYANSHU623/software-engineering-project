"use client";
import { useEffect } from "react";

export default function ClientSessionHandler() {
  useEffect(() => {
    sessionStorage.setItem("sessionActive", "true");

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("sessionActive"); // Remove session storage on unload
    };

    const handleUnload = () => {
      if (!sessionStorage.getItem("sessionActive")) {
        localStorage.clear(); // Clears localStorage only when the browser is closed
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return null; // No UI needed
}
