const setupForm = document.getElementById('setup-form');
const setupMessage = document.getElementById('setup-message');
const setupBtn = document.getElementById('setup-btn');

function showMessage(text, type = 'notice') {
  setupMessage.innerHTML = `<div class="${escapeHtml(type)}">${escapeHtml(text)}</div>`;
}

async function checkSetupAllowed() {
  try {
    const response = await fetch(`${API_BASE}/auth/status`);
    const data = await response.json();

    if (data.hasAdmin) {
      window.location.href = 'admin-login.html';
    }
  } catch (error) {
    showMessage('Could not reach the backend. Make sure it is running.');
  }
}

async function submitSetup(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm_password').value;

  if (!email) { showMessage('Email is required.'); return; }
  if (!password) { showMessage('Password is required.'); return; }
  if (password.length < 8) { showMessage('Password must be at least 8 characters.'); return; }
  if (password !== confirm) { showMessage('Passwords do not match.'); return; }

  setupBtn.disabled = true;
  setupBtn.textContent = 'Creating account...';

  try {
    const response = await fetch(`${API_BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Setup failed.');
    }

    auth.setAuthToken(data.token);
    showMessage('Account created! Redirecting...', 'notice success');

    setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
  } catch (error) {
    showMessage(error.message);
  } finally {
    setupBtn.disabled = false;
    setupBtn.textContent = 'Create account';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkSetupAllowed();

  if (setupForm) {
    setupForm.addEventListener('submit', submitSetup);
  }

  const emailField = document.getElementById('email');
  if (emailField) emailField.focus();
});
