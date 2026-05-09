import { fetchWithAuth } from "./authService";

const VEHICULOS_ENDPOINT = "/vehiculos";
const CLIENTES_ENDPOINT = "/clientes";
const MARCAS_ENDPOINT = "/marcas";

export const getVehiculos = () =>
  fetchWithAuth(VEHICULOS_ENDPOINT);

export const getClientesPorTaller = (idTaller) =>
  fetchWithAuth(`${CLIENTES_ENDPOINT}/taller/${idTaller}`);

export const getMarcas = () =>
  fetchWithAuth(MARCAS_ENDPOINT);

export const createVehiculo = (vehiculo) =>
  fetchWithAuth(VEHICULOS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(vehiculo),
  });

export const updateVehiculo = (id, vehiculo) =>
  fetchWithAuth(`${VEHICULOS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehiculo),
  });

export const toggleVehiculo = (id) =>
  fetchWithAuth(`${VEHICULOS_ENDPOINT}/${id}/toggle`, {
    method: "PUT",
  });