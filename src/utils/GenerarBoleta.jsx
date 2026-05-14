import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarBoletaPDF = (orden, ctx) => {
  const { getClienteNombre, getVehiculoNombre, getTecnicoNombre } = ctx;
  const logoBase64 = "/images/tesenLight.png";
  const doc = new jsPDF();

  // --- 1. ENCABEZADO Y LOGO ---
  const logoX = 14;
  const logoY = 10;
  const logoW = 45;
  const logoH = 15;

  doc.addImage(logoBase64, "PNG", logoX, logoY, logoW, logoH);

  const textX = logoX;
  const textYStart = logoY + logoH + 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  doc.text("Av. San Hilarion Este 333, San Juan de Lurigancho", textX, textYStart);
  doc.text("Teléfono: 960387180", textX, textYStart + 6);


  doc.setLineWidth(0.5);
  doc.rect(130, 10, 65, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("R.U.C. 20123456789", 162.5, 18, { align: "center" });
  doc.setFillColor(239, 240, 240);
  doc.rect(130, 21, 65, 8, "F");
  doc.text("BOLETA DE VENTA", 162.5, 27, { align: "center" });
  doc.text(`N° 00${orden.id_orden}`, 162.5, 36, { align: "center" });

  doc.setDrawColor(200);
  doc.line(14, 45, 195, 45);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", 14, 52);
  doc.setFont("helvetica", "normal");
  doc.text(getClienteNombre(orden.id_cliente).toUpperCase(), 45, 52);

  doc.setFont("helvetica", "bold");
  doc.text("VEHÍCULO:", 14, 58);
  doc.setFont("helvetica", "normal");
  doc.text(getVehiculoNombre(orden.id_vehiculo), 45, 58);

  doc.setFont("helvetica", "bold");
  doc.text("TÉCNICO:", 14, 64);
  doc.setFont("helvetica", "normal");
  doc.text(getTecnicoNombre(orden.id_tecnico), 45, 64);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA EMISIÓN:", 130, 52);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString(), 165, 52);

  const tableColumn = ["CANT.", "DESCRIPCIÓN", "V. UNIT", "TOTAL"];
  const tableRows = [];

  orden.detalles?.forEach((d) => {
    const rowData = [
      d.cantidad,
      d.descripcion,
      `S/. ${Number(d.precio_unitario || d.precioUnitario || 0).toFixed(2)}`,
      `S/. ${Number(d.total).toFixed(2)}`,
    ];
    tableRows.push(rowData);
  });

  autoTable(doc, {
    startY: 75,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], halign: "center" },
    columnStyles: {
      0: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
    styles: { fontSize: 9 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const total = orden.detalles?.reduce((acc, d) => acc + Number(d.total || 0), 0);
  const igv = total * 0.18;
  const subtotal = total - igv;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`OP. GRAVADA (S/):`, 140, finalY);
  doc.text(`${subtotal.toFixed(2)}`, 190, finalY, { align: "right" });

  doc.text(`IGV 18% (S/):`, 140, finalY + 6);
  doc.text(`${igv.toFixed(2)}`, 190, finalY + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFillColor(239, 68, 68);
  doc.setTextColor(255, 255, 255);
  doc.rect(138, finalY + 10, 57, 8, "F");
  doc.text(`TOTAL A PAGAR (S/):`, 140, finalY + 15);
  doc.text(`${total.toFixed(2)}`, 190, finalY + 15, { align: "right" });

  doc.setTextColor(120);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");

  doc.text(
    "Representación impresa de la Boleta de Venta Electrónica",
    105,
    275,
    { align: "center" }
  );

  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(
    "Este documento es una representación de la boleta emitida en formato digital.",
    105,
    279,
    { align: "center" }
  );

  doc.text(
    "Para cualquier consulta, comuníquese con el establecimiento.",
    105,
    283,
    { align: "center" }
  );

  doc.save(`boleta-${orden.id_orden}.pdf`);
};