import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import FormularioEdades from "../components/FormularioEdades.js";
import TablaEdades from "../components/TablaEdades.js";
import TituloPromedio from "../components/TituloPromedio.js";

const Edades = () => {
  const [edades, setEdades] = useState([]);
  const [promedio, setPromedio] = useState(null);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "edades"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setEdades(data);
      if (data.length > 0) {
        calcularPromedioAPI(data);
      } else {
        setPromedio(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const calcularPromedioAPI = async (lista) => {
    try {
      const response = await fetch("https://kaniefeqg5.execute-api.us-east-1.amazonaws.com/calcular-promedio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edades: lista }),
      });
      const data = await response.json();
      setPromedio(data.promedio || null);
    } catch (error) {
      console.error("Error al calcular promedio en API:", error);
    }
  };

  const eliminarEdad = async (id) => {
    try {
      await deleteDoc(doc(db, "edades", id));
      cargarDatos(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloPromedio promedio={promedio} />
      <FormularioEdades cargarDatos={cargarDatos} />
      <TablaEdades edades={edades} eliminarEdad={eliminarEdad} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2.7, padding: 20 },
});

export default Edades;