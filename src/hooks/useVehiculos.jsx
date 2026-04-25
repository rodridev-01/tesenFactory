import { useState, useEffect, useCallback } from "react";
import {
  getVehiculos,
  getClientesPorTaller,
  getMarcas,
  createVehiculo,
  updateVehiculo,
  toggleVehiculo,
} from "../services/vehiculoService";

export const useVehiculos = (idTaller = 1) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [vehiculosData, clientesData, marcasData] = await Promise.all([
        getVehiculos(),
        getClientesPorTaller(idTaller),
        getMarcas(),
      ]);

      setVehiculos(vehiculosData || []);
      setClientes(clientesData || []);
      setMarcas(marcasData || []);
    } finally {
      setLoading(false);
    }
  }, [idTaller]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const guardarVehiculo = async (form, editId) => {
    const payload = {
      idCliente: Number(form.idCliente),
      idMarca: Number(form.idMarca),
      modelo: form.modelo,
      anio: Number(form.anio),
      tipo: "Moto",
      placa: form.placa,
      color: form.color,
      vin: form.vin,
      kilometraje: Number(form.kilometraje),
      observaciones: `[Sistema: ${form.sistema}] ${form.observaciones || ""}`.trim(),
    };

    if (editId) {
      await updateVehiculo(editId, payload);
    } else {
      await createVehiculo(payload);
    }

    await cargarDatos();
  };

  const cambiarEstadoVehiculo = async (id) => {
    await toggleVehiculo(id);
    await cargarDatos();
  };

  return {
    vehiculos,
    clientes,
    marcas,
    loading,
    guardarVehiculo,
    cambiarEstadoVehiculo,
    recargarVehiculos: cargarDatos,
  };
};