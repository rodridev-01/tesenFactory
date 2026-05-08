import { fetchWithAuth } from "./authService";

const CLIENTES_ENDPOINT = "/clientes";

export const getClientesPorTaller = async (idTaller) => {
  return await fetchWithAuth(`${CLIENTES_ENDPOINT}/taller/${idTaller}`);
};

export const getCliente = async (id) => {
  return await fetchWithAuth(`${CLIENTES_ENDPOINT}/${id}`);
};

export const createCliente = async (cliente) => {
  return await fetchWithAuth(CLIENTES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });
};

export const updateCliente = async (id, cliente) => {
  return await fetchWithAuth(`${CLIENTES_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });
};

export const deleteCliente = async (id) => {
  return await fetchWithAuth(`${CLIENTES_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
};
