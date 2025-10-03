import React from "react";
import { Text, StyleSheet } from "react-native";

const TituloTotalSuma = ({ sumas = [] }) => {
  const total = sumas.reduce((acc, item) => acc + (item.resultado || 0), 0);

  return <Text style={styles.titulo}>Total de Resultados: {total}</Text>;
};

const styles = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
});

export default TituloTotalSuma;