import { fetchWithAuth } from "./authService";

const EMPRESAS_ENDPOINT = "/empresas";

export const getEmpresas = async () => {
  return await fetchWithAuth(EMPRESAS_ENDPOINT);
};

export const createEmpresa = async (empresa) => {
  return await fetchWithAuth(EMPRESAS_ENDPOINT, {
    method: "POST",
    body: empresa, 
  });
};

export const updateEmpresa = async (id, empresa) => {
  return await fetchWithAuth(`${EMPRESAS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: empresa,
  });
};

export const deleteEmpresa = async (id) => {
  return await fetchWithAuth(`${EMPRESAS_ENDPOINT}/${id}`, { 
    method: "DELETE" 
  });
};