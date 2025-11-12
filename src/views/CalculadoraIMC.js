import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { ref, push, set, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig";

const CalculadoraIMC = () => {
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [registros, setRegistros] = useState([]);

  const calcularIMC = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100; // cm a metros

    if (isNaN(p) || isNaN(a) || a <= 0 || p <= 0) return null;
    const imc = (p / (a * a)).toFixed(2);

    let categoria = "";
    if (imc < 18.5) categoria = "Bajo peso";
    else if (imc < 25) categoria = "Peso normal";
    else if (imc < 30) categoria = "Sobrepeso";
    else categoria = "Obesidad";

    return { imc, categoria };
  };

  const guardarRegistro = async () => {
    if (!nombre.trim() || !peso || !altura) {
      alert("Completa todos los campos");
      return;
    }

    const resultado = calcularIMC();
    if (!resultado) {
      alert("Ingresa peso y altura válidos");
      return;
    }

    // UNA SOLA CONFIRMACIÓN
    Alert.alert(
      "Confirmar cálculo de IMC",
      `${nombre}\nPeso: ${peso} kg | Altura: ${altura} cm\nIMC: ${resultado.imc} → ${resultado.categoria}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Guardar",
          onPress: async () => {
            try {
              const nuevoRef = push(ref(realtimeDB, "imc_registros"));
              await set(nuevoRef, {
                nombre: nombre.trim(),
                peso: parseFloat(peso),
                altura: parseFloat(altura),
                imc: parseFloat(resultado.imc),
                categoria: resultado.categoria,
                fecha: new Date().toLocaleString("es-ES"),
              });

              setNombre("");
              setPeso("");
              setAltura("");
              alert("Registro guardado con éxito");
            } catch (error) {
              console.error("Error:", error);
              alert("Error al guardar");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = onValue(ref(realtimeDB, "imc_registros"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data)
          .map(([id, valor]) => ({ id, ...valor }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // más reciente primero
        setRegistros(lista);
      } else {
        setRegistros([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Calculadora de IMC</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso en kg (ej. 70)"
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Altura en cm (ej. 170)"
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
      />

      <Button title="Calcular y Guardar" onPress={guardarRegistro} />

      <Text style={styles.subtitulo}>Historial de registros:</Text>

      {registros.length === 0 ? (
        <Text style={styles.vacio}>No hay registros aún</Text>
      ) : (
        registros.map((r) => (
          <View key={r.id} style={styles.tarjeta}>
            <Text style={styles.nombre}>{r.nombre}</Text>
            <Text>Peso: {r.peso} kg | Altura: {r.altura} cm</Text>
            <Text style={styles.imc}>
              IMC: {r.imc} → {r.categoria}
            </Text>
            <Text style={styles.fecha}>{r.fecha}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "#333",
  },
  tarjeta: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  nombre: { fontWeight: "bold", fontSize: 16 },
  imc: { fontWeight: "bold", color: "#e74c3c", marginTop: 5 },
  fecha: { fontSize: 12, color: "#777", marginTop: 5 },
  vacio: { textAlign: "center", color: "#888", fontStyle: "italic", marginTop: 20 },
});

export default CalculadoraIMC;