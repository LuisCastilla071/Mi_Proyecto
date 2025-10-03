import React from "react";
import { Text, StyleSheet, View } from "react-native";

const ResultadoSuma = ({ resultado }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {resultado !== null ? `Resultado: ${resultado}` : "Esperando datos..."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 15, alignItems: "center" },
  titulo: { fontSize: 20, fontWeight: "bold" },
});

export default ResultadoSuma;
