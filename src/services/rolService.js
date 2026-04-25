const API_URL = "http://localhost:8080/api/roles";

export const getRoles = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al cargar roles");
  return res.json();
};
