import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";

// Asegúrate de que db se exporte correctamente y que el usuario esté logueado
import { db } from "../database/firebaseconfig.js"; 
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";

// Componentes (asumo que existen)
import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js";

// Importaciones de Expo (asegúrate de que uses las versiones correctas)
import * as FileSystem from "expo-file-system/legacy"; // Usar la versión estándar
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";


const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActualizar, setIdActualizar] = useState(null);
  
  // Array de colecciones que se exportarán.
  const colecciones = ["productos", "usuarios", "edades", "ciudades"]; 

  // Cargar productos (función principal de la pantalla)
  const cargarDatos = async () => {
    try {
      // Nota: Esta función solo carga "productos"
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos en pantalla:", error);
    }
  };

  // FUNCIÓN CORREGIDA: Carga datos de MÚLTIPLES colecciones para la exportación
  const cargarDatosFirebase = async () => {
    try {
      const datosExportados = {};

      for (const col of colecciones) {
        // Asegúrate de que el nombre de la colección coincida exactamente (minúsculas/mayúsculas)
        const snapshot = await getDocs(collection(db, col)); 
        datosExportados[col] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return datosExportados;
    } catch (error) {
      console.error("Error extrayendo datos (Exportación):", error);
      // 🚩 SOLUCIÓN CLAVE: Devolver null para manejar el error en la función que llama
      return null; 
    }
  };

  // FUNCIÓN CORREGIDA: Exporta, copia y comparte
  const exportarDatos = async () => {
    try {
      // 🚩 SOLUCIÓN CLAVE: NO pasar "productos" como argumento
      const datos = await cargarDatosFirebase(); 
      console.log("Datos cargados:", datos);
      
      // Manejo del error de permisos / undefined
      if (!datos) {
        Alert.alert(
            "Error de Exportación", 
            "No se pudieron cargar los datos. Revisa la consola: el usuario debe estar logueado y/o faltan reglas de seguridad."
        );
        return; 
      }

      // Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase.txt";

      // Copiar datos al portapapeles
      await Clipboard.setStringAsync(jsonString);
      console.log("Datos (JSON) copiados al portapapeles.");

      // Verificar si la función de compartir está disponible
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "La función Compartir/Guardar no está disponible en tu dispositivo");
        return;
      }

      // Guardar el archivo temporalmente
      const fileUri = FileSystem.cacheDirectory + baseFileName;

      // Escribir el contenido JSON en el caché temporal
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Abrir el diálogo de compartir
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartir datos de Firebase (JSON)'
      });

      Alert.alert("Éxito", "Datos copiados al portapapeles y listos para compartir.");

    } catch (error) {
      console.error("Error al exportar y compartir:", error);
      Alert.alert("Error al exportar o compartir", "Ha ocurrido un error inesperado: " + error.message);
    }
  };
  
  // ... (El resto de tus funciones como useEffect, manejoCambio, guardarProducto, eliminarProducto, editarProducto, actualizarProducto se mantienen igual) ...

  useEffect(() => {
    cargarDatos();
  }, []);

  // ... (Manejo de estados y lógica de CRUD) ...
  
  // Manejar cambios en el formulario
  const manejoCambio = (campo, valor) => {
    setNuevoProducto({ ...nuevoProducto, [campo]: valor });
  };

  // Guardar producto nuevo
  const guardarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio) {
      try {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        Alert.alert("Éxito", "Producto guardado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar producto:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };


  // Cargar datos en modo edición
  const editarProducto = (producto) => {
    setNuevoProducto({ nombre: producto.nombre, precio: String(producto.precio) });
    setIdActualizar(producto.id);
    setModoEdicion(true);
  };

  // Actualizar producto existente
  const actualizarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio && idActualizar) {
      try {
        const productoRef = doc(db, "productos", idActualizar);
        await updateDoc(productoRef, {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false);
        setIdActualizar(null);
        Alert.alert("Éxito", "Producto actualizado correctamente");
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      Alert.alert("Error", "Por favor complete todos los campos.");
    }
  };


  return (
    <View style={styles.container}>

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />
      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar" onPress={exportarDatos} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2.5,
    padding: 20,
  },
});

export default Productos;