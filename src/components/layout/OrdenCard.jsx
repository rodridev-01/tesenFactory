function OrdenCard({ orden, getClienteNombre, getVehiculoNombre, getTecnicoNombre, onDiagnostico }) {

  const km = orden.kilometrajeEntrada || orden.kilometraje_entrada;

  return (
    <div style={{
      background: "#1f1f22",
      border: "1px solid #2d2d30",
      borderRadius: "10px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <h3 style={{ margin: 0, color: "#f1f5f9" }}>
        Orden #{orden.id_orden}
      </h3>

      <p><b>Cliente:</b> {getClienteNombre(orden.id_cliente)}</p>
      <p><b>Vehículo:</b> {getVehiculoNombre(orden.id_vehiculo)}</p>
      <p><b>Técnico:</b> {getTecnicoNombre(orden.id_tecnico)}</p>

      <p>
        <b>Kilometraje:</b> {km ? `${Number(km).toLocaleString()} km` : "-"}
      </p>

      <p><b>Estado:</b> {orden.estado}</p>

      <button
        onClick={() => onDiagnostico(orden)}
        style={{
          marginTop: "10px",
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "8px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Diagnóstico
      </button>
    </div>
  );
}

export default OrdenCard;