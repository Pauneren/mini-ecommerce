// Admin login functionality for MiniStore

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginBtn = document.getElementById("login-btn");

function showMessage(text, type = "notice") {
  loginMessage.innerHTML = `<div class="${escapeHtml(type)}">${escapeHtml(text)}</div>`;
}

const API_BASE_FALLBACK =
  typeof API_BASE !== "undefined" ? API_BASE : window.API_BASE || "http://localhost:5050/api";

async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please enter both email and password.");
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  showMessage("Attempting to login...", "notice");

  try {
    const response = await fetch(`${API_BASE_FALLBACK}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Store JWT token
    auth.setAuthToken(data.token);

    showMessage("Login successful! Redirecting...", "notice success");

    // Redirect to admin dashboard after a short delay
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);

  } catch (error) {
    showMessage(`Login failed: ${error.message}`);
  } finally {
    // Reset button state
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
}

// Check if already logged in and redirect
function checkAuthStatus() {
  if (auth.isLoggedIn() && auth.validateToken()) {
    // Already logged in, redirect to admin dashboard
    window.location.href = "admin.html";
  }
}

// Initialize login page
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();

  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }

  // Focus on email field
  const emailField = document.getElementById("email");
  if (emailField) {
    emailField.focus();
  }
});
