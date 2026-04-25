const API_URL = "http://localhost:8080/api/stock";

export async function getStockPorAlmacen(idAlmacen) {
  const res = await fetch(`${API_URL}/almacen/${idAlmacen}`);
  if (!res.ok) throw new Error("Error al obtener stock");
  return res.json();
}

export async function getStockPorProducto(idProducto) {
  const res = await fetch(`${API_URL}/producto/${idProducto}`);
  if (!res.ok) throw new Error("Error al obtener stock");
  return res.json();
}

export async function crearOActualizarStock(stock) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock)
  });
  if (!res.ok) throw new Error("Error al crear/actualizar stock");
  return res.json();
}

export async function eliminarStock(idProducto, idAlmacen) {
  const res = await fetch(`${API_URL}/${idProducto}/${idAlmacen}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error al eliminar stock");
  return res.json();
}
