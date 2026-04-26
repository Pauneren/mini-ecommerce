
const productForm = document.getElementById("product-form");
const productMessage = document.getElementById("product-message");
const productList = document.getElementById("admin-products-list");
const productIdInput = document.getElementById("product-id");
const formTitle = document.getElementById("form-title");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const saveProductBtn = document.getElementById("save-product-btn");

function showMessage(text, type = "notice") {
  productMessage.innerHTML = `<div class="${type}">${text}</div>`;
}

function clearProductForm() {
  productForm.reset();
  productIdInput.value = "";
  formTitle.textContent = "Add product";
  saveProductBtn.textContent = "Save product";
  cancelEditBtn.classList.add("hidden");
  productMessage.innerHTML = "";
}

function getProductFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    image: document.getElementById("image").value.trim(),
    short_description: document.getElementById("short_description").value.trim(),
    description: document.getElementById("description").value.trim(),
  };
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_BASE}/upload`, auth.addAuthHeader({
      method: 'POST',
      body: formData
      // Note: Don't manually set Content-Type when sending FormData
    }));

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data.imageUrl;
  } catch (error) {
    throw error;
  }
}

function validateProduct(product) {
  if (!product.name) return "Product name is required.";
  if (!product.price || product.price < 0) return "A valid price is required.";
  if (!product.short_description) return "Short description is required.";
  if (!product.description) return "Full description is required.";
  return null;
}

async function loadAdminProducts() {
  if (!productList) return;

  try {
    const response = await fetch(`${API_BASE}/products`, auth.addAuthHeader());
    const products = await response.json();

    if (!products.length) {
      productList.innerHTML = `<div class="empty">No products yet. Add your first product using the form.</div>`;
      return;
    }

    productList.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("div");
      row.className = "admin-product";

      row.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${product.short_description}</p>
          <div class="price">${money(product.price)}</div>
        </div>
        <div class="admin-product-actions">
          <button class="btn secondary" type="button" data-edit="${product.id}">Edit</button>
          <button class="btn danger" type="button" data-delete="${product.id}">Delete</button>
        </div>
      `;

      row.querySelector("[data-edit]").addEventListener("click", () => startEditProduct(product));
      row.querySelector("[data-delete]").addEventListener("click", () => deleteProduct(product.id, product.name));

      productList.appendChild(row);
    });
  } catch (error) {
    productList.innerHTML = `<div class="notice">Could not load products. Make sure the backend is running.</div>`;
  }
}

function startEditProduct(product) {
  productIdInput.value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("image").value = product.image;
  document.getElementById("short_description").value = product.short_description;
  document.getElementById("description").value = product.description;

  formTitle.textContent = `Edit product #${product.id}`;
  saveProductBtn.textContent = "Update product";
  cancelEditBtn.classList.remove("hidden");
  productMessage.innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveProduct(event) {
  event.preventDefault();

  const imageUpload = document.getElementById("image-upload");
  const imageUrl = document.getElementById("image").value.trim();
  const hasFile = imageUpload.files && imageUpload.files[0];

  // Check if either URL is provided or file is selected
  if (!imageUrl && !hasFile) {
    showMessage("Image URL or file upload is required.");
    return;
  }

  let finalImageUrl = imageUrl;

  // Handle file upload if a file is selected
  if (hasFile) {
    try {
      showMessage("Uploading image...");
      finalImageUrl = await uploadImage(imageUpload.files[0]);
      document.getElementById("image").value = finalImageUrl; // Update the URL field
    } catch (error) {
      showMessage(`Image upload failed: ${error.message}`);
      return;
    }
  }

  const product = {
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    image: finalImageUrl,
    short_description: document.getElementById("short_description").value.trim(),
    description: document.getElementById("description").value.trim(),
  };

  const validationError = validateProduct(product);

  if (validationError) {
    showMessage(validationError);
    return;
  }

  const editingId = productIdInput.value;
  const url = editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`;
  const method = editingId ? "PUT" : "POST";

  try {
    const response = await fetch(url, auth.addAuthHeader({
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }));

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not save product.");
    }

    showMessage(editingId ? "Product updated successfully." : "Product added successfully.", "notice success");
    clearProductForm();
    await loadAdminProducts();
  } catch (error) {
    showMessage(`${error.message} Make sure the backend is running.`);
  }
}

async function deleteProduct(id, name) {
  const confirmed = confirm(`Delete "${name}"? This cannot be undone.`);

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE}/products/${id}`, auth.addAuthHeader({
      method: "DELETE",
    }));

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not delete product.");
    }

    await loadAdminProducts();
  } catch (error) {
    showMessage(`${error.message} Make sure the backend is running.`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  if (!auth.requireAuth()) {
    return; // Will redirect to login if not authenticated
  }

  // Load products if authenticated
  loadAdminProducts();

  if (productForm) {
    productForm.addEventListener("submit", saveProduct);
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", clearProductForm);
  }
});
