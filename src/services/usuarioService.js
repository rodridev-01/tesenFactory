export const getUsuarios = async () => {
  const res = await fetch("http://localhost:8080/api/usuarios");
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const getRoles = async () => {
  const res = await fetch("http://localhost:8080/api/roles");
  if (!res.ok) throw new Error("Error al obtener roles");
  return res.json();
};

export const getTalleres = async () => {
  const res = await fetch("http://localhost:8080/talleres");
  if (!res.ok) throw new Error("Error al obtener talleres");
  return res.json();
};
