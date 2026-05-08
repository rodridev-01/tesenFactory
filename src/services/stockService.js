import { fetchWithAuth } from "./authService";

const STOCK_ENDPOINT = "/stock";

export async function getStockPorAlmacen(idAlmacen) {
  return await fetchWithAuth(`${STOCK_ENDPOINT}/almacen/${idAlmacen}`);
}

export async function getStockPorProducto(idProducto) {
  return await fetchWithAuth(`${STOCK_ENDPOINT}/producto/${idProducto}`);
}

export async function crearOActualizarStock(stock) {
  return await fetchWithAuth(STOCK_ENDPOINT, {
    method: "POST",
    body: stock 
  });
}

export async function eliminarStock(idProducto, idAlmacen) {
  return await fetchWithAuth(`${STOCK_ENDPOINT}/${idProducto}/${idAlmacen}`, {
    method: "DELETE"
  });
}