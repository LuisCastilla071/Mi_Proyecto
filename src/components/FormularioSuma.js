import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";

const FormularioSuma = ({ cargarDatos }) => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");

  const guardarSuma = async () => {
    if (num1 !== "" && num2 !== "") {
      const resultado = parseInt(num1) + parseInt(num2);
      try {
        await addDoc(collection(db, "sumas"), {
          num1: parseInt(num1),
          num2: parseInt(num2),
          resultado,
        });
        setNum1("");
        setNum2("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar suma:", error);
      }
    } else {
      alert("Complete ambos campos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Suma</Text>
      <TextInput
        style={styles.input}
        placeholder="Número 1"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />
      <TextInput
        style={styles.input}
        placeholder="Número 2"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />
      <Button title="Guardar" onPress={guardarSuma} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10 },
});

export default FormularioSuma;