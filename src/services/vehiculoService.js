import { fetchWithAuth } from "./authService";

const API = "http://localhost:8080/api/vehiculos";
const CLIENTES_API = "http://localhost:8080/api/clientes";
const MARCAS_API = "http://localhost:8080/api/marcas";

export const getVehiculos = () => fetchWithAuth(API);

export const getClientesPorTaller = (idTaller) =>
  fetchWithAuth(`${CLIENTES_API}/taller/${idTaller}`);

export const getMarcas = () => fetchWithAuth(MARCAS_API);

export const createVehiculo = (vehiculo) =>
  fetchWithAuth(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehiculo),
  });

export const updateVehiculo = (id, vehiculo) =>
  fetchWithAuth(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehiculo),
  });

export const toggleVehiculo = (id) =>
  fetchWithAuth(`${API}/${id}/toggle`, {
    method: "PUT",
  });