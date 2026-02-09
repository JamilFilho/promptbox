"use client";

import { useEffect, useState } from "react";

export default function BoxPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function protect() {
      // Assumes the client stores the logged user JSON in localStorage under `user`
      const raw = localStorage.getItem("user");
      if (!raw) {
        // Not logged in — redirect to login (adjust path as needed)
        window.location.href = "/api/users/login";
        return;
      }

      const user = JSON.parse(raw);
      try {
        const res = await fetch("/api/box/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
          return;
        }

        // paid or allowed — render box
        setLoading(false);
      } catch (err) {
        console.error("Protection error:", err);
      }
    }

    protect();
  }, []);

  if (loading) {
    return <div>Verificando acesso...</div>;
  }

  return (
    <div>
      <h1>Box Page</h1>
      <p>Conteúdo protegido — acesso permitido.</p>
    </div>
  );
}