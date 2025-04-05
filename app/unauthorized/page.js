"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally redirect after a few seconds
    const timer = setTimeout(() => {
      router.push("/portal");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <p className="text-gray-500">
        Redirecting you to the portal in a few seconds...
      </p>
      <button
        onClick={() => router.push("/portal")}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Go to Portal Now
      </button>
    </div>
  );
}
