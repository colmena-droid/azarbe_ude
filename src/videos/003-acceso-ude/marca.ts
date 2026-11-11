import type { Marca } from "../acceso/AccesoMarca";

// Vídeo 003 · UDE. Locución: ElevenLabs, voz «Lydia», toma B (normalizada a -16 LUFS).
// Cortes de escena sincronizados con las pausas de la locución.
export const UDE: Marca = {
  nombre: "UDE",
  url: "ude.es",
  logo: "marca/logo-ude.png",
  voz: "audio/003-ude-voz-b-norm.mp3",
  retrasoVoz: 12,
  desfasePaso1: -7,
  dur: {
    intro: 136,
    paso1: 214,
    cliente: 259,
    nuevo: 105,
    aviso: 192,
    formulario: 421,
    registrarse: 100,
    ventajas: 192,
    cierre: 126,
  },
};
