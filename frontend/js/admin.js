async function loadOrders() {
  const target = document.getElementById("admin-orders");
  if (!target) return;

  try {
    const response = await fetch(`${API_BASE}/orders`);
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
            <h3>Order #${order.id}</h3>
            <p>${new Date(order.created_at).toLocaleString()}</p>
          </div>
          <strong>${money(order.total)}</strong>
        </header>

        <p><strong>Customer:</strong> ${order.customer_name}</p>
        <p><strong>Email:</strong> ${order.customer_email}</p>
        <p><strong>Phone:</strong> ${order.customer_phone}</p>
        <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.postal_code}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}

        <h4>Products</h4>
        ${order.items.map(item => `
          <div class="summary-row">
            <span>${item.product_name} x ${item.quantity}</span>
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

document.addEventListener("DOMContentLoaded", loadOrders);
