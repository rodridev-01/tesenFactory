import React, { useMemo, useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

export default function SearchableSelect({
  label,
  placeholder,
  items = [],
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  onAddNew,
  addLabel
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => items.find(i => String(getOptionValue(i)) === String(value)),
    [items, value, getOptionValue]
  );

  useEffect(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;

    return items.filter(item =>
      getOptionLabel(item)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [items, query, getOptionLabel]);

  const handleSelect = (item) => {
    onChange(getOptionValue(item));
    setQuery(getOptionLabel(item));
    setOpen(false);
  };

  return (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          color: "#cbd5e1",
          fontWeight: 600
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <FaSearch
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            color: "#9ca3af"
          }}
        />

        <input
          type="text"
          value={open ? query : (selected ? getOptionLabel(selected) : "")}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);

            if (!e.target.value) {
              onChange("");
            }
          }}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 12px 10px 35px",
            borderRadius: 8,
            border: "1px solid #2d2d30",
            background: "#151517",
            color: "#f1f5f9"
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#1f1f22",
            border: "1px solid #2d2d30",
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 1000
          }}
        >
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div
                key={getOptionValue(item)}
                onClick={() => handleSelect(item)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  color: "#f1f5f9",
                  fontSize: 15,
                  borderBottom: "1px solid #2d2d30"
                }}
              >
                {getOptionLabel(item)}
              </div>
            ))
          ) : (
            <button
              type="button"
              onClick={onAddNew}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontWeight: "bold"
              }}
            >
              <FaPlus /> {addLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}