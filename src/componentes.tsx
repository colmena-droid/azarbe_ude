import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FUENTE } from "./config";

// ---------- Fuentes locales (Inter) ----------
export const Fuentes: React.FC = () => (
  <style>
    {[
      ["Regular", 400],
      ["Medium", 500],
      ["SemiBold", 600],
      ["Bold", 700],
      ["ExtraBold", 800],
      ["Black", 900],
    ]
      .map(
        ([n, w]) =>
          `@font-face{font-family:InterLocal;font-weight:${w};src:url(${staticFile(
            `fonts/Inter-${n}.otf`,
          )}) format("opentype");}`,
      )
      .join("\n")}
  </style>
);

// ---------- Utilidades ----------
const ease = Easing.bezier(0.65, 0, 0.35, 1);

export type Clave = { f: number; cx: number; cy: number; z: number };

// Interpola una cámara (centro + zoom en coordenadas CSS de la página capturada)
export const camara = (frame: number, claves: Clave[]) => {
  if (frame <= claves[0].f) return claves[0];
  for (let i = 0; i < claves.length - 1; i++) {
    const a = claves[i];
    const b = claves[i + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / Math.max(1, b.f - a.f));
      return {
        f: frame,
        cx: a.cx + (b.cx - a.cx) * t,
        cy: a.cy + (b.cy - a.cy) * t,
        z: a.z + (b.z - a.z) * t,
      };
    }
  }
  return claves[claves.length - 1];
};

export const entrada = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });

// ---------- Ventana de navegador con cámara ----------
export const Navegador: React.FC<{
  src: string;
  anchoPagina: number; // ancho CSS de la captura (1440)
  altoPagina: number;
  claves: Clave[];
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  children?: (z: number) => React.ReactNode; // superposiciones en coordenadas de página
}> = ({ src, anchoPagina, altoPagina, claves, x, y, w, h, url, children }) => {
  const frame = useCurrentFrame();
  const barra = 64;
  const vh = h - barra;
  const cam = camara(frame, claves);
  const left = w / 2 - cam.cx * cam.z;
  const top = vh / 2 - cam.cy * cam.z;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 34,
        overflow: "hidden",
        background: C.blanco,
        boxShadow: "0 30px 80px rgba(16,34,46,0.18), 0 4px 14px rgba(16,34,46,0.08)",
      }}
    >
      {/* barra del navegador */}
      <div
        style={{
          height: barra,
          background: "#EEF2F4",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 12,
          borderBottom: "1px solid #DDE4E8",
        }}
      >
        {[C.rojo, C.amarillo, C.lima].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            height: 38,
            borderRadius: 19,
            background: C.blanco,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            fontFamily: FUENTE,
            fontSize: 22,
            color: C.gris,
            fontWeight: 500,
          }}
        >
          🔒&nbsp;&nbsp;{url}
        </div>
      </div>
      <div style={{ position: "relative", width: w, height: vh, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: anchoPagina,
            height: altoPagina,
            transformOrigin: "0 0",
            transform: `translate(${left}px, ${top}px) scale(${cam.z})`,
          }}
        >
          <Img src={staticFile(src)} style={{ width: anchoPagina, height: altoPagina, display: "block" }} />
          {children?.(cam.z)}
        </div>
      </div>
    </div>
  );
};

// ---------- Cursor (en coordenadas de página) ----------
export const Cursor: React.FC<{
  z: number;
  puntos: { f: number; x: number; y: number }[];
  clics?: number[];
  aparece?: number;
}> = ({ z, puntos, clics = [], aparece = 0 }) => {
  const frame = useCurrentFrame();
  let p = puntos[0];
  if (frame > puntos[0].f) {
    p = puntos[puntos.length - 1];
    for (let i = 0; i < puntos.length - 1; i++) {
      const a = puntos[i];
      const b = puntos[i + 1];
      if (frame <= b.f) {
        const t = ease((frame - a.f) / Math.max(1, b.f - a.f));
        p = { f: frame, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        break;
      }
    }
  }
  const op = interpolate(frame, [aparece, aparece + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let pulsa = 1;
  const ondas: React.ReactNode[] = [];
  for (const c of clics) {
    const d = frame - c;
    if (d >= 0 && d < 8) pulsa = Math.min(pulsa, interpolate(d, [0, 3, 8], [1, 0.8, 1]));
    if (d >= 0 && d < 24) {
      const r = interpolate(d, [0, 24], [8, 70], { easing: Easing.out(Easing.cubic) });
      ondas.push(
        <div
          key={c}
          style={{
            position: "absolute",
            left: p.x - r / z,
            top: p.y - r / z,
            width: (2 * r) / z,
            height: (2 * r) / z,
            borderRadius: "50%",
            border: `${5 / z}px solid ${C.amarillo}`,
            opacity: interpolate(d, [0, 24], [1, 0]),
          }}
        />,
      );
    }
  }
  const s = (1 / z) * 1.25 * pulsa;
  return (
    <>
      {ondas}
      <svg
        width={40}
        height={52}
        viewBox="0 0 40 52"
        style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          opacity: op,
          transformOrigin: "0 0",
          transform: `scale(${s})`,
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
        }}
      >
        <path
          d="M3 3 L3 41 L13 32 L20 48 L27 45 L20 29 L34 29 Z"
          fill={C.tinta}
          stroke="#fff"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

// ---------- Recuadro resaltado (en coordenadas de página) ----------
export const Resalte: React.FC<{
  z: number;
  x: number;
  y: number;
  w: number;
  h: number;
  desde: number;
  hasta?: number;
  color?: string;
  radio?: number;
}> = ({ z, x, y, w, h, desde, hasta = 99999, color = C.amarillo, radio = 12 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [desde, desde + 8, hasta - 8, hasta], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pad = 8 / z;
  const latido = 1 + 0.03 * Math.sin((frame - desde) / 5);
  return (
    <div
      style={{
        position: "absolute",
        left: x - pad,
        top: y - pad,
        width: w + 2 * pad,
        height: h + 2 * pad,
        borderRadius: radio + pad,
        border: `${6 / z}px solid ${color}`,
        boxShadow: `0 0 0 ${10 / z}px ${color}33`,
        opacity: op,
        transform: `scale(${latido})`,
      }}
    />
  );
};

// ---------- Texto que se escribe solo (en coordenadas de página) ----------
export const Escribe: React.FC<{
  x: number;
  y: number;
  texto: string;
  desde: number;
  porFrame?: number;
  oculto?: boolean;
}> = ({ x, y, texto, desde, porFrame = 0.6, oculto }) => {
  const frame = useCurrentFrame();
  if (frame < desde) return null;
  const n = Math.min(texto.length, Math.floor((frame - desde) * porFrame));
  const visible = oculto ? "•".repeat(n) : texto.slice(0, n);
  const caret = n < texto.length || Math.floor(frame / 12) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: 48,
        width: 470,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: 16,
        color: "#222",
        letterSpacing: oculto ? 2 : 0.2,
      }}
    >
      {visible}
      <span style={{ width: 1.5, height: 20, background: caret ? "#222" : "transparent", marginLeft: 1 }} />
    </div>
  );
};

// ---------- Cabecera de paso ----------
export const CabeceraPaso: React.FC<{
  paso: string;
  titulo: React.ReactNode;
  sub?: React.ReactNode;
  color?: string;
}> = ({ paso, titulo, sub, color = C.cian }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 0);
  const b = entrada(frame, fps, 5);
  const c = entrada(frame, fps, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 150,
        fontFamily: FUENTE,
        color: C.tinta,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: color,
          color: "#fff",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 3,
          padding: "12px 28px",
          borderRadius: 40,
          transform: `scale(${a})`,
          transformOrigin: "left center",
        }}
      >
        {paso}
      </div>
      <div
        style={{
          marginTop: 26,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.04,
          letterSpacing: -1.5,
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
        }}
      >
        {titulo}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 18,
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 1.25,
            color: C.gris,
            opacity: c,
            transform: `translateY(${(1 - c) * 30}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// ---------- Fondo con formas de marca ----------
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const m = Math.sin(frame / 40) * 14;
  return (
    <AbsoluteFill style={{ background: C.fondo, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: C.cian, opacity: 0.1, left: -220 + m, top: -160 }} />
      <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: C.lima, opacity: 0.16, right: -150, top: 1540 - m }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: C.amarillo, opacity: 0.16, right: 70, top: 90 + m }} />
      <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: C.rojo, opacity: 0.1, left: 60, top: 1700 + m }} />
    </AbsoluteFill>
  );
};

// ---------- Pie con logos ----------
export const PieLogos: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 90,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Img src={staticFile("marca/logos-azarbe-ude.png")} style={{ height: 76, mixBlendMode: "multiply" }} />
  </div>
);

// ---------- Fundido de escena ----------
export const Escena: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
