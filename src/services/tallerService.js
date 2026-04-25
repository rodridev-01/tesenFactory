const API_URL = "http://localhost:8080/api/talleres";

export async function getTalleres() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener talleres");
  }
  return response.json();
}
