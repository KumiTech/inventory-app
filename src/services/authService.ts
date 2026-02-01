import api from "../lib/axios";

/* ================= LOGIN ================= */
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
};

/* ================= REGISTER ================= */
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const res = await api.post("/api/auth/register", {
    username,
    email,
    password,
    confirmPassword,
  });
  return res.data;
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

/* ================= CURRENT USER ================= */
export const fetchCurrentUser = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};
