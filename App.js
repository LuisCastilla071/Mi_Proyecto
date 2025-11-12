import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/database/firebaseconfig';
import Login from './src/components/Login';
import Productos from './src/views/Productos';
import insertarCiudades from './src/components/insertarCiudades';
import ConsultasFirestore from './src/views/ConsultasFirestore';
import ProductosRealtime from './src/views/ProductosRealtime';
import CalculadoraIMC from './src/views/CalculadoraIMC';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // 🔹 Insertar ciudades solo si la colección está vacía
    const cargarDatos = async () => {
      try {
        // Descomenta la línea siguiente para insertar ciudades la primera vez
        // await insertarCiudades();
      } catch (error) {
        console.error("❌ Error al cargar ciudades:", error);
      }
    };
    cargarDatos();

    // 🔹 Escucha los cambios en autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    // 🔹 Cleanup al desmontar
    return () => unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      console.log("✅ Sesión cerrada correctamente");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  if (!usuario) {
    // 🔹 Si no hay usuario autenticado, mostrar pantalla de login
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  return (
    <View style={{ flex: 1 }}>
    
    
            {/* 🔹 Consultas a Firestore */}
      <CalculadoraIMC /> 
    </View>
  );
}