// Save JWT token to storage
export function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

// Remove token (logout)
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// Get JWT token
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Optionally: Parse payload for user/doctor id/role
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}
