import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../components/FormularioClientes.js";
import TablaClientes from "../components/TablaClientes.js";

const Clientes = ({ cerrarSesion }) => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    edad: "",
    telefono: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActualizar, setIdActualizar] = useState(null);

  // Cargar clientes desde Firestore
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

  // Manejar cambios en el formulario
  const manejoCambio = (campo, valor) => {
    setNuevoCliente({ ...nuevoCliente, [campo]: valor });
  };

  // Guardar cliente nuevo
  const guardarCliente = async () => {
    const { nombre, apellido, cedula, edad, telefono } = nuevoCliente;
    if (nombre && apellido && cedula && edad && telefono) {
      try {
        await addDoc(collection(db, "clientes"), {
          nombre,
          apellido,
          cedula,
          edad: parseInt(edad),
          telefono,
        });
        setNuevoCliente({ nombre: "", apellido: "", cedula: "", edad: "", telefono: "" });
        Alert.alert("Éxito", "Cliente guardado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar cliente:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Cargar datos en modo edición
  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
      edad: String(cliente.edad),
      telefono: cliente.telefono,
    });
    setIdActualizar(cliente.id);
    setModoEdicion(true);
  };

  // Actualizar cliente existente
  const actualizarCliente = async () => {
    const { nombre, apellido, cedula, edad, telefono } = nuevoCliente;
    if (nombre && apellido && cedula && edad && telefono && idActualizar) {
      try {
        const clienteRef = doc(db, "clientes", idActualizar);
        await updateDoc(clienteRef, {
          nombre,
          apellido,
          cedula,
          edad: parseInt(edad),
          telefono,
        });
        setNuevoCliente({ nombre: "", apellido: "", cedula: "", edad: "", telefono: "" });
        setModoEdicion(false);
        setIdActualizar(null);
        Alert.alert("Éxito", "Cliente actualizado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
      />
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
        editarCliente={editarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2.5,
    padding: 20,
  },
});

export default Clientes;