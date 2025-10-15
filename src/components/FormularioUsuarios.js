import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

const FormularioUsuarios = ({
  nuevoUsuario,
  manejoCambio,
  guardarUsuario,
  actualizarUsuario,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Editar Usuario" : "Registro de Usuarios"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoUsuario.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChangeText={(valor) => manejoCambio("correo", valor)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={nuevoUsuario.telefono}
        onChangeText={(valor) => manejoCambio("telefono", valor)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={String(nuevoUsuario.edad)}
        onChangeText={(valor) => manejoCambio("edad", valor)}
        keyboardType="numeric"
      />

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarUsuario : guardarUsuario}
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

export default FormularioUsuarios;