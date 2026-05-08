import { fetchWithAuth } from "./authService";

const TALLERES_ENDPOINT = "/talleres";

export async function getTalleres() {
  return await fetchWithAuth(TALLERES_ENDPOINT);
}