import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import FormularioClientes from "../components/FormularioClientes.js";
import TablaClientes from "../components/TablaClientes.js";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  // Cargar datos desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      <TablaClientes clientes={clientes} eliminarCliente={eliminarCliente} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

export default Clientes;
