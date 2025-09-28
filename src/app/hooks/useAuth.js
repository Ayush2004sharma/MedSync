import { useEffect, useState } from "react";
import { getToken, getUserFromToken, removeToken } from "../utils/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  };

  return { user, isLoggedIn: !!user, logout };
}
