import { fetchWithAuth } from "./authService";

const ROLES_ENDPOINT = "/roles";

export const getRoles = async () => {
  return await fetchWithAuth(ROLES_ENDPOINT);
};