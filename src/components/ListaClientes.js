import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ListaClientes = ({ clientes }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Clientes</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.item}>
              <Text style={styles.label}>Nombre: </Text>{item.nombre} {item.apellido}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Edad: </Text>{item.edad}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Teléfono: </Text>{item.telefono}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Cédula: </Text>{item.cedula}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  item: { fontSize: 16, marginBottom: 5 },
  label: { fontWeight: "bold" },
});

export default ListaClientes;