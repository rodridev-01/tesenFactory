import React from "react";
import DataTable from "react-data-table-component";
import { FaInbox, FaChevronDown } from "react-icons/fa";

// ================= ESTILOS =================
const customStyles = {
  table: {
    style: {
      backgroundColor: "#1f1f22",
      color: "#f1f5f9",
      borderRadius: "0 0 8px 8px",
    },
  },
  tableWrapper: {
    style: {
      display: "table",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)",
      borderRadius: "8px",
      border: "1px solid #2d2d30",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#151517",
      borderTop: "1px solid #2d2d30",
      borderBottom: "2px solid #2d2d30",
      minHeight: "52px",
      color: "#9ca3af",
    },
  },
  headCells: {
    style: {
      fontSize: "0.85rem",
      fontWeight: "700",
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem",
      color: "#f1f5f9",
      backgroundColor: "#1f1f22",
      minHeight: "48px",
      borderBottom: "1px solid #2d2d30",
      "&:hover": {
        backgroundColor: "#2d2d30",
        cursor: "pointer",
        transition: "all 0.2s",
        color: "#fff",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "#1f1f22",
      borderTop: "1px solid #2d2d30",
      fontSize: "0.8rem",
      color: "#9ca3af",
    },
    pageButtonsStyle: {
      color: "#9ca3af",
      fill: "#9ca3af",
      "&:disabled": {
        color: "#4b5563",
        fill: "#4b5563",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#2d2d30",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#2d2d30",
      },
    },
  },
  noData: {
    style: {
      backgroundColor: "#1f1f22",
      color: "#64748b",
    },
  },
};

// ================= EXPAND =================
const ExpandedComponent = ({ data }) => (
  <div style={{ padding: "20px", backgroundColor: "#151517", borderBottom: "1px solid #2d2d30", color: "#cbd5e1" }}>
    <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#ef4444" }}>Detalles:</h4>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ fontSize: "0.85rem" }}>
          <span style={{ fontWeight: "600", color: "#9ca3af" }}>
            {key.replace(/_/g, " ")}:
          </span>
          <span style={{ marginLeft: "5px" }}>
            {value !== null ? value.toString() : "-"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ================= NO DATA =================
const NoDataComponent = () => (
  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
    <FaInbox size={40} style={{ marginBottom: "10px", opacity: 0.5 }} />
    <p>No hay registros para mostrar</p>
  </div>
);

// ================= COMPONENTE =================
const GlobalDataTable = (props) => {
  return (
    <div style={{
      background: "#1f1f22",
      borderRadius: "8px",
      border: "1px solid #2d2d30",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5)"
    }}>

      {/* 🔥 HEADER SUPERIOR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #2d2d30",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        {/* IZQUIERDA*/}
        <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>

        </div>

        {/* DERECHA (buscador) */}
        <div>
          {props.subHeaderComponent}
        </div>
      </div>

      {/* TABLA */}
      <DataTable
        {...props}
        customStyles={customStyles}
        theme="dark"
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="600px"

        paginationComponentOptions={{
          rowsPerPageText: "Filas por página",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}

        noDataComponent={<NoDataComponent />}

        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandableIcon={{
          collapsed: <FaChevronDown size={14} color="#64748b" />,
          expanded: <FaChevronDown size={14} style={{ transform: "rotate(180deg)" }} color="#ef4444" />
        }}
      />
    </div>
  );
};

export default GlobalDataTable;