import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioUsuarios from "../components/FormularioUsuarios.js";
import TablaUsuarios from "../components/TablaUsuarios.js";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    edad: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  // Cargar usuarios desde Firestore
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Manejar cambios en el formulario
  const manejoCambio = (campo, valor) => {
    setNuevoUsuario({ ...nuevoUsuario, [campo]: valor });
  };

  // Validar datos con Lambda
  const validarDatos = async (datos) => {
    try {
      const response = await fetch(
        "https://xzfm89k5nb.execute-api.us-east-1.amazonaws.com//validarusuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      const resultado = await response.json();

      if (resultado.success || resultado.datos_validados) {
        return resultado.data || resultado.datos_validados;
      }

      const erroresArray = resultado.errors || resultado.errores;
      const errores = Array.isArray(erroresArray)
        ? erroresArray.map((e) => (typeof e === "string" ? e : e.mensaje || JSON.stringify(e))).join("\n")
        : "Ocurrió un error en la validación de los datos.";

      Alert.alert("Errores en los datos", errores);
      return null;
    } catch (error) {
      Alert.alert("Error", "No se pudo validar la información con el servidor.");
      return null;
    }
  };

  const guardarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
    if (datosValidados) {
      try {
        await addDoc(collection(db, "usuarios"), {
          nombre: datosValidados.nombre,
          correo: datosValidados.correo,
          telefono: datosValidados.telefono,
          edad: parseInt(datosValidados.edad),
        });
        cargarDatos();
        setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
        Alert.alert("Éxito", "Usuario registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    }
  };

  const actualizarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "usuarios", usuarioId), {
          nombre: datosValidados.nombre,
          correo: datosValidados.correo,
          telefono: datosValidados.telefono,
          edad: parseInt(datosValidados.edad),
        });
        setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const editarUsuario = (usuario) => {
    setNuevoUsuario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      edad: String(usuario.edad),
    });
    setUsuarioId(usuario.id);
    setModoEdicion(true);
  };

  return (
    <View style={styles.container}>
      <FormularioUsuarios
        nuevoUsuario={nuevoUsuario}
        manejoCambio={manejoCambio}
        guardarUsuario={guardarUsuario}
        actualizarUsuario={actualizarUsuario}
        modoEdicion={modoEdicion}
      />
      <TablaUsuarios
        usuarios={usuarios}
        eliminarUsuario={eliminarUsuario}
        editarUsuario={editarUsuario}
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

export default Usuarios;