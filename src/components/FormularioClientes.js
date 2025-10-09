import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

const FormularioClientes = ({
  nuevoCliente,
  manejoCambio,
  guardarCliente,
  actualizarCliente,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Editar Cliente" : "Registro de Clientes"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoCliente.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={nuevoCliente.apellido}
        onChangeText={(valor) => manejoCambio("apellido", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={nuevoCliente.cedula}
        onChangeText={(valor) => manejoCambio("cedula", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={String(nuevoCliente.edad)}
        onChangeText={(valor) => manejoCambio("edad", valor)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={nuevoCliente.telefono}
        onChangeText={(valor) => manejoCambio("telefono", valor)}
        keyboardType="phone-pad"
      />

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarCliente : guardarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
});

export default FormularioClientes;