import React, { useState, useEffect, useCallback, useRef } from "react";
import { db as firestore } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs } from "firebase/firestore";

// ════════════════════════════════════════════
// DATOS INICIALES
// ════════════════════════════════════════════
const SEED_USERS = [
  { id:"admin", name:"Carlos Andrés Cano", username:"carlos.canog", password:"1187cacg", role:"admin", balance:99999, avatar:"👨‍🏫", joinDate:"2025-01-01", totalEarned:0 },
  { id:"admin2", name:"Juan Carlos Presiga", username:"juan.presiga", password:"cosmo2026", role:"admin", balance:99999, avatar:"👩‍🏫", joinDate:"2025-01-01", totalEarned:0 },
  { id:"u1", name:"Amelia Preciado Gutiérrez", username:"Amelia.Preciado", password:"cosmo2026", role:"student", balance:50, avatar:"🌟", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u2", name:"Ana Sofía Vélez Giraldo", username:"Ana.Velez", password:"cosmo2026", role:"student", balance:50, avatar:"🚀", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u3", name:"Clara Isabel Jaramillo Arbelaez", username:"Clara.Jaramillo", password:"cosmo2026", role:"student", balance:50, avatar:"🌙", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u4", name:"Emiliano Gallego Agudelo", username:"Emiliano.Gallego", password:"cosmo2026", role:"student", balance:50, avatar:"⭐", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u5", name:"Emiliano Medina Vivares", username:"Emiliano.Medina", password:"cosmo2026", role:"student", balance:50, avatar:"🌈", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u6", name:"Emily Arango Echeverry", username:"Emily.Arango", password:"cosmo2026", role:"student", balance:50, avatar:"💫", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u7", name:"Jacobo Montoya Zuluaga", username:"Jacobo.Montoya", password:"cosmo2026", role:"student", balance:50, avatar:"🎯", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u8", name:"Jerónimo Idarraga Arboleda", username:"Jeronimo.Idarraga", password:"cosmo2026", role:"student", balance:50, avatar:"🔮", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u9", name:"Juan Diego Restrepo Molina", username:"Juan.Restrepo", password:"cosmo2026", role:"student", balance:50, avatar:"🌸", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u10", name:"Juan Pablo Mendoza Castrillón", username:"Juan.Mendoza", password:"cosmo2026", role:"student", balance:50, avatar:"🦋", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u11", name:"Juana Pulgarín Álvarez", username:"Juana.Pulgarin", password:"cosmo2026", role:"student", balance:50, avatar:"🎨", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u12", name:"Juliana García Parra", username:"Juliana.Garcia", password:"cosmo2026", role:"student", balance:50, avatar:"🏆", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u13", name:"Laura Sofía Barón Moreno", username:"Laura.Baron", password:"cosmo2026", role:"student", balance:50, avatar:"🌺", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u14", name:"Manuel Marín Vélez", username:"Manuel.Marin", password:"cosmo2026", role:"student", balance:50, avatar:"🎭", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u15", name:"Mariana Rozo Manco", username:"Mariana.Rozo", password:"cosmo2026", role:"student", balance:50, avatar:"🦄", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u16", name:"Mariangel Navarro Arroyave", username:"Mariangel.Navarro", password:"cosmo2026", role:"student", balance:50, avatar:"🌻", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u17", name:"Mateo Álvarez Hoyos", username:"Mateo.Alvarez", password:"cosmo2026", role:"student", balance:50, avatar:"🎪", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u18", name:"Matías Bustamante Tabares", username:"Matias.Bustamante", password:"cosmo2026", role:"student", balance:50, avatar:"🦅", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u19", name:"Matías Soto Castro", username:"Matias.Soto", password:"cosmo2026", role:"student", balance:50, avatar:"🌊", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u20", name:"Samuel Flórez Quintero", username:"Samuel.Florez", password:"cosmo2026", role:"student", balance:50, avatar:"🎸", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u21", name:"Samuel Henao Valencia", username:"Samuel.Henao", password:"cosmo2026", role:"student", balance:50, avatar:"🎵", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u22", name:"Sebastián Orrego Palermo", username:"Sebastian.Orrego", password:"cosmo2026", role:"student", balance:50, avatar:"🌴", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u23", name:"Tomás Guerrero Murcia", username:"Tomas.Murcia", password:"cosmo2026", role:"student", balance:50, avatar:"🎀", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u24", name:"Valeria Molina Zapata", username:"Valeria.Molina", password:"cosmo2026", role:"student", balance:50, avatar:"🦁", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u27", name:"Ailyn Mira Pérez", username:"Ailyn.Mira", password:"cosmo2026", role:"student", balance:50, avatar:"🎠", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u28", name:"Ana Lucía Cárdenas Arias", username:"Ana.Lucia", password:"cosmo2026", role:"student", balance:50, avatar:"🦋", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u29", name:"Ángel David Santa Pareja", username:"Angel.David", password:"cosmo2026", role:"student", balance:50, avatar:"🌛", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u30", name:"Danna Sanmartín Muñoz", username:"Danna.Munoz", password:"cosmo2026", role:"student", balance:50, avatar:"🎡", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u31", name:"Dylan Guerra Torres", username:"Dylan.Guerra", password:"cosmo2026", role:"student", balance:50, avatar:"🎢", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u32", name:"Emmanuel Flórez Aguirre", username:"Emmanuel.Florez", password:"cosmo2026", role:"student", balance:50, avatar:"🌟", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u33", name:"Guadalupe Álvarez Delgado", username:"Guadalupe.Alvarez", password:"cosmo2026", role:"student", balance:50, avatar:"🚀", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u34", name:"Jacobo Arboleda Ochoa", username:"Jacobo.Arboleda", password:"cosmo2026", role:"student", balance:50, avatar:"🌙", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u35", name:"Juan José Quintana Tamayo", username:"Juan.Quintana", password:"cosmo2026", role:"student", balance:50, avatar:"⭐", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u36", name:"Juan Nicolás Arenas Arias", username:"Juan.Arenas", password:"cosmo2026", role:"student", balance:50, avatar:"🌈", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u37", name:"Julieta Ceballos Ortiz", username:"Julieta.Ceballos", password:"cosmo2026", role:"student", balance:50, avatar:"💫", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u38", name:"Luis Alfonso De Morais Palacios", username:"Luis.Alfonso", password:"cosmo2026", role:"student", balance:50, avatar:"🎯", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u39", name:"Maríangel Atehortúa Arias", username:"Mariangel.Atehortua", password:"cosmo2026", role:"student", balance:50, avatar:"🔮", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u40", name:"Mathew Alejandro Galarza Gallego", username:"Mathew.Galarza", password:"cosmo2026", role:"student", balance:50, avatar:"🌸", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u41", name:"Mathias Gómez García", username:"Mathias.Gomez", password:"cosmo2026", role:"student", balance:50, avatar:"🦋", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u42", name:"Nicolás Osorio Monsalve", username:"Nicolas.Osorio", password:"cosmo2026", role:"student", balance:50, avatar:"🎨", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u43", name:"Samantha Arias Mayorga", username:"Samantha.Arias", password:"cosmo2026", role:"student", balance:50, avatar:"🏆", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u44", name:"Samuel Pantoja Gordillo", username:"Samuel.Pantoja", password:"cosmo2026", role:"student", balance:50, avatar:"🌺", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u45", name:"Samuel David Roa Patarroyo", username:"Samuel.Roa", password:"cosmo2026", role:"student", balance:50, avatar:"🎭", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u46", name:"Susana Ramírez Arboleda", username:"Susana.Ramirez", password:"cosmo2026", role:"student", balance:50, avatar:"🦄", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u47", name:"Tiffany Sánchez Otalvaro", username:"Tiffany.Sanchez", password:"cosmo2026", role:"student", balance:50, avatar:"🌻", joinDate:"2025-01-01", totalEarned:50 },
  { id:"u48", name:"Santiago Vélez Grisales", username:"Santiago.velez", password:"cosmo2026", role:"student", balance:50, avatar:"🎪", joinDate:"2025-01-01", totalEarned:50 },
];

const SEED_STORE = [
  { id:"s1",  name:"Salida al Bano",           desc:"Permiso de salida rapida sin afectar tu record de permanencia en clase.",                                         price:10,  cat:"Nivel 1 - Basico",    icon:"🚻", stock:99 },
  { id:"s2",  name:"Cambio de Puesto",          desc:"Derecho a elegir un lugar diferente por una sesion, siempre que no interfiera con el aprendizaje.",              price:20,  cat:"Nivel 1 - Basico",    icon:"💺", stock:99 },
  { id:"s3",  name:"DJ de la Tribu",            desc:"Elige la musica ambiental apta para el colegio durante el trabajo autonomo de la clase.",                        price:30,  cat:"Nivel 1 - Basico",    icon:"🎵", stock:99 },
  { id:"s4",  name:"Silla del Mentor",          desc:"Derecho a usar la silla especial de honor del mentor durante la sesion.",                                        price:35,  cat:"Nivel 1 - Basico",    icon:"🪑", stock:99 },
  { id:"s5",  name:"Pase de Cero Filas",        desc:"Ser el primero en salir al descanso o a la fila del refrigerio o transporte.",                                  price:50,  cat:"Nivel 1 - Basico",    icon:"🏃", stock:99 },
  { id:"s6",  name:"10% Extra en una Nota",     desc:"Suma una decima a la calificacion final de un taller o actividad especifica.",                                   price:100, cat:"Nivel 2 - Medio",     icon:"📝", stock:99 },
  { id:"s7",  name:"Solucion a un Ejercicio",   desc:"El mentor resuelve o da la respuesta de un punto dificil de un taller en el tablero.",                          price:120, cat:"Nivel 2 - Medio",     icon:"💡", stock:99 },
  { id:"s8",  name:"Tiempo Libre 5 min",        desc:"Retirate a descansar o realizar una actividad libre 5 minutos antes de que termine la clase.",                  price:150, cat:"Nivel 2 - Medio",     icon:"⏰", stock:99 },
  { id:"s9",  name:"Bono de Consulta",          desc:"Derecho a una pista o guia personalizada del mentor durante un examen o trabajo individual.",                   price:200, cat:"Nivel 2 - Medio",     icon:"🔍", stock:99 },
  { id:"s10", name:"Lider de Dinamica",         desc:"Propone y dirige un juego o rompehielos de 5 minutos para iniciar la clase.",                                   price:250, cat:"Nivel 2 - Medio",     icon:"🎯", stock:99 },
  { id:"s11", name:"Prorroga de Entrega 24h",   desc:"Derecho a entregar un trabajo un dia despues de la fecha limite sin penalizacion por impuntualidad.",           price:500, cat:"Nivel 3 - Alto",      icon:"📅", stock:99 },
  { id:"s12", name:"Segunda Oportunidad",       desc:"Corrige una actividad con nota baja para subir la calificacion (maximo hasta 4.0).",                            price:600, cat:"Nivel 3 - Alto",      icon:"🔄", stock:99 },
  { id:"s13", name:"Inmunidad al Reloj",        desc:"Permiso para llegar hasta 5 minutos tarde a una sesion sin registro de retraso. Uso unico.",                    price:700, cat:"Nivel 3 - Alto",      icon:"⌚", stock:99 },
  { id:"s14", name:"Monitor Oficial",           desc:"Asume el rol de asistente del mentor durante todo el dia con estatus y responsabilidades especiales.",           price:800, cat:"Nivel 3 - Alto",      icon:"🏅", stock:99 },
  { id:"s15", name:"Exencion de Punto",         desc:"Saltate un punto o ejercicio de una evaluacion o taller largo. Se califica como correcto.",                     price:1000,cat:"Nivel 3 - Alto",      icon:"⭐", stock:99 },
  { id:"s16", name:"Clase Expandida",           desc:"Reto colectivo! Entre todos trasladan la sesion a un espacio abierto: canchas, jardin o biblioteca.",           price:2000,cat:"Nivel 4 - Colectivo", icon:"🌳", stock:99 },
  { id:"s17", name:"Cine-Foro de Proyecto",     desc:"Reto colectivo! Cambien una sesion de teoria por un documental o pelicula relacionada con los temas de clase.", price:3000,cat:"Nivel 4 - Colectivo", icon:"🎬", stock:99 },
];

const SEED_TXS = [
  { id:"t1", from:"admin", to:"u1", amount:150, type:"reward", desc:"Premio por excelencia académica ⭐", date:"2024-01-18T11:00:00" },
  { id:"t2", from:"admin", to:"u2", amount:80, type:"reward", desc:"Buena participación en clase", date:"2024-01-17T09:00:00" },
  { id:"t3", from:"u2", to:"u1", amount:50, type:"transfer", desc:"Gracias por la ayuda 😊", date:"2024-01-16T14:30:00" },
  { id:"t4", from:"admin", to:"u4", amount:320, type:"reward", desc:"Premio acumulado por logros ✨", date:"2024-01-15T10:00:00" },
  { id:"t5", from:"admin", to:"u5", amount:65, type:"reward", desc:"Proyecto de ciencias sobresaliente", date:"2024-01-15T10:00:00" },
  { id:"t6", from:"u1", to:"u3", amount:50, type:"transfer", desc:"Prestado 💜", date:"2024-01-14T15:00:00" },
];

// ════════════════════════════════════════════
// STORAGE
// ════════════════════════════════════════════
const db = {
  async get(k) {
    try {
      const ref = doc(firestore, "cosmobank", k);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data().value : null;
    } catch { return null; }
  },
  async set(k, v) {
    try {
      const ref = doc(firestore, "cosmobank", k);
      await setDoc(ref, { value: v });
    } catch(e) { console.error("Firebase set error:", e); }
  }
};

// ════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════
const fmtDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("es-ES", { day:"2-digit", month:"short" }) + " · " +
    dt.toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
};
const genId = (prefix) => prefix + Date.now() + Math.random().toString(36).substr(2,4);

// ════════════════════════════════════════════
// CSS
// ════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #12001A;
  --bg2: #1C0028;
  --card: rgba(255,255,255,0.06);
  --card-border: rgba(232,24,125,0.2);
  --gold: #E8187D;
  --gold2: #B5105E;
  --cyan: #FF5BAD;
  --pink: #E8187D;
  --green: #00E5A0;
  --red: #FF4D6D;
  --text: #FFFFFF;
  --text2: rgba(255,255,255,0.6);
  --text3: rgba(255,255,255,0.35);
  --radius: 20px;
  --radius-sm: 12px;
}

body { background: var(--bg); color: var(--text); font-family: 'Poppins', sans-serif; overflow-x: hidden; }

.cosmos-root {
  min-height: 100vh;
  background: radial-gradient(ellipse at 20% 50%, rgba(232,24,125,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(180,0,100,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 90%, rgba(232,24,125,0.05) 0%, transparent 50%),
              var(--bg);
  position: relative;
}

.stars {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0; overflow: hidden;
}
.star {
  position: absolute; background: white; border-radius: 50%;
  animation: twinkle var(--dur) ease-in-out infinite;
}
@keyframes twinkle {
  0%,100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

.app-shell {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* TOP BAR */
.topbar {
  padding: 16px 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(18,0,26,0.97) 0%, transparent 100%);
  position: sticky; top: 0; z-index: 100;
}
.topbar-logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  font-size: 18px;
  background: linear-gradient(135deg, #E8187D, #FF5BAD);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}
.topbar-user { display: flex; align-items: center; gap: 8px; }
.topbar-avatar { font-size: 22px; width:38px; height:38px; background:var(--card); border:1px solid var(--card-border); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
.topbar-avatar:hover { transform: scale(1.1); border-color: var(--gold); }

/* SCROLL CONTENT */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 90px;
  scrollbar-width: none;
}
.scroll-content::-webkit-scrollbar { display: none; }

/* BOTTOM NAV */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px;
  background: rgba(18,0,26,0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--card-border);
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  display: flex; justify-content: space-around;
  z-index: 100;
}
.nav-btn {
  background: none; border: none; color: var(--text3);
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  cursor: pointer; padding: 6px 12px; border-radius: 12px;
  transition: all .2s; font-family: 'Poppins', sans-serif; font-size: 10px;
}
.nav-btn.active { color: var(--gold); }
.nav-btn.active .nav-icon { background: rgba(232,24,125,0.15); }
.nav-icon { font-size: 20px; width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; transition: all .2s; }
.nav-btn:hover .nav-icon { background: rgba(255,255,255,0.08); }

/* CARD */
.card {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  backdrop-filter: blur(10px);
  padding: 20px;
}
.card-sm { padding: 14px 16px; border-radius: var(--radius-sm); }

/* BALANCE CARD */
.balance-card {
  background: linear-gradient(135deg, #2A0018 0%, #1C0028 50%, #12001A 100%);
  border: 1px solid rgba(232,24,125,0.3);
  border-radius: 24px;
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
  margin: 12px 16px;
}
.balance-card::before {
  content: '';
  position: absolute; top: -50px; right: -50px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(232,24,125,0.15) 0%, transparent 70%);
  border-radius: 50%;
}
.balance-card::after {
  content: '◎';
  position: absolute; bottom: -20px; right: 20px;
  font-size: 120px; color: rgba(232,24,125,0.04);
  font-family: 'Poppins', sans-serif;
}
.balance-label { font-size: 12px; color: rgba(255,215,0,0.7); letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
.balance-amount { font-family: 'Poppins', sans-serif; font-size: 42px; font-weight: 900; color: var(--gold); margin: 8px 0; letter-spacing: -1px; }
.balance-coin { font-size: 14px; color: var(--text2); font-weight: 600; }
.balance-user { font-size: 16px; font-weight: 700; margin-bottom: 4px; }

/* QUICK ACTIONS */
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 0 16px; margin: 16px 0; }
.qa-btn {
  background: var(--card); border: 1px solid var(--card-border);
  border-radius: 16px; padding: 14px 8px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  transition: all .2s; color: var(--text);
  font-family: 'Poppins', sans-serif;
}
.qa-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); border-color: var(--gold); }
.qa-icon { font-size: 24px; }
.qa-label { font-size: 11px; font-weight: 700; color: var(--text2); text-align: center; }

/* SECTION HEADER */
.section-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: 800; }
.section-link { font-size: 13px; color: var(--cyan); font-weight: 700; cursor: pointer; }

/* TRANSACTION ITEM */
.tx-list { display: flex; flex-direction: column; gap: 8px; padding: 0 16px; }
.tx-item {
  display: flex; align-items: center; gap: 12px;
  background: var(--card); border: 1px solid var(--card-border);
  border-radius: var(--radius-sm); padding: 12px 14px;
}
.tx-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.tx-icon.in { background: rgba(0,229,160,0.15); }
.tx-icon.out { background: rgba(255,77,109,0.15); }
.tx-icon.loan { background: rgba(232,24,125,0.15); }
.tx-icon.purchase { background: rgba(232,24,125,0.15); }
.tx-info { flex: 1; min-width: 0; }
.tx-desc { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-date { font-size: 11px; color: var(--text3); margin-top: 2px; }
.tx-amount { font-size: 16px; font-weight: 800; font-family: 'Poppins', sans-serif; }
.tx-amount.in { color: var(--green); }
.tx-amount.out { color: var(--red); }

/* FORM */
.form-group { margin-bottom: 16px; }
.form-label { font-size: 13px; font-weight: 700; color: var(--text2); margin-bottom: 8px; display: block; letter-spacing: 0.5px; text-transform: uppercase; }
.form-input {
  width: 100%; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm); padding: 14px 16px;
  color: var(--text); font-size: 15px; font-family: 'Poppins', sans-serif;
  transition: all .2s; outline: none;
}
.form-input:focus { border-color: var(--gold); background: rgba(232,24,125,0.05); }
.form-input::placeholder { color: var(--text3); }
.form-select { appearance: none; cursor: pointer; }

/* BUTTON */
.btn {
  width: 100%; padding: 16px; border-radius: var(--radius-sm);
  font-size: 16px; font-weight: 800; cursor: pointer; border: none;
  font-family: 'Poppins', sans-serif; transition: all .2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-gold {
  background: linear-gradient(135deg, #E8187D, #B5105E);
  color: #000; box-shadow: 0 4px 20px rgba(232,24,125,0.3);
}
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(232,24,125,0.5); }
.btn-gold:active { transform: translateY(0); }
.btn-outline {
  background: transparent; border: 2px solid var(--gold);
  color: var(--gold);
}
.btn-outline:hover { background: rgba(232,24,125,0.1); }
.btn-cyan { background: linear-gradient(135deg, #FF5BAD, #E8187D); color: #000; }
.btn-green { background: linear-gradient(135deg, var(--green), #00B377); color: #000; }
.btn-red { background: linear-gradient(135deg, var(--red), #CC0033); color: #fff; }
.btn-sm { padding: 8px 16px; font-size: 13px; width: auto; border-radius: 8px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

/* LOGIN */
.login-screen {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 24px;
  position: relative; z-index: 1;
}
.login-logo { font-family: 'Poppins', sans-serif; font-weight: 900; font-size: 32px; background: linear-gradient(135deg, #E8187D, #FF5BAD); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; letter-spacing: 3px; }
.login-subtitle { font-size: 13px; color: var(--text2); margin-bottom: 40px; text-align: center; letter-spacing: 1px; }
.login-card { background: rgba(28,0,40,0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 32px 28px; width: 100%; max-width: 380px; backdrop-filter: blur(20px); }
.login-tabs { display: flex; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 4px; margin-bottom: 28px; }
.login-tab { flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 700; border-radius: 10px; cursor: pointer; transition: all .2s; color: var(--text2); }
.login-tab.active { background: linear-gradient(135deg, #E8187D, #B5105E); color: #000; }

/* STORE */
.store-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px; }
.store-item {
  background: var(--card); border: 1px solid var(--card-border);
  border-radius: var(--radius); padding: 16px; cursor: pointer;
  transition: all .2s; position: relative; overflow: hidden;
}
.store-item:hover { transform: translateY(-3px); border-color: var(--gold); box-shadow: 0 8px 24px rgba(232,24,125,0.1); }
.store-item-icon { font-size: 36px; margin-bottom: 10px; display: block; }
.store-item-name { font-size: 13px; font-weight: 800; margin-bottom: 4px; }
.store-item-desc { font-size: 11px; color: var(--text2); margin-bottom: 12px; line-height: 1.4; }
.store-item-price { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; color: var(--gold); }
.store-cat-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: rgba(255,255,255,0.08); color: var(--text2); display: inline-block; margin-bottom: 8px; }
.stock-low { position: absolute; top: 10px; right: 10px; background: var(--red); color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

/* FILTER TABS */
.filter-tabs { display: flex; gap: 8px; padding: 0 16px; overflow-x: auto; scrollbar-width: none; margin-bottom: 16px; }
.filter-tabs::-webkit-scrollbar { display: none; }
.filter-tab { white-space: nowrap; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: all .2s; color: var(--text2); background: var(--card); border-color: var(--card-border); }
.filter-tab.active { background: rgba(232,24,125,0.15); border-color: var(--gold); color: var(--gold); }

/* LOAN CARD */
.loan-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 10px; }
.loan-status { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: inline-block; }
.loan-status.pending { background: rgba(255,165,0,0.2); color: var(--gold2); }
.loan-status.approved { background: rgba(0,229,160,0.2); color: var(--green); }
.loan-status.rejected { background: rgba(255,77,109,0.2); color: var(--red); }
.loan-status.paid { background: rgba(255,255,255,0.1); color: var(--text2); }

/* LEADERBOARD */
.rank-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; margin-bottom: 8px; border-radius: var(--radius-sm); background: var(--card); border: 1px solid var(--card-border); transition: all .2s; }
.rank-item.mine { background: rgba(232,24,125,0.08); border-color: rgba(232,24,125,0.3); }
.rank-num { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 900; width: 28px; text-align: center; }
.rank-1 .rank-num { color: #E8187D; }
.rank-2 .rank-num { color: #C0C0C0; }
.rank-3 .rank-num { color: #CD7F32; }
.rank-avatar { font-size: 24px; }
.rank-info { flex: 1; }
.rank-name { font-size: 14px; font-weight: 800; }
.rank-sub { font-size: 12px; color: var(--text2); }
.rank-balance { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; color: var(--gold); }

/* ADMIN */
.admin-student-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-sm); margin-bottom: 8px; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn .2s; }
.modal-sheet { background: var(--bg2); border-radius: 28px 28px 0 0; border: 1px solid var(--card-border); border-bottom: none; padding: 24px; width: 100%; max-width: 430px; animation: slideUp .3s cubic-bezier(0.34,1.56,0.64,1); max-height: 90vh; overflow-y: auto; }
.modal-handle { width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 20px; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* TOAST */
.toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(18,0,26,0.97); border: 1px solid; border-radius: 30px; padding: 12px 24px; font-size: 14px; font-weight: 700; z-index: 300; backdrop-filter: blur(20px); animation: toastIn .3s cubic-bezier(0.34,1.56,0.64,1); white-space: nowrap; max-width: 90%; }
.toast-success { border-color: var(--green); color: var(--green); }
.toast-error { border-color: var(--red); color: var(--red); }
.toast-info { border-color: var(--cyan); color: var(--cyan); }
@keyframes toastIn { from { transform: translateX(-50%) translateY(-20px) scale(0.9); opacity:0; } to { transform: translateX(-50%) translateY(0) scale(1); opacity:1; } }

/* PAGE TITLE */
.page-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 900; padding: 8px 16px 20px; }

/* PROFILE */
.profile-avatar-big { font-size: 64px; width: 96px; height: 96px; background: var(--card); border: 2px solid var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px; margin-bottom: 16px; }
.stat-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-sm); padding: 16px; text-align: center; }
.stat-value { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 900; color: var(--gold); }
.stat-label { font-size: 12px; color: var(--text2); margin-top: 4px; font-weight: 700; }

/* BADGE */
.badge { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; display: inline-block; }
.badge-admin { background: rgba(232,24,125,0.2); color: var(--pink); }
.badge-student { background: rgba(232,24,125,0.2); color: var(--cyan); }

/* EMPTY STATE */
.empty-state { text-align: center; padding: 48px 24px; color: var(--text3); }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 14px; font-weight: 600; }

/* LOADING */
.loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.loading-orb { font-size: 64px; animation: float 2s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }

/* RESPONSIVE */
@media(min-width:430px) { .app-shell { box-shadow: 0 0 60px rgba(0,0,0,0.5); } }
@media(max-width:380px) { .store-grid { grid-template-columns: 1fr 1fr; } .balance-amount { font-size: 36px; } }

/* HERO DECORATIONS */
.cosmos-ring { position: absolute; border-radius: 50%; border: 1px solid; pointer-events: none; }

/* ADMIN PANEL */
.admin-tab { flex: 1; text-align: center; padding: 10px 4px; font-size: 12px; font-weight: 700; cursor: pointer; border-radius: 10px; transition: all .2s; color: var(--text3); }
.admin-tab.active { background: rgba(232,24,125,0.15); color: var(--gold); }
.admin-tabs { display: flex; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; margin: 0 16px 16px; }
`;

// ════════════════════════════════════════════
// STARS COMPONENT
// ════════════════════════════════════════════
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: (Math.random() * 3 + 2).toFixed(1),
    delay: (Math.random() * 4).toFixed(1),
  }));
  return (
    <div className="stars">
      {stars.map(s => (
        <div key={s.id} className="star" style={{ left:`${s.x}%`, top:`${s.y}%`, width:`${s.size}px`, height:`${s.size}px`, animationDuration:`${s.dur}s`, animationDelay:`${s.delay}s`, '--dur': `${s.dur}s` }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 400));
    const ok = onLogin(form.username, form.password);
    if (!ok) setError("Usuario o contrasena incorrectos");
    setLoading(false);
  };

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="login-screen">
      <div style={{textAlign:"center", marginBottom:8}}>
        <div style={{marginBottom:12, display:"flex", justifyContent:"center"}}>
          <div style={{background:"#FFFFFF", borderRadius:20, padding:"14px 28px 10px", display:"inline-block"}}>
            <div style={{fontFamily:"Poppins,sans-serif", fontSize:48, fontWeight:800, lineHeight:1, letterSpacing:"-1px"}}>
              <span style={{color:"#E8187D"}}>cosmo</span><span style={{color:"#1A1A1A"}}>bank</span>
            </div>
          </div>
        </div>
        <div style={{fontSize:14, color:"rgba(255,255,255,0.85)", letterSpacing:"0.5px", fontStyle:"italic", marginBottom:24, fontFamily:"Poppins,sans-serif"}}>Tus conquistas, nuestro respaldo.</div>
      </div>
      <div className="login-card">
        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">USUARIO</label>
            <input className="form-input" placeholder="Ej: Ana.Velez" value={form.username} onChange={F("username")} required autoCapitalize="none" />
          </div>
          <div className="form-group">
            <label className="form-label">CONTRASENA</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={F("password")} required />
          </div>
          {error && <div style={{color:"#FF4D6D", fontSize:13, marginBottom:12, textAlign:"center", fontWeight:600}}>{error}</div>}
          <button className="btn btn-gold" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// HOME SCREEN
// ════════════════════════════════════════════
function HomeScreen({ currentUser, transactions, users, setActiveTab }) {
  const myTxs = transactions.filter(t => t.from === currentUser.id || t.to === currentUser.id).slice(0, 8);
  const userName = (id) => {
    if (id === "admin") return "Profesor";
    if (id === "store") return "Tienda";
    const u = users.find(u => u.id === id);
    return u ? u.name.split(" ")[0] : "?";
  };
  const txIcon = (tx) => {
    if (tx.type === "purchase") return "🛒";
    if (tx.type === "loan") return "💰";
    if (tx.to === currentUser.id) return "💚";
    return "📤";
  };
  const txDir = (tx) => (tx.to === currentUser.id ? "in" : "out");

  const myRank = [...users].filter(u=>u.role==="student").sort((a,b)=>b.balance-a.balance).findIndex(u=>u.id===currentUser.id) + 1;
  const totalStudents = users.filter(u=>u.role==="student").length;

  return (
    <div>
      {/* BALANCE CARD */}
      <div className="balance-card">
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
          <span style={{fontSize:28}}>{currentUser.avatar}</span>
          <div>
            <div className="balance-user">{currentUser.name}</div>
            <div style={{display:"flex",gap:6}}>
              <span className={`badge ${currentUser.role==="admin"?"badge-admin":"badge-student"}`}>
                {currentUser.role==="admin"?"👨‍🏫 Profesor":"🎓 Estudiante"}
              </span>
              {myRank > 0 && <span className="badge" style={{background:"rgba(232,24,125,0.15)", color:"var(--gold)"}}>🏆 #{myRank}</span>}
            </div>
          </div>
        </div>
        <div className="balance-label">Saldo disponible</div>
        <div className="balance-amount">{currentUser.balance.toLocaleString()}</div>
        <div className="balance-coin">CosmoCoins ✦</div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        {[
          { icon:"💸", label:"Transferir", tab:"transfer" },
          { icon:"🏪", label:"Tienda", tab:"store" },
          { icon:"💳", label:"Crédito", tab:"credits" },
          { icon:"🏆", label:"Ranking", tab:"ranking" },
        ].map(a => (
          <button key={a.tab} className="qa-btn" onClick={()=>setActiveTab(a.tab)}>
            <span className="qa-icon">{a.icon}</span>
            <span className="qa-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* STATS */}
      {currentUser.role === "student" && (
        <div style={{display:"flex", gap:10, padding:"0 16px", marginBottom:20}}>
          <div style={{flex:1, background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:14, padding:"14px 16px", textAlign:"center"}}>
            <div style={{fontSize:22, fontFamily:"Poppins,sans-serif", fontWeight:900, color:"var(--green)"}}>#{myRank}</div>
            <div style={{fontSize:11, color:"var(--text2)", fontWeight:700, marginTop:4}}>Tu posición</div>
          </div>
          <div style={{flex:1, background:"rgba(232,24,125,0.08)", border:"1px solid rgba(232,24,125,0.2)", borderRadius:14, padding:"14px 16px", textAlign:"center"}}>
            <div style={{fontSize:22, fontFamily:"Poppins,sans-serif", fontWeight:900, color:"var(--gold)"}}>{myTxs.length}</div>
            <div style={{fontSize:11, color:"var(--text2)", fontWeight:700, marginTop:4}}>Transacciones</div>
          </div>
          <div style={{flex:1, background:"rgba(0,212,255,0.08)", border:"1px solid rgba(232,24,125,0.2)", borderRadius:14, padding:"14px 16px", textAlign:"center"}}>
            <div style={{fontSize:22, fontFamily:"Poppins,sans-serif", fontWeight:900, color:"var(--gold)"}}>{totalStudents}</div>
            <div style={{fontSize:11, color:"var(--text2)", fontWeight:700, marginTop:4}}>Compañeros</div>
          </div>
        </div>
      )}

      {/* RECENT TRANSACTIONS */}
      <div className="section-header">
        <span className="section-title">Movimientos recientes</span>
      </div>
      <div className="tx-list">
        {myTxs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💫</div>
            <div className="empty-text">No hay movimientos aún</div>
          </div>
        ) : myTxs.map(tx => {
          const dir = txDir(tx);
          const isIn = dir === "in";
          return (
            <div className="tx-item" key={tx.id}>
              <div className={`tx-icon ${tx.type === "purchase" ? "purchase" : tx.type === "loan" ? "loan" : isIn ? "in" : "out"}`}>{txIcon(tx)}</div>
              <div className="tx-info">
                <div className="tx-desc">{tx.desc}</div>
                <div className="tx-date">
                  {isIn ? `De ${userName(tx.from)}` : `Para ${userName(tx.to)}`} · {fmtDate(tx.date)}
                </div>
              </div>
              <div className={`tx-amount ${isIn?"in":"out"}`}>{isIn?"+":"-"}{tx.amount} CC</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TRANSFER SCREEN
// ════════════════════════════════════════════
function TransferScreen({ currentUser, users, onTransfer }) {
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const students = users.filter(u => u.role === "student" && u.id !== currentUser.id);
  const recipient = users.find(u => u.id === toId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    const ok = await onTransfer(toId, parseInt(amount), desc || `Transferencia de ${currentUser.name.split(" ")[0]}`);
    setLoading(false);
    if (ok) { setAmount(""); setDesc(""); setToId(""); setConfirm(false); }
  };

  return (
    <div style={{padding:"0 16px"}}>
      <div className="page-title">💸 Transferir</div>
      {/* Balance mini */}
      <div style={{background:"rgba(232,24,125,0.08)", border:"1px solid rgba(232,24,125,0.2)", borderRadius:16, padding:"16px 20px", marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <div style={{fontSize:12, color:"var(--text2)", fontWeight:700, marginBottom:4}}>Saldo disponible</div>
          <div style={{fontFamily:"Poppins,sans-serif", fontSize:24, fontWeight:900, color:"var(--gold)"}}>{currentUser.balance} CC</div>
        </div>
        <span style={{fontSize:36}}>💰</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Enviar a</label>
          <select className="form-input form-select" value={toId} onChange={e=>{setToId(e.target.value); setConfirm(false);}} required>
            <option value="">Selecciona un compañero...</option>
            {students.map(u => (
              <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>
            ))}
          </select>
        </div>

        {recipient && (
          <div style={{background:"rgba(0,212,255,0.08)", border:"1px solid rgba(232,24,125,0.2)", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12}}>
            <span style={{fontSize:28}}>{recipient.avatar}</span>
            <div>
              <div style={{fontWeight:700}}>{recipient.name}</div>
              <div style={{fontSize:12, color:"var(--gold)"}}>Saldo: {recipient.balance} CC</div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Cantidad (CosmoCoins)</label>
          <input className="form-input" type="number" min="1" max={currentUser.balance} placeholder="Ej: 50" value={amount} onChange={e=>{setAmount(e.target.value); setConfirm(false);}} required />
          <div style={{fontSize:11, color:"var(--text3)", marginTop:6}}>Máximo: {currentUser.balance} CC</div>
        </div>

        <div className="form-group">
          <label className="form-label">Mensaje (opcional)</label>
          <input className="form-input" placeholder='Ej: "Gracias por tu ayuda 😊"' value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>

        {/* QUICK AMOUNTS */}
        <div style={{display:"flex", gap:8, marginBottom:20}}>
          {[10,25,50,100].map(n=>(
            <button type="button" key={n} className="btn btn-outline btn-sm" onClick={()=>{setAmount(n);setConfirm(false);}}>
              {n} CC
            </button>
          ))}
        </div>

        {confirm && recipient && amount && (
          <div style={{background:"rgba(255,165,0,0.1)", border:"1px solid rgba(255,165,0,0.3)", borderRadius:14, padding:16, marginBottom:16, textAlign:"center"}}>
            <div style={{fontSize:14, fontWeight:700}}>¿Confirmar transferencia?</div>
            <div style={{fontSize:13, color:"var(--text2)", marginTop:4}}>
              Enviar <b style={{color:"var(--gold)"}}>{amount} CC</b> a <b>{recipient.name}</b>
            </div>
          </div>
        )}

        <button className="btn btn-gold" type="submit" disabled={loading || !toId || !amount}>
          {loading ? "⏳ Enviando..." : confirm ? "✅ Confirmar envío" : "💸 Continuar"}
        </button>
        {confirm && <button type="button" className="btn btn-outline" style={{marginTop:10}} onClick={()=>setConfirm(false)}>Cancelar</button>}
      </form>
    </div>
  );
}

// ════════════════════════════════════════════
// CREDITS SCREEN
// ════════════════════════════════════════════
function CreditsScreen({ currentUser, loans, onRequestLoan }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const myLoans = loans.filter(l => l.userId === currentUser.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const hasPending = myLoans.some(l => l.status === "pending");
  const hasApproved = myLoans.some(l => l.status === "approved");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onRequestLoan(parseInt(amount), reason);
    setLoading(false);
    if (ok) { setAmount(""); setReason(""); setShowForm(false); }
  };

  const statusLabel = { pending:"⏳ Pendiente", approved:"✅ Aprobado", rejected:"❌ Rechazado", paid:"💰 Pagado" };

  return (
    <div>
      <div className="page-title" style={{padding:"8px 16px 16px"}}>💳 Créditos</div>

      {/* Info banner */}
      <div style={{margin:"0 16px 20px", background:"linear-gradient(135deg, rgba(232,24,125,0.1), rgba(0,100,255,0.1))", border:"1px solid rgba(232,24,125,0.2)", borderRadius:16, padding:"16px 20px"}}>
        <div style={{fontWeight:800, marginBottom:8}}>¿Cómo funcionan los préstamos?</div>
        <div style={{fontSize:13, color:"var(--text2)", lineHeight:1.6}}>
          🔹 Solicita CosmoCoins prestados al profesor<br/>
          🔹 Se aplica un interés del <b style={{color:"var(--gold)"}}>10%</b><br/>
          🔹 El profesor aprueba o rechaza tu solicitud<br/>
          🔹 Solo puedes tener 1 solicitud pendiente
        </div>
      </div>

      {!showForm ? (
        <div style={{padding:"0 16px", marginBottom:24}}>
          <button className="btn btn-cyan" onClick={()=>setShowForm(true)} disabled={hasPending}>
            {hasPending ? "⏳ Solicitud pendiente..." : "➕ Nueva solicitud de crédito"}
          </button>
        </div>
      ) : (
        <div style={{margin:"0 16px 24px"}}>
          <form onSubmit={handleSubmit} style={{background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:20, padding:20}}>
            <div style={{fontWeight:800, marginBottom:16, fontSize:16}}>Nueva solicitud</div>
            <div className="form-group">
              <label className="form-label">Monto a solicitar (CC)</label>
              <input className="form-input" type="number" min="10" max="500" placeholder="Ej: 100" value={amount} onChange={e=>setAmount(e.target.value)} required />
              {amount && <div style={{fontSize:12, color:"var(--gold2)", marginTop:6}}>Devolverás: {Math.round(amount*1.1)} CC (incluye 10% de interés)</div>}
            </div>
            <div className="form-group">
              <label className="form-label">¿Para qué lo necesitas?</label>
              <input className="form-input" placeholder="Ej: Para comprar un privilegio en la tienda" value={reason} onChange={e=>setReason(e.target.value)} required />
            </div>
            <div style={{display:"flex", gap:10}}>
              <button className="btn btn-gold" type="submit" disabled={loading}>
                {loading ? "⏳..." : "📤 Solicitar"}
              </button>
              <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Loan history */}
      <div className="section-header">
        <span className="section-title">Mis solicitudes</span>
      </div>
      <div style={{padding:"0 16px"}}>
        {myLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">Aún no has solicitado créditos</div>
          </div>
        ) : myLoans.map(loan => (
          <div className="loan-card" key={loan.id}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
              <div>
                <div style={{fontFamily:"Poppins,sans-serif", fontSize:22, fontWeight:900, color:"var(--gold)"}}>{loan.amount} CC</div>
                <div style={{fontSize:12, color:"var(--text2)", marginTop:2}}>Interés: +{loan.interest} CC = {loan.amount + loan.interest} CC total</div>
              </div>
              <span className={`loan-status ${loan.status}`}>{statusLabel[loan.status]}</span>
            </div>
            <div style={{fontSize:13, color:"var(--text2)", marginBottom:6}}>📝 {loan.reason}</div>
            <div style={{fontSize:11, color:"var(--text3)"}}>{fmtDate(loan.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// STORE SCREEN
// ════════════════════════════════════════════
function StoreScreen({ currentUser, store, onBuyItem, purchases }) {
  const [filter, setFilter] = useState("Todos");
  const [confirmItem, setConfirmItem] = useState(null);
  const cats = ["Todos", "Premio Físico", "Privilegio", "Académico", "Experiencia"];
  const filtered = filter === "Todos" ? store : store.filter(i => i.cat === filter);
  const myPurchases = purchases.filter(p => p.userId === currentUser.id);

  const handleBuy = async (item) => {
    if (currentUser.balance < item.price) return;
    await onBuyItem(item.id);
    setConfirmItem(null);
  };

  return (
    <div>
      <div style={{padding:"8px 16px 12px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div className="page-title" style={{padding:0}}>🏪 Tienda</div>
        <div style={{fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"var(--gold)"}}>{currentUser.balance} CC</div>
      </div>

      <div className="filter-tabs">
        {cats.map(c => (
          <div key={c} className={`filter-tab ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</div>
        ))}
      </div>

      <div className="store-grid">
        {filtered.map(item => {
          const owned = myPurchases.filter(p=>p.itemId===item.id).length;
          const canBuy = currentUser.balance >= item.price && item.stock > 0;
          return (
            <div key={item.id} className="store-item" onClick={()=>canBuy && setConfirmItem(item)}>
              {item.stock <= 3 && item.stock > 0 && <span className="stock-low">¡{item.stock} left!</span>}
              {item.stock === 0 && <span className="stock-low" style={{background:"var(--text3)"}}>Agotado</span>}
              <span className="store-item-icon">{item.icon}</span>
              <div className="store-cat-badge">{item.cat}</div>
              <div className="store-item-name">{item.name}</div>
              <div className="store-item-desc">{item.desc}</div>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <div className="store-item-price">{item.price} ✦</div>
                {owned > 0 && <span style={{fontSize:10, color:"var(--green)", fontWeight:700}}>✓ {owned}x</span>}
              </div>
              {!canBuy && item.stock > 0 && (
                <div style={{fontSize:11, color:"var(--red)", marginTop:6, fontWeight:700}}>Saldo insuficiente</div>
              )}
            </div>
          );
        })}
      </div>

      {/* PURCHASE MODAL */}
      {confirmItem && (
        <div className="modal-overlay" onClick={()=>setConfirmItem(null)}>
          <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{textAlign:"center", marginBottom:24}}>
              <div style={{fontSize:64, marginBottom:12}}>{confirmItem.icon}</div>
              <div style={{fontSize:22, fontWeight:900, marginBottom:6}}>{confirmItem.name}</div>
              <div style={{fontSize:14, color:"var(--text2)", marginBottom:16}}>{confirmItem.desc}</div>
              <div style={{display:"flex", justifyContent:"center", gap:20, marginBottom:20}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11, color:"var(--text3)", fontWeight:700}}>PRECIO</div>
                  <div style={{fontFamily:"Poppins,sans-serif", fontSize:28, fontWeight:900, color:"var(--gold)"}}>{confirmItem.price}</div>
                  <div style={{fontSize:12, color:"var(--text2)"}}>CosmoCoins</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11, color:"var(--text3)", fontWeight:700}}>TU SALDO</div>
                  <div style={{fontFamily:"Poppins,sans-serif", fontSize:28, fontWeight:900, color:"var(--green)"}}>{currentUser.balance}</div>
                  <div style={{fontSize:12, color:"var(--text2)"}}>CosmoCoins</div>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:14, color:"var(--text2)"}}>
                Quedarás con <b style={{color:"var(--gold)"}}>{currentUser.balance - confirmItem.price} CC</b> tras la compra
              </div>
            </div>
            <button className="btn btn-gold" onClick={()=>handleBuy(confirmItem)}>
              🛒 Confirmar compra por {confirmItem.price} CC
            </button>
            <button className="btn btn-outline" style={{marginTop:10}} onClick={()=>setConfirmItem(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// RANKING SCREEN
// ════════════════════════════════════════════
function RankingScreen({ users, currentUser, transactions }) {
  const students = [...users].filter(u=>u.role==="student").sort((a,b)=>b.balance-a.balance);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div>
      <div className="page-title">🏆 Ranking</div>
      <div style={{margin:"0 16px 20px", background:"linear-gradient(135deg, rgba(232,24,125,0.1), rgba(255,140,0,0.05))", border:"1px solid rgba(232,24,125,0.2)", borderRadius:16, padding:"16px 20px", textAlign:"center"}}>
        <div style={{fontSize:36, marginBottom:4}}>🌌</div>
        <div style={{fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"var(--gold)"}}>TABLA DE CLASIFICACIÓN</div>
        <div style={{fontSize:12, color:"var(--text2)", marginTop:4}}>Actualizado en tiempo real</div>
      </div>
      <div style={{padding:"0 16px"}}>
        {students.map((u, i) => (
          <div key={u.id} className={`rank-item rank-${i+1} ${u.id===currentUser.id?"mine":""}`}>
            <div className="rank-num">{medals[i] || `#${i+1}`}</div>
            <div className="rank-avatar">{u.avatar}</div>
            <div className="rank-info">
              <div className="rank-name">{u.name} {u.id===currentUser.id && <span style={{fontSize:11,color:"var(--gold)"}}>← Tú</span>}</div>
              <div className="rank-sub">{transactions.filter(t=>t.to===u.id && t.type==="reward").length} premios ganados</div>
            </div>
            <div className="rank-balance">{u.balance.toLocaleString()} CC</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PROFILE SCREEN
// ════════════════════════════════════════════
function ProfileScreen({ currentUser, transactions, purchases, onLogout }) {
  const myTxs = transactions.filter(t=>t.from===currentUser.id||t.to===currentUser.id);
  const myPurchases = purchases.filter(p=>p.userId===currentUser.id);
  const earned = myTxs.filter(t=>t.to===currentUser.id).reduce((s,t)=>s+t.amount,0);
  const spent = myTxs.filter(t=>t.from===currentUser.id).reduce((s,t)=>s+t.amount,0);

  return (
    <div>
      <div className="page-title">👤 Mi Perfil</div>
      {/* Avatar & name */}
      <div style={{textAlign:"center", marginBottom:24, padding:"0 16px"}}>
        <div className="profile-avatar-big">{currentUser.avatar}</div>
        <div style={{fontSize:20, fontWeight:900}}>{currentUser.name}</div>
        <div style={{fontSize:14, color:"var(--text2)", marginTop:4}}>@{currentUser.username}</div>
        <span className={`badge ${currentUser.role==="admin"?"badge-admin":"badge-student"}`} style={{marginTop:8}}>
          {currentUser.role==="admin"?"👨‍🏫 Profesor":"🎓 Estudiante"}
        </span>
      </div>
      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{currentUser.balance}</div>
          <div className="stat-label">Saldo actual</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color:"var(--green)"}}>{earned}</div>
          <div className="stat-label">Total recibido</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color:"var(--red)"}}>{spent}</div>
          <div className="stat-label">Total enviado</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color:"var(--pink)"}}>{myPurchases.length}</div>
          <div className="stat-label">Compras tienda</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="section-header" style={{marginTop:8}}>
        <span className="section-title">🏅 Logros</span>
      </div>
      <div style={{display:"flex", flexWrap:"wrap", gap:10, padding:"0 16px", marginBottom:24}}>
        {[
          { icon:"🚀", name:"Explorador", desc:"Creaste tu cuenta", earned:true },
          { icon:"💸", name:"Generoso", desc:"Hiciste 1+ transferencia", earned:myTxs.some(t=>t.from===currentUser.id&&t.type==="transfer") },
          { icon:"🛍️", name:"Comprador", desc:"Compraste en la tienda", earned:myPurchases.length > 0 },
          { icon:"💰", name:"Adinerado", desc:"Tienes 300+ CC", earned:currentUser.balance >= 300 },
          { icon:"⭐", name:"Top 3", desc:"Entre los 3 primeros", earned:false },
          { icon:"🌟", name:"VIP", desc:"Tienes 1000+ CC", earned:currentUser.balance >= 1000 },
        ].map(a => (
          <div key={a.name} style={{background: a.earned ? "rgba(232,24,125,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${a.earned?"rgba(232,24,125,0.3)":"rgba(255,255,255,0.08)"}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, opacity: a.earned ? 1 : 0.5, width:"100%"}}>
            <span style={{fontSize:24}}>{a.icon}</span>
            <div>
              <div style={{fontSize:13, fontWeight:800}}>{a.name}</div>
              <div style={{fontSize:11, color:"var(--text2)"}}>{a.desc}</div>
            </div>
            {a.earned && <span style={{marginLeft:"auto", color:"var(--gold)", fontSize:16}}>✓</span>}
          </div>
        ))}
      </div>

      <div style={{padding:"0 16px", paddingBottom: 24}}>
        <button className="btn btn-red" onClick={onLogout}>🚪 Cerrar sesión</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// ADMIN SCREEN
// ════════════════════════════════════════════
function AdminScreen({ users, loans, transactions, store, onApproveLoan, onRejectLoan, onAddCoins, onAddCoinsAll, saveStore, showToast }) {
  const [adminTab, setAdminTab] = useState("students");
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinsAmount, setCoinsAmount] = useState("");
  const [coinsReason, setCoinsReason] = useState("");
  const [newItem, setNewItem] = useState({ name:"", desc:"", price:"", cat:"Premio Físico", icon:"🎁", stock:"10" });

  const students = users.filter(u => u.role === "student").sort((a,b) => b.balance - a.balance);
  const pendingLoans = loans.filter(l => l.status === "pending");
  const totalCC = users.filter(u=>u.role==="student").reduce((s,u)=>s+u.balance,0);

  const handleSendCoins = async () => {
    if (!selectedUser || !coinsAmount) return;
    await onAddCoins(selectedUser, parseInt(coinsAmount), coinsReason || "Premio del profesor ⭐");
    setCoinsAmount(""); setCoinsReason(""); setSelectedUser(null);
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return;
    const item = { id:"s"+Date.now(), ...newItem, price:parseInt(newItem.price), stock:parseInt(newItem.stock)||10 };
    await saveStore([...store, item]);
    setNewItem({ name:"", desc:"", price:"", cat:"Premio Físico", icon:"🎁", stock:"10" });
    showToast("Artículo añadido a la tienda ✨");
  };

  return (
    <div>
      <div className="page-title">⚙️ Panel Profesor</div>

      {/* Admin stats */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 16px", marginBottom:16}}>
        {[
          { label:"Estudiantes", value: students.length, icon:"👩‍🎓", color:"var(--gold)" },
          { label:"CC en circulación", value: totalCC, icon:"💰", color:"var(--gold)" },
          { label:"Préstamos pendientes", value: pendingLoans.length, icon:"⏳", color: pendingLoans.length>0?"var(--red)":"var(--green)" },
          { label:"Artículos en tienda", value: store.length, icon:"🏪", color:"var(--pink)" },
        ].map(s => (
          <div key={s.label} style={{background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:14, padding:"14px 16px"}}>
            <div style={{fontSize:22, marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:"Poppins,sans-serif", fontSize:20, fontWeight:900, color:s.color}}>{s.value}</div>
            <div style={{fontSize:11, color:"var(--text2)", fontWeight:700, marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="admin-tabs">
        {[["students","👩‍🎓 Alumnos"],["loans","💳 Préstamos"],["coins","🪙 Dar CC"],["shop","🏪 Tienda"]].map(([k,l])=>(
          <div key={k} className={`admin-tab ${adminTab===k?"active":""}`} onClick={()=>setAdminTab(k)}>{l}</div>
        ))}
      </div>

      {/* STUDENTS TAB */}
      {adminTab === "students" && (
        <div style={{padding:"0 16px"}}>
          {students.map((u, i) => (
            <div key={u.id} className="admin-student-row">
              <div style={{fontSize:11, fontFamily:"Poppins,sans-serif", fontWeight:900, color:"var(--text3)", width:20}}>#{i+1}</div>
              <span style={{fontSize:24}}>{u.avatar}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800, fontSize:14}}>{u.name}</div>
                <div style={{fontSize:11, color:"var(--text2)"}}>@{u.username}</div>
              </div>
              <div style={{fontFamily:"Poppins,sans-serif", fontWeight:700, color:"var(--gold)", fontSize:15}}>{u.balance} CC</div>
            </div>
          ))}
        </div>
      )}

      {/* LOANS TAB */}
      {adminTab === "loans" && (
        <div style={{padding:"0 16px"}}>
          {pendingLoans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <div className="empty-text">Sin solicitudes pendientes</div>
            </div>
          ) : pendingLoans.map(loan => {
            const student = users.find(u => u.id === loan.userId);
            return (
              <div key={loan.id} style={{background:"rgba(255,165,0,0.08)", border:"1px solid rgba(255,165,0,0.2)", borderRadius:16, padding:16, marginBottom:12}}>
                <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
                  <span style={{fontSize:24}}>{student?.avatar}</span>
                  <div>
                    <div style={{fontWeight:800}}>{student?.name}</div>
                    <div style={{fontSize:12, color:"var(--text2)"}}>{fmtDate(loan.date)}</div>
                  </div>
                  <span className="loan-status pending" style={{marginLeft:"auto"}}>⏳ Pendiente</span>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontFamily:"Poppins,sans-serif", fontSize:24, fontWeight:900, color:"var(--gold)"}}>{loan.amount} CC</div>
                  <div style={{fontSize:12, color:"var(--text2)"}}>+ {loan.interest} CC interés = {loan.amount+loan.interest} CC total</div>
                  <div style={{fontSize:13, marginTop:6, color:"var(--text2)"}}>📝 {loan.reason}</div>
                </div>
                <div style={{display:"flex", gap:10}}>
                  <button className="btn btn-green btn-sm" onClick={()=>onApproveLoan(loan.id)}>✅ Aprobar</button>
                  <button className="btn btn-red btn-sm" onClick={()=>onRejectLoan(loan.id)}>❌ Rechazar</button>
                </div>
              </div>
            );
          })}
          {loans.filter(l=>l.status!=="pending").slice(0,5).map(loan => {
            const student = users.find(u=>u.id===loan.userId);
            return (
              <div key={loan.id} className="loan-card" style={{opacity:0.6}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div><b>{student?.name}</b> · {loan.amount} CC</div>
                  <span className={`loan-status ${loan.status}`}>{loan.status==="approved"?"✅ Aprobado":"❌ Rechazado"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COINS TAB */}
      {adminTab === "coins" && (
        <div style={{padding:"0 16px"}}>
          <div style={{background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:20, padding:20}}>
            <div style={{fontWeight:800, marginBottom:16, fontSize:16}}>🪙 Enviar CosmoCoins</div>
            <div className="form-group">
              <label className="form-label">Estudiante</label>
              <select className="form-input form-select" value={selectedUser||""} onChange={e=>setSelectedUser(e.target.value)}>
                <option value="">Selecciona un estudiante...</option>
                {students.map(u=><option key={u.id} value={u.id}>{u.avatar} {u.name} ({u.balance} CC)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad de CosmoCoins</label>
              <input className="form-input" type="number" min="1" placeholder="Ej: 50" value={coinsAmount} onChange={e=>setCoinsAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Motivo del premio</label>
              <input className="form-input" placeholder="Ej: Excelente participación hoy ⭐" value={coinsReason} onChange={e=>setCoinsReason(e.target.value)} />
            </div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:16}}>
              {["Participación en clase 🙋","Excelente comportamiento 😊","Tarea perfecta ✏️","Premio sorpresa 🎁"].map(r=>(
                <button key={r} type="button" className="btn btn-outline btn-sm" onClick={()=>setCoinsReason(r)} style={{fontSize:11}}>{r}</button>
              ))}
            </div>
            <button className="btn btn-gold" onClick={handleSendCoins} disabled={!selectedUser||!coinsAmount}>
              🪙 Enviar CosmoCoins
            </button>
          </div>

          {/* Bulk send */}
          <div style={{background:"rgba(0,212,255,0.06)", border:"1px solid rgba(232,24,125,0.15)", borderRadius:20, padding:20, marginTop:16}}>
            <div style={{fontWeight:800, marginBottom:8}}>⚡ Envío masivo</div>
            <div style={{fontSize:13, color:"var(--text2)", marginBottom:16}}>Envía la misma cantidad a todos los estudiantes</div>
            <div style={{display:"flex", gap:8}}>
              <input className="form-input" type="number" placeholder="CC a todos" style={{flex:1}} id="bulk-amount" />
              <button className="btn btn-cyan btn-sm" onClick={async ()=>{
                const amt = parseInt(document.getElementById("bulk-amount").value);
                if (!amt || amt <= 0) { showToast("Escribe una cantidad ❌","error"); return; }
                await onAddCoinsAll(amt, "Premio grupal 🌟");
                document.getElementById("bulk-amount").value = "";
              }}>Enviar a todos</button>
            </div>
          </div>
        </div>
      )}

      {/* SHOP MANAGEMENT */}
      {adminTab === "shop" && (
        <div style={{padding:"0 16px"}}>
          <div style={{background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:20, padding:20, marginBottom:16}}>
            <div style={{fontWeight:800, marginBottom:16}}>➕ Añadir artículo</div>
            <div className="form-group">
              <label className="form-label">Emoji del artículo</label>
              <input className="form-input" placeholder="🎁" value={newItem.icon} onChange={e=>setNewItem(p=>({...p,icon:e.target.value}))} style={{fontSize:24, textAlign:"center"}} maxLength={2}/>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" placeholder="Nombre del artículo" value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input className="form-input" placeholder="Descripción breve" value={newItem.desc} onChange={e=>setNewItem(p=>({...p,desc:e.target.value}))} />
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
              <div className="form-group">
                <label className="form-label">Precio (CC)</label>
                <input className="form-input" type="number" placeholder="50" value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" placeholder="10" value={newItem.stock} onChange={e=>setNewItem(p=>({...p,stock:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input form-select" value={newItem.cat} onChange={e=>setNewItem(p=>({...p,cat:e.target.value}))}>
                {["Premio Físico","Privilegio","Académico","Experiencia"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-gold" onClick={handleAddItem} disabled={!newItem.name||!newItem.price}>
              ➕ Añadir a la tienda
            </button>
          </div>

          {/* Current store items */}
          <div style={{fontWeight:800, marginBottom:12, fontSize:15}}>Artículos actuales ({store.length})</div>
          {store.map(item => (
            <div key={item.id} style={{display:"flex", alignItems:"center", gap:12, background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:12, padding:"12px 14px", marginBottom:8}}>
              <span style={{fontSize:24}}>{item.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:13}}>{item.name}</div>
                <div style={{fontSize:11, color:"var(--text2)"}}>Stock: {item.stock}</div>
              </div>
              <div style={{fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"var(--gold)"}}>{item.price} CC</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════
// SAVINGS SCREEN (Alcancía)
// ════════════════════════════════════════════
function SavingsScreen({ currentUser, savings, onDepositSavings, onWithdrawSavings, transactions }) {
  const [amount, setAmount] = useState("");
  const [confirm, setConfirm] = useState(false);
  const sv = savings.find(s=>s.userId===currentUser.id);
  const interest = 0; // El interés solo lo aplica el profesor mensualmente
  const myTxs = transactions.filter(t=>(t.from===currentUser.id||t.to===currentUser.id)&&t.type==="savings").slice(0,10);

  const handleDeposit = async () => {
    const n = parseInt(amount);
    if (!n||n<=0) return;
    const ok = await onDepositSavings(n);
    if (ok) setAmount("");
  };

  return (
    <div style={{paddingBottom:16}}>
      <div className="page-title">🐷 Mi Alcancía</div>

      {/* Savings card */}
      <div style={{margin:"0 16px 20px", background:"linear-gradient(135deg, #3D0050, #1C0028)", border:"1px solid rgba(232,24,125,0.4)", borderRadius:24, padding:"24px 20px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", top:-40, right:-40, width:160, height:160, background:"radial-gradient(circle, rgba(232,24,125,0.2) 0%, transparent 70%)", borderRadius:"50%"}}></div>
        <div style={{fontSize:12, color:"rgba(255,128,200,0.8)", letterSpacing:2, textTransform:"uppercase", fontWeight:700}}>Ahorros actuales</div>
        <div style={{fontFamily:"Poppins,sans-serif", fontSize:40, fontWeight:800, color:"#E8187D", margin:"8px 0 4px"}}>{sv ? sv.amount : 0} CC</div>
        <div style={{fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:16}}>Interés mensual: <span style={{color:"#E8187D", fontWeight:700}}>9.25%</span></div>
        <div style={{background:"rgba(232,24,125,0.1)", border:"1px solid rgba(232,24,125,0.2)", borderRadius:12, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <div style={{fontSize:11, color:"rgba(255,255,255,0.5)"}}>Interés a ganar</div>
            <div style={{fontSize:20, fontWeight:800, color:"#00E5A0"}}>+{interest} CC</div>
          </div>
          <div style={{fontSize:32}}>📈</div>
        </div>
      </div>

      {/* Info box */}
      <div style={{margin:"0 16px 20px", background:"rgba(0,229,160,0.07)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:14, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.7}}>
        <span style={{color:"#00E5A0", fontWeight:700}}>¿Cómo funciona?</span><br/>
        Deposita CosmoCoins en tu alcancía y gana un <strong style={{color:"#E8187D"}}>9.25% de interés mensual</strong>. El profesor aplica el interés una vez al mes. Al retirar recibes lo que tienes ahorrado incluyendo el interés que ya fue aplicado.
      </div>

      {/* Deposit form */}
      <div style={{padding:"0 16px 16px"}}>
        <div className="form-group">
          <label className="form-label">Depositar CosmoCoins</label>
          <input className="form-input" type="number" placeholder="¿Cuánto quieres guardar?" value={amount} onChange={e=>setAmount(e.target.value)} min="1" max={currentUser.balance} />
        </div>
        <div style={{fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:12}}>Saldo disponible: <strong style={{color:"var(--gold)"}}>{currentUser.balance} CC</strong></div>
        <button className="btn btn-gold" onClick={handleDeposit} disabled={!amount||parseInt(amount)<=0||parseInt(amount)>currentUser.balance}>
          🐷 Depositar en alcancía
        </button>
      </div>

      {/* Withdraw */}
      {sv && sv.amount > 0 && (
        <div style={{padding:"0 16px 16px"}}>
          {!confirm ? (
            <button className="btn btn-outline" onClick={()=>setConfirm(true)}>
              💸 Retirar todo ({sv.amount} CC
            </button>
          ) : (
            <div style={{background:"rgba(232,24,125,0.08)", border:"1px solid rgba(232,24,125,0.3)", borderRadius:14, padding:16}}>
              <div style={{fontWeight:700, marginBottom:8, textAlign:"center"}}>¿Confirmas el retiro?</div>
              <div style={{fontSize:13, color:"rgba(255,255,255,0.6)", textAlign:"center", marginBottom:14}}>Recibirás <strong style={{color:"#E8187D"}}>{sv.amount} CC</strong> de tu alcancía</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                <button className="btn btn-outline" style={{padding:10}} onClick={()=>setConfirm(false)}>Cancelar</button>
                <button className="btn btn-gold" style={{padding:10}} onClick={()=>{onWithdrawSavings();setConfirm(false);}}>Confirmar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction history */}
      {myTxs.length > 0 && (
        <div style={{padding:"0 16px"}}>
          <div className="section-header"><span className="section-title">Historial alcancía</span></div>
          <div className="tx-list">
            {myTxs.map(tx=>(
              <div key={tx.id} className="tx-item">
                <div className={`tx-icon ${tx.to===currentUser.id?"in":"out"}`}>{tx.to===currentUser.id?"📈":"🐷"}</div>
                <div className="tx-info">
                  <div className="tx-desc">{tx.desc}</div>
                  <div className="tx-date">{fmtDate(tx.date)}</div>
                </div>
                <div className={`tx-amount ${tx.to===currentUser.id?"in":"out"}`}>{tx.to===currentUser.id?"+":"-"}{tx.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// SAVINGS ADMIN SCREEN
// ════════════════════════════════════════════
function SavingsAdminScreen({ users, savings, onApplyInterest }) {
  const students = users.filter(u=>u.role==="student");
  const totalSaved = savings.reduce((a,s)=>a+s.amount,0);

  return (
    <div style={{paddingBottom:16}}>
      <div className="page-title">🐷 Alcancías</div>

      {/* Summary */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 16px", marginBottom:20}}>
        <div className="stat-card">
          <div className="stat-value">{savings.length}</div>
          <div className="stat-label">Alcancías activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalSaved}</div>
          <div className="stat-label">CC ahorrados total</div>
        </div>
      </div>

      {/* Apply interest button */}
      <div style={{padding:"0 16px 20px"}}>
        <button className="btn btn-gold" onClick={onApplyInterest}>
          📈 Aplicar interés 9.25% a todas
        </button>
        <div style={{fontSize:11, color:"rgba(255,255,255,0.4)", textAlign:"center", marginTop:8}}>Aplica el interés mensual a todas las alcancías activas</div>
      </div>

      {/* List */}
      <div style={{padding:"0 16px"}}>
        <div style={{fontWeight:700, fontSize:14, marginBottom:12, color:"rgba(255,255,255,0.7)"}}>Detalle por estudiante</div>
        {students.map(u=>{
          const sv = savings.find(s=>s.userId===u.id);
          const interest = sv ? Math.floor(sv.amount*0.0925) : 0;
          return (
            <div key={u.id} style={{display:"flex", alignItems:"center", gap:12, background:"var(--card)", border:"1px solid var(--card-border)", borderRadius:12, padding:"12px 14px", marginBottom:8}}>
              <span style={{fontSize:22}}>{u.avatar}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:13}}>{u.name}</div>
                <div style={{fontSize:11, color:"rgba(255,255,255,0.4)"}}>
                  {sv ? `Interés a ganar: +${interest} CC` : "Sin alcancía activa"}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Poppins,sans-serif", fontWeight:700, fontSize:15, color: sv ? "#E8187D" : "rgba(255,255,255,0.2)"}}>{sv ? sv.amount+" CC" : "—"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// APP SHELL
// ════════════════════════════════════════════
function AppShell(props) {
  const { currentUser, activeTab, setActiveTab, onLogout } = props;
  const isAdmin = currentUser.role === "admin";

  const navItems = isAdmin
    ? [
        { id:"home", icon:"🏠", label:"Inicio" },
        { id:"store", icon:"🏪", label:"Tienda" },
        { id:"ranking", icon:"🏆", label:"Ranking" },
        { id:"savings_admin", icon:"🐷", label:"Alcancías" },
        { id:"admin", icon:"⚙️", label:"Panel" },
      ]
    : [
        { id:"home", icon:"🏠", label:"Inicio" },
        { id:"transfer", icon:"💸", label:"Enviar" },
        { id:"store", icon:"🏪", label:"Tienda" },
        { id:"savings", icon:"🐷", label:"Alcancía" },
        { id:"profile", icon:"👤", label:"Perfil" },
      ];

  const renderScreen = () => {
    switch(activeTab) {
      case "home": return <HomeScreen {...props} setActiveTab={setActiveTab} />;
      case "transfer": return <TransferScreen {...props} />;
      case "store": return <StoreScreen {...props} />;
      case "credits": return <CreditsScreen {...props} />;
      case "ranking": return <RankingScreen {...props} />;
      case "profile": return <ProfileScreen {...props} onLogout={onLogout} />;
      case "savings": return <SavingsScreen {...props} />;
      case "savings_admin": return <SavingsAdminScreen {...props} />;
      case "admin": return <AdminScreen {...props} />;
      default: return null;
    }
  };

  return (
    <div className="app-shell">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-logo">◎ COSMOBANK</div>
        <div className="topbar-user">
          {isAdmin && <span className="badge badge-admin" style={{marginRight:6}}>PROF</span>}
          <div className="topbar-avatar" onClick={()=>setActiveTab(isAdmin?"admin":"profile")}>{currentUser.avatar}</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="scroll-content">
        {renderScreen()}
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        {navItems.map(item => (
          <button key={item.id} className={`nav-btn ${activeTab===item.id?"active":""}`} onClick={()=>setActiveTab(item.id)}>
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════
export default function CosmoBank() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [store, setStore] = useState([]);
  const [loans, setLoans] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [savings, setSavings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await db.get("cb_users") || SEED_USERS;
      const t = await db.get("cb_txs") || SEED_TXS;
      const s = SEED_STORE; // Always use latest store definition
      const l = await db.get("cb_loans") || [];
      const p = await db.get("cb_purchases") || [];
      const sv = await db.get("cb_savings") || [];
      setUsers(u); setTransactions(t); setStore(s); setLoans(l); setPurchases(p); setSavings(sv);
      setLoaded(true);
    })();
  }, []);

  const saveUsers = async (u) => { setUsers(u); await db.set("cb_users", u); };
  const saveTxs = async (t) => { setTransactions(t); await db.set("cb_txs", t); };
  const saveLoans = async (l) => { setLoans(l); await db.set("cb_loans", l); };
  const saveStore = async (s) => { setStore(s); await db.set("cb_store", s); };
  const savePurchases = async (p) => { setPurchases(p); await db.set("cb_purchases", p); };
  const saveSavings = async (sv) => { setSavings(sv); await db.set("cb_savings", sv); };

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (username, password) => {
    const user = users.find(u => u.username===username && u.password===password);
    if (user) { setCurrentUser(user); setScreen("app"); setActiveTab("home"); }
    else showToast("Usuario o contraseña incorrectos ❌", "error");
  };

  const register = async (name, username, password) => {
    if (!name||!username||!password) { showToast("Completa todos los campos","error"); return; }
    if (users.find(u=>u.username===username)) { showToast("Ese usuario ya existe ❌","error"); return; }
    const avatars = ["🌟","🚀","🌙","⭐","🌈","💫","🎯","🔮","🌸","🦋"];
    const newUser = { id:"u"+Date.now(), name, username, password, role:"student", balance:50, avatar:avatars[Math.floor(Math.random()*avatars.length)], joinDate:new Date().toISOString(), totalEarned:50 };
    const newUsers = [...users, newUser];
    await saveUsers(newUsers);
    const welcomeTx = { id:genId("t"), from:"admin", to:newUser.id, amount:50, type:"reward", desc:"¡Bienvenido/a a CosmoBank! 🎉", date:new Date().toISOString() };
    await saveTxs([welcomeTx, ...transactions]);
    setCurrentUser(newUser); setScreen("app"); setActiveTab("home");
    showToast("¡Cuenta creada! Recibiste 50 CC de bienvenida 🎉");
  };

  const logout = () => { setCurrentUser(null); setScreen("login"); };

  const transfer = async (toId, amount, desc) => {
    const fromUser = users.find(u=>u.id===currentUser.id);
    if (fromUser.balance < amount) { showToast("Saldo insuficiente ❌","error"); return false; }
    if (amount <= 0) { showToast("Cantidad inválida ❌","error"); return false; }
    const newUsers = users.map(u => {
      if (u.id===currentUser.id) return {...u, balance:u.balance-amount};
      if (u.id===toId) return {...u, balance:u.balance+amount};
      return u;
    });
    const tx = { id:genId("t"), from:currentUser.id, to:toId, amount, type:"transfer", desc, date:new Date().toISOString() };
    await saveUsers(newUsers);
    await saveTxs([tx, ...transactions]);
    setCurrentUser(newUsers.find(u=>u.id===currentUser.id));
    showToast(`✅ Enviaste ${amount} CC`);
    return true;
  };

  const requestLoan = async (amount, reason) => {
    if (loans.some(l=>l.userId===currentUser.id&&l.status==="pending")) { showToast("Ya tienes una solicitud pendiente ⏳","error"); return false; }
    const loan = { id:genId("l"), userId:currentUser.id, amount, reason, interest:Math.round(amount*0.1), status:"pending", date:new Date().toISOString() };
    await saveLoans([loan, ...loans]);
    showToast("Solicitud enviada al profesor ✉️");
    return true;
  };

  const approveLoan = async (loanId) => {
    const loan = loans.find(l=>l.id===loanId);
    const newLoans = loans.map(l=>l.id===loanId?{...l,status:"approved"}:l);
    const newUsers = users.map(u=>u.id===loan.userId?{...u,balance:u.balance+loan.amount}:u);
    const tx = { id:genId("t"), from:"admin", to:loan.userId, amount:loan.amount, type:"loan", desc:"Préstamo aprobado por el profesor 💰", date:new Date().toISOString() };
    await saveLoans(newLoans); await saveUsers(newUsers); await saveTxs([tx,...transactions]);
    if (currentUser.id===loan.userId) setCurrentUser(newUsers.find(u=>u.id===currentUser.id));
    showToast("✅ Préstamo aprobado");
  };

  const rejectLoan = async (loanId) => {
    await saveLoans(loans.map(l=>l.id===loanId?{...l,status:"rejected"}:l));
    showToast("❌ Préstamo rechazado");
  };

  const buyItem = async (itemId) => {
    const item = store.find(i=>i.id===itemId);
    const user = users.find(u=>u.id===currentUser.id);
    if (user.balance < item.price) { showToast("Saldo insuficiente ❌","error"); return; }
    if (item.stock <= 0) { showToast("Sin stock disponible ❌","error"); return; }
    const newUsers = users.map(u=>u.id===currentUser.id?{...u,balance:u.balance-item.price}:u);
    const newStore = store.map(i=>i.id===itemId?{...i,stock:i.stock-1}:i);
    const purchase = { id:genId("p"), userId:currentUser.id, itemId, date:new Date().toISOString() };
    const tx = { id:genId("t"), from:currentUser.id, to:"store", amount:item.price, type:"purchase", desc:`Compra: ${item.name} ${item.icon}`, date:new Date().toISOString() };
    await saveUsers(newUsers); await saveStore(newStore); await savePurchases([purchase,...purchases]); await saveTxs([tx,...transactions]);
    setCurrentUser(newUsers.find(u=>u.id===currentUser.id));
    showToast(`${item.icon} ¡Compraste ${item.name}!`);
  };

  const addCoins = async (userId, amount, reason) => {
    const newUsers = users.map(u=>u.id===userId?{...u,balance:u.balance+amount}:u);
    const tx = { id:genId("t"), from:"admin", to:userId, amount, type:"reward", desc:reason||"Premio del profesor ⭐", date:new Date().toISOString() };
    await saveUsers(newUsers); await saveTxs([tx,...transactions]);
    if (currentUser&&currentUser.id===userId) setCurrentUser(newUsers.find(u=>u.id===userId));
    showToast(`🪙 +${amount} CC enviados`);
  };

  const addCoinsAll = async (amount, reason) => {
    if (!amount || amount <= 0) { showToast("Cantidad inválida ❌", "error"); return; }
    const students = users.filter(u => u.role === "student");
    const now = new Date().toISOString();
    const newUsers = users.map(u =>
      u.role === "student" ? {...u, balance: u.balance + amount} : u
    );
    const newTxs = students.map(u => ({
      id: genId("t"), from: "admin", to: u.id, amount,
      type: "reward", desc: reason || "Premio grupal 🌟", date: now
    }));
    await saveUsers(newUsers);
    await saveTxs([...newTxs, ...transactions]);
    showToast(`🌟 +${amount} CC enviados a ${students.length} estudiantes`);
  };

  const depositSavings = async (amount) => {
    const user = users.find(u=>u.id===currentUser.id);
    if (user.balance < amount) { showToast("Saldo insuficiente ❌","error"); return false; }
    if (amount <= 0) { showToast("Cantidad inválida ❌","error"); return false; }
    const existing = savings.find(s=>s.userId===currentUser.id);
    let newSavings;
    const now = new Date().toISOString();
    if (existing) {
      newSavings = savings.map(s=>s.userId===currentUser.id
        ? {...s, amount: s.amount+amount, lastDeposit: now}
        : s);
    } else {
      newSavings = [...savings, { id:genId("sv"), userId:currentUser.id, amount, startDate:now, lastDeposit:now, lastInterest:now }];
    }
    const newUsers = users.map(u=>u.id===currentUser.id?{...u,balance:u.balance-amount}:u);
    const tx = { id:genId("t"), from:currentUser.id, to:"savings", amount, type:"savings", desc:"💰 Depósito en alcancía", date:now };
    await saveUsers(newUsers); await saveSavings(newSavings); await saveTxs([tx,...transactions]);
    setCurrentUser(newUsers.find(u=>u.id===currentUser.id));
    showToast(`🐷 Guardaste ${amount} CC en tu alcancía`);
    return true;
  };

  const withdrawSavings = async () => {
    const sv = savings.find(s=>s.userId===currentUser.id);
    if (!sv || sv.amount <= 0) { showToast("Tu alcancía está vacía ❌","error"); return; }
    const total = sv.amount;
    const now = new Date().toISOString();
    const newUsers = users.map(u=>u.id===currentUser.id?{...u,balance:u.balance+total}:u);
    const newSavings = savings.filter(s=>s.userId!==currentUser.id);
    const tx = { id:genId("t"), from:"savings", to:currentUser.id, amount:total, type:"savings", desc:`🐷 Retiro alcancía: ${sv.amount} CC`, date:now };
    await saveUsers(newUsers); await saveSavings(newSavings); await saveTxs([tx,...transactions]);
    setCurrentUser(newUsers.find(u=>u.id===currentUser.id));
    showToast(`✅ Retiraste ${total} CC de tu alcancía`);
  };

  const applyInterest = async () => {
    if (savings.length===0) { showToast("No hay alcancías activas","error"); return; }
    const now = new Date().toISOString();
    let txs = [...transactions];
    const newSavings = savings.map(sv => {
      const interest = Math.floor(sv.amount * 0.0925);
      txs = [{ id:genId("t"), from:"admin", to:sv.userId, amount:interest, type:"savings", desc:`📈 Interés alcancía 9.25%`, date:now }, ...txs];
      return {...sv, amount: sv.amount+interest, lastInterest: now};
    });
    await saveSavings(newSavings); await saveTxs(txs);
    showToast(`📈 Interés aplicado a ${savings.length} alcancía(s)`);
  };

  if (!loaded) return (
    <div className="cosmos-root">
      <Stars />
      <div className="loading-screen">
        <div className="loading-orb">🌌</div>
        <div style={{fontFamily:"Poppins,sans-serif", fontSize:20, fontWeight:900, background:"linear-gradient(135deg, #E8187D, #FF5BAD)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>COSMOBANK</div>
        <div style={{color:"rgba(255,255,255,0.4)", fontSize:13}}>Cargando el universo...</div>
      </div>
    </div>
  );

  return (
    <div className="cosmos-root">
      <style>{CSS}</style>
      <Stars />
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
      {screen === "login" && <LoginScreen onLogin={login} />}
      {screen === "app" && (
        <AppShell
          currentUser={currentUser} users={users} transactions={transactions}
          store={store} loans={loans} purchases={purchases}
          activeTab={activeTab} setActiveTab={setActiveTab}
          onLogout={logout} onTransfer={transfer} onRequestLoan={requestLoan}
          onApproveLoan={approveLoan} onRejectLoan={rejectLoan}
          onBuyItem={buyItem} onAddCoins={addCoins} onAddCoinsAll={addCoinsAll}
          showToast={showToast} saveStore={saveStore}
          savings={savings} onDepositSavings={depositSavings} onWithdrawSavings={withdrawSavings} onApplyInterest={applyInterest}
        />
      )}
    </div>
  );
}
