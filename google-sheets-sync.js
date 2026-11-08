// Sincroniza los pedidos guardados por la aplicación con el endpoint de Vercel.
// La app sigue funcionando localmente si no se puede contactar con Google Sheets.
(() => {
  const endpoint = "/api/registro";
  const synced = new Map();
  const inFlight = new Set();

  function readOrders() {
    try {
      const value = JSON.parse(localStorage.getItem("pedidos") || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function normalized(order) {
    // Never transmit the voucher image itself; it may be large and contains sensitive material.
    const { vou, ...data } = order;
    return { ...data, vou: Boolean(vou) };
  }

  async function sync() {
    if (!navigator.onLine) return;
    for (const order of readOrders()) {
      if (!order || !order.id || inFlight.has(order.id)) continue;
      const data = normalized(order);
      const fingerprint = JSON.stringify(data);
      if (synced.get(order.id) === fingerprint) continue;
      inFlight.add(order.id);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: data }),
          credentials: "same-origin"
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        synced.set(order.id, fingerprint);
      } catch (error) {
        // Retry on a later poll; do not block or interrupt order registration.
        console.warn("No se pudo sincronizar el pedido con Google Sheets.", error);
      } finally {
        inFlight.delete(order.id);
      }
    }
  }

  sync();
  window.addEventListener("online", sync);
  window.setInterval(sync, 4000);
})();
