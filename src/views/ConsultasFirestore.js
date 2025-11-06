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

 // 2️⃣ Ciudades de Honduras con población > 700, ordenadas por población desc (compatible)
  const consultarCiudadesHonduras = async () => {
    try {
      // 🔹 No uses "orderBy('nombre')" junto con un rango en otro campo
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Honduras"),
        orderBy("poblacion", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("⚠️ No se encontraron ciudades en Honduras con población > 700");
        return;
      }

      console.log("🇭🇳 Ciudades de Honduras (población > 700):");
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.poblacion > 700) {
          console.log(`➡️ ${data.nombre}: ${data.poblacion}k hab.`);
        }
      });
    } catch (error) {
      console.error("❌ Error consultando ciudades de Honduras:", error);
    }
  };

  
  // 3. Las 2 ciudades salvadoreñas, ordenadas por población ascendente
  const consultarCiudadesElSalvador = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No se encontraron ciudades en El Salvador");
        return;
      }

      console.log("▶ Las 2 ciudades salvadoreñas más pequeñas:");
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id} | Nombre: ${doc.data().nombre} | Población: ${doc.data().poblacion}`);
      });
    } catch (error) {
      console.error("Error consultando ciudades de El Salvador:", error);
    }
  };

 // 4. Ciudades centroamericanas con población ≤ 300, ordenadas por país desc, limitadas a 4
const consultarCiudadesPequenas = async () => {
  try {
    const q = query(
      collection(db, "ciudades"),
      where("poblacion", "<=", 300),
      orderBy("poblacion", "asc"),   // 🔹 primero el campo del filtro de rango
      orderBy("pais", "desc"),       // 🔹 luego el segundo campo para el orden
      limit(4)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No se encontraron ciudades con población <= 300");
      return;
    }

    console.log("▶ Ciudades con población <= 300:");
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(
        `ID: ${doc.id} | Nombre: ${data.nombre} | Población: ${data.poblacion} | País: ${data.pais}`
      );
    });
  } catch (error) {
    console.error("❌ Error consultando ciudades pequeñas:", error);
  }
};


// 5️⃣ Las 3 ciudades con población > 900, ordenadas por nombre
const consultarCiudades900k = async () => {
  try {
    const q = query(
      collection(db, "ciudades"),
      where("poblacion", ">", 900),
      orderBy("poblacion", "asc"),  // 🔹 primero el campo del rango
      orderBy("nombre", "asc"),     // 🔹 luego el segundo campo
      limit(3)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("⚠️ No se encontraron ciudades con población > 900");
      return;
    }

    console.log("▶ Ciudades con población > 900:");
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Nombre: ${data.nombre} | Población: ${data.poblacion} | País: ${data.pais}`);
    });
  } catch (error) {
    console.error("❌ Error consultando ciudades >900:", error);
  }
};

// 7. Ciudades con población entre 200 y 600, ordenadas por país asc, limitadas a 5
  const consultarCiudadesIntermedias = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">=", 200),
        where("poblacion", "<=", 600),
        orderBy("pais", "asc"),
        limit(5)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No se encontraron ciudades entre 200 y 600");
        return;
      }

      console.log("▶ Ciudades con población entre 200 y 600:");
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id} | Nombre: ${doc.data().nombre} | Población: ${doc.data().poblacion} | País: ${doc.data().pais}`);
      });
    } catch (error) {
      console.error("Error consultando ciudades intermedias:", error);
    }
  };

  // 8. Las 5 ciudades con mayor población, ordenadas por región descendente
  const consultarCiudadesPorRegion = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        orderBy("poblacion", "desc"),
        orderBy("region", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No se encontraron ciudades para el top por región");
        return;
      }

      console.log("▶ Top 5 ciudades por población y región:");
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id} | Nombre: ${doc.data().nombre} | Población: ${doc.data().poblacion} | Región: ${doc.data().region}`);
      });
    } catch (error) {
      console.error("Error consultando ciudades por región:", error);
    }
  };


  // 🔹 Ejecutar consultas al montar el componente
  useEffect(() => {
    (async () => {
      await consultarCiudadesGuatemalaTop();
      await consultarCiudadesHonduras();
      await consultarCiudadesElSalvador();
      await consultarCiudadesPequenas();
      await consultarCiudades900k();
      await consultarCiudadesIntermedias();
      await consultarCiudadesPorRegion();
    })();
  }, []);

  return (
    <ScrollView>
      <Text>ConsultasFirestore</Text>
    </ScrollView>
  );
}
