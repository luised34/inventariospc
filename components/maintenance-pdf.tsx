"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"

// Importar dinámicamente los componentes de react-pdf para evitar errores de SSR
const PDFComponents = dynamic(() => import("./pdf-components").then((mod) => mod.PDFComponents), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center">Cargando visor de PDF...</div>,
})

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    marginRight: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "gray",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBox: {
    width: "45%",
  },
  signatureLine: {
    borderBottom: "1px solid #000",
    marginBottom: 5,
  },
  annexSection: {
    marginTop: 20,
    pageBreak: "before",
  },
  softwareTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
})

// Componente para el PDF
const MaintenancePDF = ({ maintenance, equipment, technician }) => (
  <Document>
    {/* Primera página - Formato principal */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FORMATO DE MANTENIMIENTO DE EQUIPOS DE COMPUTO</Text>
          <Text style={{ fontSize: 8 }}>CODIGO: AFF4-I</Text>
          <Text style={{ fontSize: 8 }}>VERSION: 3</Text>
          <Text style={{ fontSize: 8 }}>FECHA DE VIGENCIA: 01/02/2016</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>FECHA DEL SERVICIO:</Text>
          <Text style={styles.value}>{maintenance.fecha}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>NUMERO DE SOLICITUD:</Text>
          <Text style={styles.value}>{maintenance.numeroSolicitud}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>MARQUE CON UNA X SEGÚN CORRESPONDA</Text>
        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <View style={maintenance.tipo === "Preventivo" ? styles.checkboxChecked : styles.checkbox} />
            <Text style={styles.value}>PREVENTIVO</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={maintenance.tipo === "Correctivo" ? styles.checkboxChecked : styles.checkbox} />
            <Text style={styles.value}>CORRECTIVO</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={maintenance.tipo === "Predictivo" ? styles.checkboxChecked : styles.checkbox} />
            <Text style={styles.value}>PREDICTIVO</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>RESPONSABLE DEL EQUIPO:</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>RESPONSABLE DEL EQUIPO:</Text>
            <Text style={styles.value}>{equipment.responsable || "N/A"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>NUMERO DE INVENTARIO:</Text>
            <Text style={styles.value}>{equipment.numeroInventario}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>CARGO:</Text>
            <Text style={styles.value}>{equipment.cargo || "N/A"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>UBICACIÓN:</Text>
            <Text style={styles.value}>{equipment.ubicacion || "N/A"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>DESCRIPCION DEL HARDWARE</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>DISPOSITIVO</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>ENCIENDE?</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>MARCA</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>MODELO</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>SERIE</Text>
            </View>
            <View style={[styles.tableCell, { width: "10%" }]}>
              <Text>CONDICION FISICA</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>COMPUTADOR</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>SI</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.marca}</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.modelo}</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>{equipment.serial}</Text>
            </View>
            <View style={[styles.tableCell, { width: "10%" }]}>
              <Text>BUENA</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>MONITOR</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>SI</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.marcaMonitor || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.modeloMonitor || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>{equipment.serialMonitor || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "10%" }]}>
              <Text>BUENA</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>TECLADO</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>SI</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.marcaTeclado || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.modeloTeclado || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>{equipment.serialTeclado || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "10%" }]}>
              <Text>BUENA</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>MOUSE</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>SI</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.marcaMouse || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text>{equipment.modeloMouse || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>{equipment.serialMouse || "N/A"}</Text>
            </View>
            <View style={[styles.tableCell, { width: "10%" }]}>
              <Text>BUENA</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>DESCRIPCION GENERAL DEL EQUIPO</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>NOMBRE DEL EQUIPO:</Text>
            <Text style={styles.value}>{equipment.nombre || equipment.marca + " " + equipment.modelo}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>SISTEMA OPERATIVO DEL EQUIPO:</Text>
            <Text style={styles.value}>{equipment.sistemaOperativo || "Windows 10"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>SISTEMA DE OFIMATICA DEL EQUIPO:</Text>
            <Text style={styles.value}>{equipment.ofimatica || "Microsoft Office 365"}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>PROCESADOR:</Text>
            <Text style={styles.value}>{equipment.procesador || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>MEMORIA RAM:</Text>
            <Text style={styles.value}>{equipment.memoriaRam || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>DISCO DURO:</Text>
            <Text style={styles.value}>{equipment.discoDuro || "N/A"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>DIAGNOSTICO INICIAL</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "100%" }]}>
              <Text>{maintenance.descripcion}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>SOLUCION ENTREGADA</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "100%" }]}>
              <Text>{maintenance.observaciones}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>MARQUE CON UNA X SEGÚN CORRESPONDA</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>SE REQUIRIO ALGUN REPUESTO?</Text>
              <View style={maintenance.requiereRepuesto ? styles.checkboxChecked : styles.checkbox} />
              <Text style={styles.value}>SI</Text>
              <View style={!maintenance.requiereRepuesto ? styles.checkboxChecked : styles.checkbox} />
              <Text style={styles.value}>NO</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.checkboxRow}>
              <Text style={styles.label}>SE REQUIRIO FORMATEAR EL EQUIPO?</Text>
              <View style={maintenance.requiereFormateo ? styles.checkboxChecked : styles.checkbox} />
              <Text style={styles.value}>SI</Text>
              <View style={!maintenance.requiereFormateo ? styles.checkboxChecked : styles.checkbox} />
              <Text style={styles.value}>NO</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 8 }}>SI SU RESPUESTA ES SI, DILIGENCIAR EL ANEXO TECNICO</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>RECOMENDACIONES PREVENTIVAS (OBSERVACIONES DEL INGENIERO)</Text>
        <Text style={styles.value}>
          SE RECOMIENDA REALIZAR LIMPIEZA AL EQUIPO CONSTANTEMENTE PARA EVITAR LA SUCIEDAD CON UN POCO DE ALCOHOL PARA
          PREVENIR LA PROPAGACION DEL VIRUS COVID-19
        </Text>
        <Text style={styles.value}>MANTENER EL AREA DE TRABAJO ASEADA</Text>
        <Text style={styles.value}>DESCONECTAR EQUIPO CUANDO ESTE CARGADO TOTALMENTE</Text>
        <Text style={styles.value}>NO CONSUMIR BEBIDAS NI INGERIR ALIMENTOS EN EL AREA DE TRABAJO</Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.label}>REALIZA MANTENIMIENTO</Text>
          <Text style={styles.value}>NOMBRE: {technician.nombre}</Text>
        </View>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.label}>RECIBE DE CONFORMIDAD</Text>
          <Text style={styles.value}>NOMBRE: </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Fecha de Actualización: 25 de Agosto de 2020</Text>
        <Text>Responsable: Ingeniero de Sistemas Informatica y Telecomunicaciones</Text>
      </View>
    </Page>

    {/* Segunda página - Anexos técnicos */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FORMATO DE MANTENIMIENTO DE EQUIPOS DE COMPUTO</Text>
          <Text style={{ fontSize: 8 }}>CODIGO: AFF4-I</Text>
          <Text style={{ fontSize: 8 }}>VERSION: 3</Text>
          <Text style={{ fontSize: 8 }}>FECHA DE VIGENCIA: 01/02/2016</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>FECHA DEL SERVICIO:</Text>
          <Text style={styles.value}>{maintenance.fecha}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>NUMERO DE SOLICITUD:</Text>
          <Text style={styles.value}>{maintenance.numeroSolicitud}</Text>
        </View>
      </View>

      <View style={styles.annexSection}>
        <Text style={styles.subtitle}>ANEXOS TECNICOS DEL MANTENIMIENTO</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>1. REPUESTOS UTILIZADOS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ITEM</Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>DESCRIPCION</Text>
              </View>
              <View style={[styles.tableCell, { width: "20%" }]}>
                <Text>SERIAL</Text>
              </View>
              <View style={[styles.tableCell, { width: "20%" }]}>
                <Text>OBSERVACION</Text>
              </View>
            </View>
            {/* Filas para repuestos - se pueden agregar dinámicamente */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>1</Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>{maintenance.repuestos?.[0]?.descripcion || "N/A"}</Text>
              </View>
              <View style={[styles.tableCell, { width: "20%" }]}>
                <Text>{maintenance.repuestos?.[0]?.serial || "N/A"}</Text>
              </View>
              <View style={[styles.tableCell, { width: "20%" }]}>
                <Text>{maintenance.repuestos?.[0]?.observacion || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>2. INSTALACION O ACTUALIZACION DEL SISTEMA</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>SISTEMA OPERATIVO:</Text>
              <Text style={styles.value}>{equipment.sistemaOperativo || "Windows 10"}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>OFIMATICA:</Text>
              <Text style={styles.value}>{equipment.ofimatica || "Microsoft Office 365"}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>MARQUE (✓) SI REALIZO ACCION SOBRE EL PROGRAMA EN LA LISTA</Text>
          <Text style={styles.label}>ACTIVIDAD (ATD): I = INSTALACION A = ACTUALIZACION</Text>

          <View style={styles.softwareTable}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>SISTEMA OPERATIVO</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>ANTIVIRUS: KASPERSKY ENDPOINT SECURITY</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>ADOBE READER</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>CONTROLADORES</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>PDF CREATOR</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
              <View style={[styles.tableCell, { width: "25%" }]}>
                <Text>CERVIX - CA</Text>
              </View>
              <View style={[styles.tableCell, { width: "10%" }]}>
                <Text>ATD</Text>
              </View>
            </View>
            {/* Más filas de software */}
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.label}>FIRMA DE QUIEN REALIZA MANENIMIENTO</Text>
            <Text style={styles.value}>NOMBRE: {technician.nombre}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Fecha de Actualización: 25 de Agosto de 2020</Text>
        <Text>Responsable: Ingeniero de Sistemas Informatica y Telecomunicaciones</Text>
      </View>
    </Page>
  </Document>
)

export function MaintenancePDFViewer({ maintenance, equipment, technician, onClose }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient ? (
        <PDFComponents maintenance={maintenance} equipment={equipment} technician={technician} />
      ) : (
        <div className="flex-1 flex items-center justify-center">Cargando visor de PDF...</div>
      )}
    </>
  )
}
