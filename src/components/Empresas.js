import React, { useEffect, useState } from "react";
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from "../services/empresaService";

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const handleCreate = async () => {
    await createEmpresa({ nombre, pais: "PE", moneda: "PEN" });
    setNombre("");
    loadEmpresas();
  };

  const handleDelete = async (id) => {
    await deleteEmpresa(id);
    loadEmpresas();
  };

  return (
    <div>
      <h1>Empresas</h1>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre empresa" />
      <button onClick={handleCreate}>Agregar</button>
      <ul>
        {empresas.map(e => (
          <li key={e.id}>
            {e.nombre} ({e.pais} - {e.moneda})
            <button onClick={() => handleDelete(e.idEmpresa)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Empresas;
