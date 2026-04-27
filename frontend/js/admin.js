async function loadOrders() {
  const target = document.getElementById("admin-orders");
  if (!target) return;

  try {
    const response = await fetch(`${API_BASE}/orders`, auth.addAuthHeader());

    if (response.status === 401) {
      auth.removeAuthToken();
      window.location.href = "admin-login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Server error ${response.status}`);
    }

    const orders = await response.json();

    if (!orders.length) {
      target.innerHTML = `<div class="empty">No orders yet.</div>`;
      return;
    }

    target.innerHTML = "";

    orders.forEach((order) => {
      const card = document.createElement("article");
      card.className = "panel admin-order";

      card.innerHTML = `
        <header>
          <div>
            <h3>Order #${escapeHtml(String(order.id))}</h3>
            <p>${escapeHtml(new Date(order.created_at).toLocaleString())}</p>
          </div>
          <strong>${money(order.total)}</strong>
        </header>

        <p><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(order.customer_phone)}</p>
        <p><strong>Address:</strong> ${escapeHtml(order.address)}, ${escapeHtml(order.city)}, ${escapeHtml(order.postal_code)}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>` : ""}

        <h4>Products</h4>
        ${order.items.map(item => `
          <div class="summary-row">
            <span>${escapeHtml(item.product_name)} x ${escapeHtml(String(item.quantity))}</span>
            <span>${money(item.price * item.quantity)}</span>
          </div>
        `).join("")}
      `;

      target.appendChild(card);
    });
  } catch (error) {
    target.innerHTML = `<div class="notice">Could not load orders. Make sure the backend is running.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  if (!auth.requireAuth()) {
    return; // Will redirect to login if not authenticated
  }

  // Load orders if authenticated
  loadOrders();
});
