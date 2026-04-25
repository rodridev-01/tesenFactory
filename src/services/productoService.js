const API_URL = "http://localhost:8080/api/productos";

export async function getProductos() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createProducto(producto) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });
  return res.json();
}

export async function updateProducto(id, producto) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });
  return res.json();
}

export async function deleteProducto(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
