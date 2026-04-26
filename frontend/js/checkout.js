function renderCheckoutSummary() {
  const cart = getCart();
  const target = document.getElementById("checkout-summary");
  if (!target) return;

  if (cart.length === 0) {
    target.innerHTML = `<div class="notice">Your cart is empty. Add products before checkout.</div>`;
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  target.innerHTML = `
    ${cart.map(item => `
      <div class="summary-row">
        <span>${item.name} x ${item.quantity}</span>
        <span>${money(item.price * item.quantity)}</span>
      </div>
    `).join("")}
    <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
  `;
}

async function submitCheckout(event) {
  event.preventDefault();

  const cart = getCart();
  const message = document.getElementById("checkout-message");

  if (cart.length === 0) {
    message.innerHTML = `<div class="notice">Your cart is empty.</div>`;
    return;
  }

  const formData = new FormData(event.target);

  const order = {
    customer: {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      address: formData.get("address").trim(),
      city: formData.get("city").trim(),
      postal_code: formData.get("postal_code").trim(),
      notes: formData.get("notes").trim(),
    },
    items: cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Order failed");
    }

    localStorage.removeItem("cart");
    window.location.href = `thank-you.html?order=${data.order_id}`;
  } catch (error) {
    message.innerHTML = `<div class="notice">${error.message}. Make sure the backend is running.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();
  const form = document.getElementById("checkout-form");
  if (form) form.addEventListener("submit", submitCheckout);
});
