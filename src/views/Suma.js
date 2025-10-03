import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";
import FormularioSuma from "../components/FormularioSuma.js";
import TablaSuma from "../components/TablaSuma.js";
import TituloTotalSuma from "../components/TituloTotalSuma.js";

const Suma = () => {
  const [sumas, setSumas] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sumas"));
      const data = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSumas(data);
    } catch (error) {
      console.error("Error al cargar sumas:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloTotalSuma sumas={sumas} />
      <FormularioSuma cargarDatos={cargarDatos} />
      <TablaSuma sumas={sumas} recargarDatos={cargarDatos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

export default Suma;