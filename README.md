# Vídeos Azarbe / UDE

Vídeos en Remotion (vertical 1080×1920, 30 fps) para la nueva web [abacuseducacion.es](https://abacuseducacion.es).

| Nº | Vídeo | Entrega |
|----|-------|---------|
| 001 | Flujo de acceso: iniciar sesión o registrarse | `entregas/001-flujo-registro.mp4` |
| 002 | Azarbe · Cómo acceder a la nueva web (voz Lydia, ElevenLabs) | `entregas/002-acceso-azarbe.mp4` |
| 003 | UDE · Cómo acceder a la nueva web (voz Lydia, ElevenLabs) | `entregas/003-acceso-ude.mp4` |

## Uso

```bash
npm install
npm run studio                                   # previsualizar
npx remotion render src/index.ts 001-flujo-registro entregas/001-flujo-registro.mp4
```

- `public/capturas/`: capturas reales de la web (1440 px CSS, @2x).
- `public/marca/`: logos Azarbe + UDE sacados de la web.
- `src/config.ts`: formato, colores de marca y fuente.
- `src/videos/acceso/AccesoMarca.tsx`: plantilla común de los vídeos 002 (Azarbe) y 003 (UDE); cada marca define logo, dominio, locución y duraciones en su `marca.ts`.
