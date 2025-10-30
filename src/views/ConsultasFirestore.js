import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function ConsultasFirestore() {

  // 1️⃣ Las 2 ciudades más pobladas de Guatemala
  const consultarCiudadesGuatemalaTop = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No se encontraron ciudades en Guatemala");
        return;
      }

      console.log("▶ Las 2 ciudades más pobladas de Guatemala:");
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id} | Nombre: ${data.nombre} | Población: ${data.poblacion} | País: ${data.pais}`);
      });
    } catch (error) {
      console.error("❌ Error consultando ciudades de Guatemala:", error);
    }
  };


  // 🔹 Ejecutar consultas al montar el componente
  useEffect(() => {
    (async () => {
      await consultarCiudadesGuatemalaTop();
    })();
  }, []);

  return (
    <ScrollView>
      <Text>ConsultasFirestore</Text>
    </ScrollView>
  );
}
