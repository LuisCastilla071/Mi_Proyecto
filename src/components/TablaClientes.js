import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarCliente from "./BotonEliminarCliente.js";

const TablaClientes = ({ clientes = [], eliminarCliente, editarCliente }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Clientes</Text>

      <ScrollView style={styles.scroll}>
        {/* Encabezado */}
        <View style={[styles.fila, styles.encabezado]}>
          <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
          <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
          <Text style={[styles.celda, styles.textoEncabezado]}>Cédula</Text>
          <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
          <Text style={[styles.celda, styles.textoEncabezado]}>Teléfono</Text>
          <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
        </View>

        {/* Contenido */}
        {clientes.length > 0 ? (
          clientes.map((item) => (
            <View key={item.id} style={styles.fila}>
              <Text style={styles.celda}>{item.nombre}</Text>
              <Text style={styles.celda}>{item.apellido}</Text>
              <Text style={styles.celda}>{item.cedula}</Text>
              <Text style={styles.celda}>{item.edad}</Text>
              <Text style={styles.celda}>{item.telefono}</Text>

              <View style={styles.celdaAcciones}>
                <TouchableOpacity
                  style={styles.botonEditar}
                  onPress={() => editarCliente(item)}
                >
                  <Text style={styles.textoBoton}>🖋️</Text>
                </TouchableOpacity>

                <BotonEliminarCliente id={item.id} eliminarCliente={eliminarCliente} />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.mensajeVacio}>No hay clientes registrados.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scroll: {
    maxHeight: 400,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  celda: {
    flex: 1,
    fontSize: 15,
    textAlign: "center",
  },
  celdaAcciones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
  mensajeVacio: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#666",
  },
});

export default TablaClientes;