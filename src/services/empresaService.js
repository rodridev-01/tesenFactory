const API_URL = "http://localhost:8080/api/empresas";

export const getEmpresas = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createEmpresa = async (empresa) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa),
  });
  return res.json();
};

export const updateEmpresa = async (id, empresa) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa),
  });
  return res.json();
};

export const deleteEmpresa = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
