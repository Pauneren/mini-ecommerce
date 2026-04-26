// Authentication utilities for MiniStore admin

// Store JWT token in localStorage
function setAuthToken(token) {
  localStorage.setItem('adminToken', token);
}

// Get JWT token from localStorage
function getAuthToken() {
  return localStorage.getItem('adminToken');
}

// Remove JWT token from localStorage (logout)
function removeAuthToken() {
  localStorage.removeItem('adminToken');
}

// Check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Redirect to login page if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Parse JWT token to get payload (without verification)
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token) {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true; // Invalid token
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Validate current token and remove if expired
function validateToken() {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    removeAuthToken();
    return false;
  }
  return true;
}

// Logout function
function logout() {
  removeAuthToken();
  window.location.href = 'admin-login.html';
}

// Add authorization header to fetch options
function addAuthHeader(options = {}) {
  const token = getAuthToken();
  if (!token) {
    return options;
  }
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };
}

// Export functions for use in other scripts
window.auth = {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isLoggedIn,
  requireAuth,
  parseJWT,
  isTokenExpired,
  validateToken,
  logout,
  addAuthHeader
};
