import { fetchWithAuth } from "./authService";

const PRODUCTOS_ENDPOINT = "/productos";

export async function getProductos() {
  return await fetchWithAuth(PRODUCTOS_ENDPOINT);
}

export async function getProducto(id) {
  return await fetchWithAuth(`${PRODUCTOS_ENDPOINT}/${id}`);
}

export async function createProducto(producto) {
  return await fetchWithAuth(PRODUCTOS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(producto)
  });
}

export async function updateProducto(id, producto) {
  return await fetchWithAuth(`${PRODUCTOS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(producto)
  });
}

export async function deleteProducto(id) {
  return await fetchWithAuth(`${PRODUCTOS_ENDPOINT}/${id}`, {
    method: "DELETE"
  });
}