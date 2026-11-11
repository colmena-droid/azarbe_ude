import type { Marca } from "../acceso/AccesoMarca";

// Vídeo 002 · Azarbe. Locución: ElevenLabs, voz «Lydia», toma A (normalizada a -16 LUFS).
// Cortes de escena sincronizados con las pausas de la locución.
export const AZARBE: Marca = {
  nombre: "Azarbe",
  url: "azarbe.es",
  logo: "marca/logo-azarbe.png",
  voz: "audio/002-azarbe-voz-a-norm.mp3",
  retrasoVoz: 12,
  desfasePaso1: 0,
  dur: {
    intro: 137,
    paso1: 222,
    cliente: 262,
    nuevo: 107,
    aviso: 190,
    formulario: 422,
    registrarse: 100,
    ventajas: 201,
    cierre: 120,
  },
};
