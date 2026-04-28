const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const loginBtn = document.getElementById('login-btn');
const noAdminBanner = document.getElementById('no-admin-banner');

function showMessage(text, type = 'notice') {
  loginMessage.innerHTML = `<div class="${escapeHtml(type)}">${escapeHtml(text)}</div>`;
}

const API_BASE_FALLBACK =
  typeof API_BASE !== 'undefined' ? API_BASE : window.API_BASE || 'http://localhost:5050/api';

async function checkAdminStatus() {
  try {
    const response = await fetch(`${API_BASE_FALLBACK}/auth/status`);
    const data = await response.json();

    if (!data.hasAdmin) {
      if (loginForm) loginForm.classList.add('hidden');
      if (noAdminBanner) noAdminBanner.classList.remove('hidden');
    }
  } catch (error) {
    showMessage('Could not reach the backend. Make sure it is running.');
  }
}

async function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Please enter both email and password.');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  showMessage('Attempting to login...', 'notice');

  try {
    const response = await fetch(`${API_BASE_FALLBACK}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    auth.setAuthToken(data.token);
    showMessage('Login successful! Redirecting...', 'notice success');

    setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
  } catch (error) {
    showMessage(`Login failed: ${error.message}`);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

function checkAuthStatus() {
  if (auth.isLoggedIn() && auth.validateToken()) {
    window.location.href = 'admin.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  checkAdminStatus();

  if (loginForm) {
    loginForm.addEventListener('submit', login);
  }

  const emailField = document.getElementById('email');
  if (emailField) emailField.focus();
});
