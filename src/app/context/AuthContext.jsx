"use client";

import React, { createContext, useReducer, useEffect, useContext } from "react";
import { getToken, getUserFromToken, saveToken, removeToken } from "../utils/auth";
import api from "../utils/api";

// Initial State
const initialState = {
  user: null,
  role: null,
  loading: true,
  isLoggedIn: false,
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        role: action.role,
        isLoggedIn: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: true,
      }
    default:
      return state;
  }
}

// Context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Extract user from token
  const refreshUser = () => {
    const token = getToken();
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    const payload = getUserFromToken(token);
    if (payload?.userId) {
      dispatch({ type: "SET_USER", payload, role: "user" });
    } else if (payload?.doctorId) {
      dispatch({ type: "SET_USER", payload, role: "doctor" });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  };

  // Auto login on mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Login
const login = async ({ email, password }, type ) => {
  dispatch({ type: "LOADING" });
  const url = type === "doctor" ? "/doctors/login" : "/users/login";

  try {
    const { data } = await api.post(url, { email, password });
    saveToken(data.token);

    // Decode directly instead of waiting for refreshUser
    const base64Payload = data.token.split('.')[1];
    const decodedPayload = JSON.parse(atob(base64Payload));

    dispatch({
      type: "SET_USER",
      payload: decodedPayload,
      role: decodedPayload.doctorId ? "doctor" : "user",
    });
  } catch (error) {
    dispatch({ type: "LOGOUT" });
    throw error;
  }
};


  // Logout
  const logout = () => {
    removeToken();
    dispatch({ type: "LOGOUT" });
    window.location.href = "/pages/login"; // optional
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuthContext() {
  return useContext(AuthContext);
}
