// LOCAL DEVELOPMENT:
// const API_BASE = "http://localhost:5050/api";

// PRODUCTION:
const API_BASE = "https://mini-ecommerce-ysxy.onrender.com/api";

window.API_BASE = API_BASE;
function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  saveCart(cart);
  alert("Product added to cart.");
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";

  article.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>${product.short_description}</p>
      <div class="price">${money(product.price)}</div>
      <div class="card-actions">
        <a class="btn secondary" href="product.html?id=${product.id}">View</a>
        <button class="btn" type="button">Add</button>
      </div>
    </div>
  `;

  article.querySelector("button").addEventListener("click", () => addToCart(product, 1));
  return article;
}

async function loadProducts(targetId, limit = null) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    target.innerHTML = "";

    const list = limit ? products.slice(0, limit) : products;
    list.forEach((product) => target.appendChild(createProductCard(product)));
  } catch (error) {
    target.innerHTML = `<div class="notice">Could not load products. Make sure the backend is running.</div>`;
  }
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProductDetail() {
  const detail = document.getElementById("product-detail");
  if (!detail) return;

  const id = getProductIdFromUrl();

  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    const product = await response.json();

    document.title = `${product.name} | Mini Store`;

    detail.innerHTML = `
      <div class="detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="detail-panel">
        <p class="eyebrow">Product detail</p>
        <h1>${product.name}</h1>
        <p class="lead">${product.description}</p>
        <div class="price">${money(product.price)}</div>
        <div class="qty-row">
          <label for="quantity">Quantity</label>
          <input class="quantity-input" id="quantity" type="number" min="1" value="1">
        </div>
        <button class="btn" id="add-detail">Add to Cart</button>
      </div>
    `;

    document.getElementById("add-detail").addEventListener("click", () => {
      const quantity = Math.max(1, Number(document.getElementById("quantity").value));
      addToCart(product, quantity);
    });
  } catch (error) {
    detail.innerHTML = `<div class="notice">Product not found.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts("featured-products", 3);
  loadProducts("all-products");
  loadProductDetail();
});
