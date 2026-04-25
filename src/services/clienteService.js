import { fetchWithAuth } from "./authService";

const BASE_URL = "http://localhost:8080/api/clientes";

export const getClientesPorTaller = async (idTaller) => {
  return await fetchWithAuth(`${BASE_URL}/taller/${idTaller}`);
};

export const getCliente = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/${id}`);
};

export const createCliente = async (cliente) => {
  return await fetchWithAuth(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });
};

export const updateCliente = async (id, cliente) => {
  return await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });
};

export const deleteCliente = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
