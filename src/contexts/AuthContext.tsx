import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
} from "../services/authService";

// ===== Define Auth Context Type =====
interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  signUp: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>; // <-- Added for Google auth
}

// ===== Create Context =====
const AuthContext = createContext<AuthContextType | null>(null);

// ===== AuthProvider Component =====
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ===== Load user if token exists ===== */
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ===== LOGIN ===== */
  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    const res = await loginUser(email, password);

    if (res.token) {
      if (rememberMe) {
        localStorage.setItem("token", res.token);
      } else {
        sessionStorage.setItem("token", res.token);
      }
      setUser(res.user);
    }
  };

  /* ===== REGISTER ===== */
  const signUp = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    await registerUser(username, email, password, confirmPassword);
  };

  /* ===== LOGOUT ===== */
  const signOut = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  /* ===== GOOGLE SIGN-IN (Stub for now) ===== */
  const signInWithGoogle = async () => {
    // Static placeholder for now
    console.log("Google sign-in clicked");
    // Example: simulate user login
    const googleUser = { username: "GoogleUser", email: "google@example.com" };
    setUser(googleUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===== Custom Hook =====
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
