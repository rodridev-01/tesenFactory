import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const COLORS = {
  primary: '#dc2626', // Rojo Tesen
  dark: '#1f2937',    // Gris Oscuro
  grey: '#e5e7eb',
  lightBg: '#f9fafb'
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 3, borderBottomColor: COLORS.primary, paddingBottom: 10, marginBottom: 20 },
  logo: { width: 140, height: 50, objectFit: 'contain' },
  titleSection: { alignItems: 'flex-end', justifyContent: 'center' },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, textTransform: 'uppercase' },
  reportId: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' },

  // Bloques de Información
  sectionTitle: { fontSize: 10, fontWeight: 'bold', backgroundColor: COLORS.dark, color: 'white', padding: 4, marginTop: 15, marginBottom: 5 },
  
  // Grid de 2 columnas para Cliente y Vehículo
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCol: { width: '48%' },
  row: { flexDirection: 'row', marginBottom: 3, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 2 },
  label: { width: '40%', fontWeight: 'bold', fontSize: 9, color: COLORS.dark },
  value: { width: '60%', fontSize: 9 },

  // Fechas Destacadas
  datesContainer: { flexDirection: 'row', marginTop: 10, backgroundColor: COLORS.lightBg, padding: 8, borderRadius: 4, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  dateBox: { flex: 1 },
  dateLabel: { fontSize: 8, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  dateValue: { fontSize: 10, fontWeight: 'bold', color: COLORS.dark },

  // Cuerpo del Informe (Observaciones)
  obsContainer: { borderWidth: 1, borderColor: COLORS.grey, borderRadius: 4, minHeight: 60, padding: 8, marginTop: 5 },
  obsText: { fontSize: 9, lineHeight: 1.4 },

  // Tabla simple para repuestos usados
  table: { marginTop: 10, borderWidth: 1, borderColor: COLORS.grey },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 5, fontWeight: 'bold', fontSize: 9 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.grey, padding: 5, fontSize: 9 },
  
  // Footer firma
  footer: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' },
  signBox: { width: '40%', borderTopWidth: 1, borderTopColor: '#999', paddingTop: 5, alignItems: 'center' },
  signText: { fontSize: 8, color: '#666' }
});

const ReporteServicioTemplate = ({ data }) => {
  const logoUrl = window.location.protocol + "//" + window.location.host + "/images/tesen.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
          <View style={styles.titleSection}>
            <Text style={styles.reportTitle}>INFORME DE SERVICIO</Text>
            <Text style={styles.reportId}>ORDEN #{data.numeroOrden}</Text>
          </View>
        </View>

        {/* DATOS GENERALES */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={{fontWeight:'bold', marginBottom:5, color: COLORS.primary}}>CLIENTE</Text>
            <View style={styles.row}><Text style={styles.label}>Nombre:</Text><Text style={styles.value}>{data.cliente}</Text></View>
            <View style={styles.row}><Text style={styles.label}>DNI/RUC:</Text><Text style={styles.value}>{data.dni}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Teléfono:</Text><Text style={styles.value}>{data.telefono}</Text></View>
          </View>
          <View style={styles.infoCol}>
            <Text style={{fontWeight:'bold', marginBottom:5, color: COLORS.primary}}>VEHÍCULO</Text>
            <View style={styles.row}><Text style={styles.label}>Placa:</Text><Text style={styles.value}>{data.placa}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Marca/Modelo:</Text><Text style={styles.value}>{data.vehiculo}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Kilometraje:</Text><Text style={styles.value}>{data.kilometraje} km</Text></View>
          </View>
        </View>

        {/* FECHAS */}
        <View style={styles.datesContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Fecha Ingreso</Text>
            <Text style={styles.dateValue}>{data.fechaIngreso}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Fecha Salida</Text>
            <Text style={styles.dateValue}>{data.fechaSalida || "En Taller"}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Estado</Text>
            <Text style={{...styles.dateValue, color: data.estado === 'Finalizado' ? 'green' : 'orange'}}>{data.estado}</Text>
          </View>
        </View>

        {/* DIAGNÓSTICO Y OBSERVACIONES (LO MÁS IMPORTANTE PARA RECLAMOS) */}
        <Text style={styles.sectionTitle}>1. DIAGNÓSTICO INICIAL / PROBLEMA REPORTADO</Text>
        <View style={styles.obsContainer}>
          <Text style={styles.obsText}>{data.diagnostico || "Mantenimiento preventivo estándar."}</Text>
        </View>

        <Text style={styles.sectionTitle}>2. OBSERVACIONES DEL MECÁNICO (EVIDENCIA)</Text>
        <View style={{...styles.obsContainer, minHeight: 80, backgroundColor: '#fffbeb', borderColor: '#fcd34d'}}>
          <Text style={styles.obsText}>{data.observaciones || "Sin observaciones adicionales."}</Text>
        </View>

        {/* REPUESTOS / SERVICIOS */}
        <Text style={styles.sectionTitle}>3. DETALLE DE TRABAJOS Y REPUESTOS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{width:'10%'}}>CANT</Text>
            <Text style={{width:'70%'}}>DESCRIPCIÓN</Text>
            <Text style={{width:'20%', textAlign:'right'}}>ESTADO</Text>
          </View>
          {data.items && data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={{width:'10%'}}>{item.cantidad}</Text>
              <Text style={{width:'70%'}}>{item.descripcion}</Text>
              <Text style={{width:'20%', textAlign:'right'}}>Instalado</Text>
            </View>
          ))}
        </View>

        {/* DISCLAIMER LEGAL */}
        <View style={{marginTop: 20, padding: 5}}>
            <Text style={{fontSize: 7, color:'#666', textAlign:'justify'}}>
                Nota: El vehículo se entrega revisado y probado. Cualquier reclamo sobre el servicio realizado debe hacerse dentro de las 48 horas siguientes a la salida. La garantía cubre únicamente la mano de obra y repuestos suministrados por Tesen Factory.
            </Text>
        </View>

        {/* FIRMAS */}
        <View style={styles.footer}>
            <View style={styles.signBox}>
                <Text style={styles.signText}>MECÁNICO RESPONSABLE</Text>
            </View>
            <View style={styles.signBox}>
                <Text style={styles.signText}>CONFORMIDAD DEL CLIENTE</Text>
            </View>
        </View>

      </Page>
    </Document>
  );
};

export default ReporteServicioTemplate;