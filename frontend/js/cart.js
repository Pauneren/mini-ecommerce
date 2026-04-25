function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");

  if (!cartItems || !cartSummary) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty">Your cart is empty.</div>`;
    cartSummary.innerHTML = `
      <div class="summary-row total"><span>Total</span><span>${money(0)}</span></div>
      <a class="btn" href="products.html">Shop products</a>
    `;
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p class="price">${money(item.price)}</p>
      </div>
      <div>
        <input class="quantity-input" type="number" min="1" value="${item.quantity}" data-id="${item.id}">
        <button class="btn danger" data-remove="${item.id}" type="button">Remove</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartSummary.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>Calculated later</span></div>
    <div class="summary-row total"><span>Total</span><span>${money(subtotal)}</span></div>
    <a class="btn" href="checkout.html">Checkout</a>
  `;

  document.querySelectorAll("[data-id]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const id = Number(event.target.dataset.id);
      const quantity = Math.max(1, Number(event.target.value));
      const updatedCart = getCart().map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
      renderCart();
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.remove);
      const updatedCart = getCart().filter((item) => item.id !== id);
      saveCart(updatedCart);
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCart);
