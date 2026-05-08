import { fetchWithAuth } from "./authService";

const USUARIOS_ENDPOINT = "/usuarios";
const ROLES_ENDPOINT = "/roles";
const TALLERES_ENDPOINT = "/talleres";

export const getUsuarios = async () => {
  return await fetchWithAuth(USUARIOS_ENDPOINT);
};

export const getRoles = async () => {
  return await fetchWithAuth(ROLES_ENDPOINT);
};

export const getTalleres = async () => {
  return await fetchWithAuth(TALLERES_ENDPOINT);
};