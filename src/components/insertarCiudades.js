import { db } from "../database/firebaseconfig";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

const ciudades = [
  { nombre: "Ciudad de Guatemala", poblacion: 1000, pais: "Guatemala", region: "América Central" },
  { nombre: "Mixco", poblacion: 500, pais: "Guatemala", region: "América Central" },
  { nombre: "San Salvador", poblacion: 570, pais: "El Salvador", region: "América Central" },
  { nombre: "Santa Ana", poblacion: 250, pais: "El Salvador", region: "América Central" },
  { nombre: "Tegucigalpa", poblacion: 1100, pais: "Honduras", region: "América Central" },
  { nombre: "San Pedro Sula", poblacion: 800, pais: "Honduras", region: "América Central" },
  { nombre: "Managua", poblacion: 1000, pais: "Nicaragua", region: "América Central" },
  { nombre: "León", poblacion: 200, pais: "Nicaragua", region: "América Central" },
  { nombre: "San José", poblacion: 350, pais: "Costa Rica", region: "América Central" },
  { nombre: "Alajuela", poblacion: 250, pais: "Costa Rica", region: "América Central" }
];

export default async function insertarCiudades() {
  try {
    const ref = collection(db, "ciudades");
    const snapshot = await getDocs(ref);

    if (!snapshot.empty) {
      console.log("⚠️ La colección ya tiene datos, no se insertarán duplicados.");
      return;
    }

    const batch = writeBatch(db);

    ciudades.forEach((ciudad) => {
      const nuevoDoc = doc(ref);
      batch.set(nuevoDoc, ciudad);
    });

    await batch.commit();
    console.log("✅ Todas las ciudades se insertaron correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar ciudades:", error);
  }
}