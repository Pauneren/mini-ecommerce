const settingsForm = document.getElementById('settings-form');
const settingsMessage = document.getElementById('settings-message');
const settingsBtn = document.getElementById('settings-btn');

function showMessage(text, type = 'notice') {
  settingsMessage.innerHTML = `<div class="${escapeHtml(type)}">${escapeHtml(text)}</div>`;
}

async function saveSettings(event) {
  event.preventDefault();

  const current_password = document.getElementById('current_password').value;
  const new_email = document.getElementById('new_email').value.trim();
  const new_password = document.getElementById('new_password').value;
  const confirm_new_password = document.getElementById('confirm_new_password').value;

  if (!current_password) {
    showMessage('Current password is required.');
    return;
  }

  if (!new_email && !new_password) {
    showMessage('Enter a new email or new password to make a change.');
    return;
  }

  if (new_password && new_password.length < 8) {
    showMessage('New password must be at least 8 characters.');
    return;
  }

  if (new_password && new_password !== confirm_new_password) {
    showMessage('New passwords do not match.');
    return;
  }

  settingsBtn.disabled = true;
  settingsBtn.textContent = 'Saving...';

  try {
    const response = await fetch(`${API_BASE}/auth/me`, auth.addAuthHeader({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password, new_email, new_password, confirm_new_password }),
    }));

    const data = await response.json();

    if (response.status === 401 && data.error === 'Current password is incorrect.') {
      showMessage('Current password is incorrect.');
      return;
    }

    if (!response.ok) {
      throw new Error(data.error || 'Could not update credentials.');
    }

    if (data.token) {
      auth.setAuthToken(data.token);
    }

    showMessage('Credentials updated successfully.', 'notice success');
    settingsForm.reset();
  } catch (error) {
    showMessage(error.message);
  } finally {
    settingsBtn.disabled = false;
    settingsBtn.textContent = 'Save changes';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth()) return;

  if (settingsForm) {
    settingsForm.addEventListener('submit', saveSettings);
  }
});
