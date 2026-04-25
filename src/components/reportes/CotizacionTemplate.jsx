import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Colores de la marca
const COLORS = {
  primary: '#dc2626', // Rojo Tesen 
  dark: '#1f2937',    // Gris oscuro 
  grey: '#e5e7eb',    // Gris claro 
  lightBg: '#f9fafb'  // Fondo suave
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },

  // HEADER (Barra Roja inferior)
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    borderBottomWidth: 3, 
    borderBottomColor: COLORS.primary, // Línea roja de marca
    paddingBottom: 10 
  },
  
  logoSection: { width: '60%' },
  logo: { width: 150, height: 60, objectFit: 'contain' }, 
  
  // Dirección debajo del logo
  companyDetails: { fontSize: 9, color: '#555', marginTop: 4 },

  // Datos de la derecha
  metaSection: { width: '35%', alignItems: 'flex-end', justifyContent: 'center' },
  metaTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 5 },
  metaRow: { flexDirection: 'row', marginBottom: 4 },
  metaLabel: { fontWeight: 'bold', marginRight: 5, fontSize: 10, color: COLORS.dark },
  metaValue: { fontSize: 10 },

  // SECCION CLIENTE
  billToContainer: { 
    marginBottom: 20, 
    padding: 12, 
    backgroundColor: COLORS.lightBg, 
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary // Borde rojo elegante a la izquierda
  },
  billToTitle: { fontWeight: 'bold', fontSize: 10, marginBottom: 4, color: COLORS.primary, textTransform: 'uppercase' },
  clientName: { fontSize: 11, fontWeight: 'bold', color: COLORS.dark, marginBottom: 2 },
  clientDetail: { fontSize: 9, color: '#555' },

  // TABLA
  tableContainer: { marginTop: 10 },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.dark, // <--- CAMBIO AQUÍ: Oscuro para que se vea profesional
    color: 'white', 
    paddingVertical: 8, 
    paddingHorizontal: 6, 
    fontWeight: 'bold', 
    fontSize: 9, 
    alignItems: 'center', 
    borderRadius: 2 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.grey, 
    paddingVertical: 8, 
    paddingHorizontal: 6, 
    alignItems: 'center' 
  },
  
  colCant: { width: '10%', textAlign: 'center' },
  colDesc: { width: '60%', paddingLeft: 10 },
  colUnit: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right', fontWeight: 'bold' },

  // FOOTER
  footerContainer: { flexDirection: 'row', marginTop: 20, borderTopWidth: 1, borderTopColor: COLORS.grey, paddingTop: 15 },
  notesSection: { width: '65%', paddingRight: 20 },
  notesTitle: { fontWeight: 'bold', fontSize: 9, marginBottom: 5, color: COLORS.dark },
  notesText: { fontSize: 8, color: '#666', fontStyle: 'italic', lineHeight: 1.4 },

  totalsSection: { width: '35%', backgroundColor: COLORS.lightBg, padding: 12, borderRadius: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalLabel: { fontWeight: 'bold', fontSize: 9, color: COLORS.dark },
  totalValue: { fontSize: 9, textAlign: 'right' },
  
  // Total Final con borde rojo arriba
  grandTotalBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8, 
    paddingTop: 8, 
    borderTopWidth: 2, 
    borderTopColor: COLORS.primary 
  },
  grandTotalLabel: { fontWeight: 'bold', fontSize: 11, color: COLORS.dark },
  grandTotalValue: { fontWeight: 'bold', fontSize: 12, color: COLORS.dark } // Valor en oscuro para seriedad
});

const CotizacionTemplate = ({ data, items, totales, cliente }) => {
  
  // Usamos tu método de URL que confirmaste que funciona
  const logoUrl = window.location.protocol + "//" + window.location.host + "/images/tesen.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image src={logoUrl} style={styles.logo} />
            <Text style={{fontSize: 9, color: COLORS.primary, fontWeight: 'bold', marginTop: 5}}>MECÁNICA AUTOMOTRIZ</Text>
            <Text style={styles.companyDetails}>Av. San Hilarion Este 333</Text>
            <Text style={styles.companyDetails}>San Juan de Lurigancho, Lima</Text>
          </View>

          <View style={styles.metaSection}>
            <Text style={styles.metaTitle}>Cotización</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>N°:</Text>
              <Text style={styles.metaValue}>{data.numero}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Fecha:</Text>
              <Text style={styles.metaValue}>{data.fecha}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Pago:</Text>
              <Text style={styles.metaValue}>{data.condiciones}</Text>
            </View>
          </View>
        </View>

        {/* DATOS CLIENTE */}
        <View style={styles.billToContainer}>
          <Text style={styles.billToTitle}>DATOS DEL CLIENTE</Text>
          <Text style={styles.clientName}>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente General'}</Text>
          <Text style={styles.clientDetail}>{cliente?.dni ? `DNI/RUC: ${cliente.dni}` : 'DNI: ---'}</Text>
          <Text style={styles.clientDetail}>{data.dirFacturacion || cliente?.direccion || 'Dirección: ---'}</Text>
        </View>

        {/* TABLA DE PRODUCTOS */}
        <View style={styles.tableContainer}>
          {/* Encabezado oscuro */}
          <View style={styles.tableHeader}>
            <Text style={styles.colCant}>CANT.</Text>
            <Text style={styles.colDesc}>DESCRIPCIÓN</Text>
            <Text style={styles.colUnit}>P. UNIT</Text>
            <Text style={styles.colTotal}>TOTAL</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? 'white' : COLORS.lightBg }]}>
              <Text style={styles.colCant}>{item.cantidad}</Text>
              <Text style={styles.colDesc}>{item.descripcion}</Text>
              <Text style={styles.colUnit}>S/ {Number(item.precio).toFixed(2)}</Text>
              <Text style={styles.colTotal}>S/ {(item.cantidad * item.precio).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* TOTALES */}
        <View style={styles.footerContainer}>
          <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Notas / Condiciones:</Text>
              <Text style={styles.notesText}>{data.notaPublica}</Text>
              <Text style={{marginTop: 5, fontSize: 8, fontStyle:'italic'}}>Validez de la oferta: 15 días.</Text>
              <Text style={{fontSize: 8, fontStyle:'italic'}}>Los precios incluyen IGV.</Text>
          </View>

          <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal:</Text>
                  <Text style={styles.totalValue}>S/ {totales.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>IGV (18%):</Text>
                  <Text style={styles.totalValue}>S/ {totales.impuestos.toFixed(2)}</Text>
              </View>
              <View style={styles.grandTotalBox}>
                  <Text style={styles.grandTotalLabel}>TOTAL:</Text>
                  <Text style={styles.grandTotalValue}>S/ {totales.total.toFixed(2)}</Text>
              </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default CotizacionTemplate;