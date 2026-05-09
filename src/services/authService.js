import BASE_URL, { API_URL } from "../config";

// Parse JWT
const parseJwt = (token) => {
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const isAccessTokenValid = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return false;

  const payload = parseJwt(token);

  if (!payload?.exp) return false;

  return payload.exp * 1000 > Date.now();
};

export const login = async (usernameOrEmail, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usernameOrEmail,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("username", data.username);

  return data;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No hay refresh token");
  }

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh token inválido");
  }

  const data = await res.json();

  localStorage.setItem("accessToken", data.accessToken);

  return data.accessToken;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch {}

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("accessToken");

  if (!isAccessTokenValid()) {
    try {
      token = await refreshAccessToken();
    } catch {
      await logout();
      throw new Error("Sesión expirada");
    }
  }

  const finalUrl = url.startsWith("http")
    ? url
    : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const finalOptions = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  };

  const res = await fetch(finalUrl, finalOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en la petición");
  }

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await res.json();
  }

  return await res.text();
};