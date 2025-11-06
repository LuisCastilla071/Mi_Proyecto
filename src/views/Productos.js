import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";

// Asegúrate de que db se exporte correctamente y que el usuario esté logueado
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";

// Componentes (asumo que existen)
import FormularioProductos from "../components/FormularioProductos.js";
import TablaProductos from "../components/TablaProductos.js";

// Importaciones de Expo (asegúrate de que uses las versiones correctas)
// Usar la versión estándar sin /legacy
import * as FileSystem from "expo-file-system/legacy"; 
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

    const exportarDatosColeccion = async () => {
        try {
            const datos = await cargarDatosFirebaseColeccion("productos");
            console.log("Datos cargados:", datos);

            if (!datos) {
                Alert.alert(
                    "Error de Exportación",
                    "No se pudieron cargar los datos. Revisa la consola: puede ser un error de permisos (reglas) o de conexión."
                );
                return;
            }

            const jsonString = JSON.stringify(datos, null, 2);
            const baseFileName = "datos_firebase.txt";

            await Clipboard.setStringAsync(jsonString);
            console.log("Datos (JSON) copiados al portapapeles.");

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Error", "La función Compartir/Guardar no está disponible en tu dispositivo");
                return;
            }

            const fileUri = FileSystem.cacheDirectory + baseFileName;
            await FileSystem.writeAsStringAsync(fileUri, jsonString);

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

    const exportarDatos = async () => {
        try {
            const datos = await cargarDatosFirebase();
            console.log("Datos cargados:", datos);

            if (!datos) {
                Alert.alert(
                    "Error de Exportación",
                    "No se pudieron cargar los datos. Revisa la consola: el usuario debe estar logueado y/o faltan reglas de seguridad."
                );
                return;
            }

            const jsonString = JSON.stringify(datos, null, 2);
            const baseFileName = "datos_firebase.txt";

            await Clipboard.setStringAsync(jsonString);
            console.log("Datos (JSON) copiados al portapapeles.");

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Error", "La función Compartir/Guardar no está disponible en tu dispositivo");
                return;
            }

            const fileUri = FileSystem.cacheDirectory + baseFileName;
            await FileSystem.writeAsStringAsync(fileUri, jsonString);

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

    const cargarDatosFirebaseColeccion = async (coleccionNombre) => {
        if (!coleccionNombre || typeof coleccionNombre !== 'string') {
            console.error("Error: Se requiere un nombre de colección válido.");
            return null;
        }

        try {
            const datosExportados = {};
            const snapshot = await getDocs(collection(db, coleccionNombre));

            datosExportados[coleccionNombre] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return datosExportados;
        } catch (error) {
            console.error(`Error extrayendo datos de la colección ${coleccionNombre}:`, error);
            return null;
        }
    };

    const cargarDatosFirebase = async () => {
        try {
            const datosExportados = {};

            for (const col of colecciones) {
                const snapshot = await getDocs(collection(db, col));
                datosExportados[col] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            }

            return datosExportados;
        } catch (error) {
            console.error("Error extrayendo datos (Exportación):", error);
            return null;
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const manejoCambio = (campo, valor) => {
        setNuevoProducto({ ...nuevoProducto, [campo]: valor });
    };

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

    const eliminarProducto = async (id) => {
        try {
            await deleteDoc(doc(db, "productos", id));
            cargarDatos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const editarProducto = (producto) => {
        setNuevoProducto({ nombre: producto.nombre, precio: String(producto.precio) });
        setIdActualizar(producto.id);
        setModoEdicion(true);
    };

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


    // ✅ FUNCIÓN DE CONVERSIÓN CORREGIDA: 'binary' ahora es una variable 'let'
    const arrayBufferToBase64 = (buffer) => {
        let binary = ''; // <-- CORRECCIÓN CLAVE: Usar 'let' en lugar de 'const'
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // NOTA: btoa() puede fallar en algunos entornos; si falla, podrías 
        // necesitar usar la librería 'base-64' de React Native.
        return btoa(binary);
    };

    
    // 🚀 FUNCIÓN DE EXCEL FINALIZADA
    const generarExcel = async () => {
        try {
            // 1. OBTENER DATOS DE FIREBASE (Reutiliza la lógica de carga de colecciones)
            const datosColeccion = await cargarDatosFirebaseColeccion("productos"); 
            const productosDeFirebase = datosColeccion?.productos || [];

            // Mapeo: Asegúrate de que los datos tengan las propiedades que espera tu Lambda
            const datosParaExcel = productosDeFirebase.map(p => ({
                nombre: p.nombre,
                categoria: p.categoria || 'Sin Categoría', 
                precio: p.precio,
            }));
            
            if (datosParaExcel.length === 0) {
                Alert.alert("Advertencia", "No hay productos para exportar a Excel.");
                return;
            }

            // 2. LLAMADA A LA API DE LAMBDA (URL Corregida)
            const response = await fetch('https://gzl41lf0z4.execute-api.us-east-1.amazonaws.com/generarexcel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ datos: datosParaExcel }) 
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Respuesta de error de Lambda:", errorBody);
                throw new Error(`Error HTTP: ${response.status}. Detalle: ${errorBody.substring(0, 100)}...`);
            }

            // 3. PROCESAMIENTO DEL BUFFER (Revertimos a ArrayBuffer para mejor compatibilidad con FileSystem)
            const arrayBuffer = await response.arrayBuffer();
            const base64 = arrayBufferToBase64(arrayBuffer); // <-- Usamos la función corregida

            // 4. ESCRITURA Y COMPARTICIÓN
            // ✅ CORRECCIÓN: Usar cacheDirectory para archivos temporales que se van a compartir
            const fileUri = FileSystem.cacheDirectory + "reporte_productos.xlsx";

            // Escribir el Base64 en el sistema de archivos
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64 // <- Clave para que el SO reconozca el archivo
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Descargar Reporte Excel de Productos',
                });
                Alert.alert("Éxito", "Reporte Excel generado y listo para compartir.");
            } else {
                Alert.alert("Error", "La función Compartir no está disponible en tu dispositivo.");
            }

        } catch (error) {
            console.error("Error generando Excel:", error);
            Alert.alert("Error", "Hubo un problema al generar el Excel: " + error.message);
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
            <View style={{ marginVertical: 10 }}>
                <Button title="Exportar Colecciones" onPress={exportarDatos} />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button title="Exportar Datos Productos" onPress={exportarDatosColeccion} />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Button title="Exportar Excel" onPress={generarExcel} />
            </View>
            <TablaProductos
                productos={productos}
                eliminarProducto={eliminarProducto}
                editarProducto={editarProducto}
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

export default Productos;