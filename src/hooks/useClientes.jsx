import { useState, useEffect } from "react";
import {
  getClientesPorTaller,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/clienteService";

export function useClientes(idTaller = 1) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [clienteForm, setClienteForm] = useState({
    tipoDocumento: "DNI",
    dni: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    observaciones: "",
    id_taller: idTaller
  });

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientesPorTaller(idTaller);
      setClientes(data || []);
      return data || [];
    } finally {
      setLoading(false);
    }
  };

  const guardarCliente = async (cliente, editId = null) => {
    const response = editId
      ? await updateCliente(editId, cliente)
      : await createCliente(cliente);

    await cargarClientes();
    return response;
  };

  const cambiarEstadoCliente = async (id) => {
    await deleteCliente(id);
    await cargarClientes();
  };

  const handleClienteChange = (e) => {
    setClienteForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    cargarClientes();
  }, [idTaller]);

  return {
    clientes,
    loading,
    clienteForm,
    setClienteForm,
    handleClienteChange,
    cargarClientes,
    guardarCliente,
    cambiarEstadoCliente,
  };
}