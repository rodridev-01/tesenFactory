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

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - 1999 + 2 },
    (_, i) => currentYear + 1 - i
  );

  const [vehiculoForm, setVehiculoForm] = useState({
    idCliente: "",
    idMarca: "",
    modelo: "",
    anio: currentYear,
    tipo: "Moto",
    placa: "",
    color: "",
    vin: "",
    kilometraje: "",
    observaciones: "",
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const vehiculosData = await getVehiculos();
      const clientesData = await getClientesPorTaller(idTaller);
      const marcasData = await getMarcas();

      setVehiculos(vehiculosData || []);
      setClientes(clientesData || []);
      setMarcas(marcasData || []);

    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }, [idTaller]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleVehiculoChange = (e) => {
    setVehiculoForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const guardarVehiculo = async (form, editId) => {

    const payload = {
      idCliente: Number(form.idCliente),
      idMarca: Number(form.idMarca),
      modelo: form.modelo,
      anio: Number(form.anio),
      tipo: "Moto",
      placa: form.placa?.toUpperCase().trim(),
      color: form.color,
      vin: form.vin?.toUpperCase().trim(),
      kilometraje: Number(form.kilometraje),
      observaciones: `[Sistema: ${form.sistema}] ${form.observaciones || ""}`.trim(),
    };

    try {

      let response;

      if (editId) {
        response = await updateVehiculo(editId, payload);
      } else {
        response = await createVehiculo(payload);
      }

      await cargarDatos();

      return response;

    } catch (error) {

      throw error;
    }
  };

  const cambiarEstadoVehiculo = async (id) => {
    await toggleVehiculo(id);
    await cargarDatos();
  };

  return {
    vehiculos,
    clientes,
    marcas,
    years,
    loading,
    guardarVehiculo,
    vehiculoForm,
    handleVehiculoChange,
    setVehiculoForm,
    cambiarEstadoVehiculo,
    recargarVehiculos: cargarDatos,
  };
};