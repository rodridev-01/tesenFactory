import React from "react";
import {
  FaInbox,
  FaChevronLeft,
  FaChevronRight,
  FaPrint,
  FaEdit,
  FaExternalLinkAlt,
  FaBars,
  FaTrash,
  FaCommentDots,
  FaEye,
} from "react-icons/fa";

const containerStyle = {
  borderRadius: "10px",
  border: "1px solid #30363d",
  overflow: "hidden",
  backgroundColor: "#0d1117",
  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
};

const headerStyle = {
  background: "#161b22",
  padding: "14px 20px",
  borderBottom: "1px solid #30363d",
  fontWeight: "700",
  fontSize: "1rem",
  color: "#f0f6fc",
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "20px",
  padding: "20px",
  borderBottom: "1px solid #21262d",
  backgroundColor: "#0d1117",
  transition: "all 0.2s ease",
  flexWrap: "wrap",
};

const contentStyle = {
  flex: 1,
  minWidth: "280px",
  color: "#e6edf3",
  lineHeight: 1.7,
};

const actionGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
  justifyContent: "flex-end",
  alignSelf: "flex-end",
};

const actionIconStyle = {
  width: "38px",
  height: "38px",
  border: "1px solid #30363d",
  borderRadius: "50%",
  background: "#21262d",
  color: "#c9d1d9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const badgeStyle = (color) => ({
  display: "inline-block",
  marginLeft: "10px",
  padding: "4px 10px",
  borderRadius: "999px",
  backgroundColor: `${color}22`,
  color,
  fontSize: "0.75rem",
  fontWeight: "700",
  border: `1px solid ${color}55`,
});

const EmptyState = ({ message = "No se encontraron registros" }) => (
  <div style={{ padding: "50px", textAlign: "center", color: "#8b949e" }}>
    <FaInbox size={42} style={{ marginBottom: "12px", opacity: 0.5 }} />
    <p style={{ margin: 0 }}>{message}</p>
  </div>
);

const defaultButtons = [
  { key: "prev", icon: <FaChevronLeft />, title: "Anterior" },
  { key: "print", icon: <FaPrint />, title: "Imprimir" },
  { key: "edit", icon: <FaEdit />, title: "Editar" },
  {
    key: "diagnostic",
    icon: <FaExternalLinkAlt />,
    title: "Diagnóstico",
    style: { background: "#ef4444" },
  },
  { key: "details", icon: <FaBars />, title: "Detalles" },
  { key: "delete", icon: <FaTrash />, title: "Eliminar" },
  { key: "comments", icon: <FaCommentDots />, title: "Comentarios" },
  { key: "view", icon: <FaEye />, title: "Visualizar" },
  { key: "next", icon: <FaChevronRight />, title: "Siguiente" },
];

const OrderCard = ({
  title = "Lista de Registros",
  data = [],
  renderContent,
  buttonConfig = {},
  buttonActions = {},
  getKey = (item, index) => item.id || item.id_orden || index,
  emptyMessage = "No se encontraron registros",
}) => {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>{title}</div>

      {data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={getKey(item, index)}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#161b22";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0d1117";
            }}
          >
            <div style={contentStyle}>
              {renderContent ? renderContent(item, badgeStyle) : null}
            </div>

            <div style={actionGroupStyle}>
              {defaultButtons
                .filter((button) => buttonConfig[button.key])
                .map((button) => (
                  <button
                    key={button.key}
                    style={{
                      ...actionIconStyle,
                      ...(button.style || {}),
                    }}
                    onClick={() => buttonActions[button.key]?.(item)}
                    title={button.title}
                    type="button"
                  >
                    {button.icon}
                  </button>
                ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default OrderCard;
