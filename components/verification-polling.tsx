"use client";

import { useEffect } from "react";

export function VerificationPolling() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.verificationStatus === "APROVADO") {
            // Re-sign the JWT cookie and redirect to the dashboard
            window.location.href = "/api/auth/refresh?redirect=/";
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status de aprovação:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
