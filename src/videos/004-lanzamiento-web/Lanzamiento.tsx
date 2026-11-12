import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../../config";
import { Escena } from "../../componentes";

// Vídeo 004 · Lanzamiento de la nueva web (neutro: vale para Azarbe y UDE).
// Estilo de la gráfica de lanzamiento: fondo crema, titular serif negro (Fraunces Black),
// texto en Jost (la fuente de la web) y los 4 puntos de color de la marca.
// Locución: ElevenLabs, voz «Lydia», toma A normalizada. Tiempos sincronizados con la
// transcripción palabra a palabra (frame = RETRASO_VOZ + 30 · segundo).

const CREMA = "#FAF6F0";
const NEGRO = "#111111";
const MELOCOTON = "#FDEEDB";
const SERIF = "FrauncesLocal, serif";
const JOST = "JostLocal, sans-serif";
const RETRASO_VOZ = 12;

const DUR = { hook: 164, catalogo: 312, cliente: 324, cierre: 100 };
export const DURACION_LANZAMIENTO = Object.values(DUR).reduce((a, b) => a + b, 0);

const CAP = (n: string) => `capturas/lanzamiento/${n}.jpg`;

const FuentesLanzamiento: React.FC = () => (
  <style>
    {[
      ["JostLocal", "Jost-Light.ttf", 300],
      ["JostLocal", "Jost-Regular.ttf", 400],
      ["JostLocal", "Jost-Medium.ttf", 500],
      ["JostLocal", "Jost-SemiBold.ttf", 600],
      ["JostLocal", "Jost-Bold.ttf", 700],
      ["FrauncesLocal", "Fraunces-Black.ttf", 900],
    ]
      .map(
        ([fam, file, w]) =>
          `@font-face{font-family:${fam};font-weight:${w};src:url(${staticFile(`fonts/${file}`)}) format("truetype");}`,
      )
      .join("\n")}
  </style>
);

const sp = (frame: number, fps: number, delay = 0, damping = 15, stiffness = 140) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness } });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.65, 0, 0.35, 1);

// ---------- Puntos de marca ----------
const Puntos: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", right: 90, top: 170, display: "flex", gap: 18 }}>
      {[C.lima, C.amarillo, C.rojo, C.cian].map((c, i) => (
        <div
          key={c}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: c,
            transform: `scale(${sp(frame, fps, delay + i * 4, 10, 180)})`,
          }}
        />
      ))}
    </div>
  );
};

// ---------- Captura dentro de una pantalla ----------
const Captura: React.FC<{ src: string; srcW: number; sw: number; scroll?: number; opacity?: number }> = ({
  src,
  srcW,
  sw,
  scroll = 0,
  opacity = 1,
}) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", left: 0, top: -scroll * (sw / srcW), width: sw, opacity }}
  />
);

type Pantalla = (sw: number, sh: number) => React.ReactNode;

// ---------- Dispositivos (CSS) ----------
const Portatil: React.FC<{ x: number; y: number; w: number; children: Pantalla; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  children,
  style,
}) => {
  const b = Math.round(w * 0.028); // bisel
  const sw = w - 2 * b;
  const sh = Math.round(sw / 1.6);
  const h = sh + b + Math.round(b * 1.15);
  const base = Math.round(w * 0.03);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + base, ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: h,
          background: "#0B0B0B",
          borderRadius: `${b * 1.4}px ${b * 1.4}px 4px 4px`,
          boxShadow: "inset 0 0 0 3px #8E8E8E",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: b,
            top: b,
            width: sw,
            height: sh,
            overflow: "hidden",
            background: "#fff",
            borderRadius: 4,
          }}
        >
          {children(sw, sh)}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: -w * 0.1,
          top: h - 2,
          width: w * 1.2,
          height: base,
          background: "linear-gradient(#B9B9B9, #8C8C8C)",
          borderRadius: `3px 3px ${base}px ${base}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -w * 0.08,
            width: w * 0.16,
            height: base * 0.45,
            background: "#7A7A7A",
            borderRadius: `0 0 ${base}px ${base}px`,
          }}
        />
      </div>
    </div>
  );
};

const Tablet: React.FC<{ x: number; y: number; w: number; children: Pantalla; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  children,
  style,
}) => {
  const b = Math.round(w * 0.05);
  const h = Math.round(w * 1.4);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#0B0B0B",
        borderRadius: w * 0.09,
        boxShadow: "inset 0 0 0 3px #6E6E6E, 0 20px 40px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: b,
          top: b,
          width: w - 2 * b,
          height: h - 2 * b,
          overflow: "hidden",
          background: "#fff",
          borderRadius: w * 0.04,
        }}
      >
        {children(w - 2 * b, h - 2 * b)}
      </div>
    </div>
  );
};

const Movil: React.FC<{ x: number; y: number; w: number; children: Pantalla; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  children,
  style,
}) => {
  const b = Math.round(w * 0.05);
  const h = Math.round(w * 2.05);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#0B0B0B",
        borderRadius: w * 0.18,
        boxShadow: "inset 0 0 0 3px #5A5470, 0 24px 44px rgba(0,0,0,0.28)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: b,
          top: b,
          width: w - 2 * b,
          height: h - 2 * b,
          overflow: "hidden",
          background: "#fff",
          borderRadius: w * 0.14,
        }}
      >
        {children(w - 2 * b, h - 2 * b)}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: b,
          width: w * 0.36,
          height: w * 0.09,
          marginLeft: -w * 0.18,
          background: "#0B0B0B",
          borderRadius: `0 0 ${w * 0.06}px ${w * 0.06}px`,
        }}
      />
    </div>
  );
};

// Grupo portátil + tablet + móvil (como en la gráfica). Coordenadas internas 1000×700.
const Dispositivos: React.FC<{ x: number; y: number; escala?: number; delay?: number; scrollHasta?: number }> = ({
  x,
  y,
  escala = 1,
  delay = 0,
  scrollHasta = 160,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = sp(frame, fps, delay, 16, 110);
  const b = sp(frame, fps, delay + 8, 14, 120);
  const c = sp(frame, fps, delay + 16, 12, 130);
  // las webs se desplazan solas dentro de cada pantalla
  const t = interpolate(frame, [delay + 30, delay + scrollHasta], [0, 1], { ...clamp, easing: suave });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 1000, height: 700, transform: `scale(${escala})`, transformOrigin: "0 0" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 540,
          width: 900,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.32), rgba(0,0,0,0))",
          opacity: a,
        }}
      />
      <Portatil x={70} y={0} w={700} style={{ opacity: a, transform: `translateY(${(1 - a) * 120}px)` }}>
        {(sw) => <Captura src={CAP("home-desk")} srcW={2880} sw={sw} scroll={t * 1500} />}
      </Portatil>
      <Tablet x={640} y={150} w={320} style={{ opacity: b, transform: `translateY(${(1 - b) * 160}px)` }}>
        {(sw) => <Captura src={CAP("home-tab")} srcW={1640} sw={sw} scroll={t * 1300} />}
      </Tablet>
      <Movil x={520} y={300} w={178} style={{ opacity: c, transform: `translateY(${(1 - c) * 200}px)` }}>
        {(sw) => <Captura src={CAP("home-mov")} srcW={1170} sw={sw} scroll={t * 2400} />}
      </Movil>
    </div>
  );
};

// Flecha dibujada a mano (como en la gráfica)
const Flecha: React.FC<{ x: number; y: number; desde: number }> = ({ x, y, desde }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [desde, desde + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const q = interpolate(frame, [desde + 14, desde + 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <svg width={260} height={220} viewBox="0 0 260 220" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <path
        d="M10 6 C 22 70, 80 132, 214 158"
        fill="none"
        stroke={NEGRO}
        strokeWidth={13}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      <path
        d="M150 104 C 180 118, 205 138, 218 158 C 190 168, 160 170, 128 168"
        fill="none"
        stroke={NEGRO}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - q}
      />
    </svg>
  );
};

const Pastilla: React.FC<{ texto: string; color: string; tinta?: string; desde: number; x: number; y: number; giro?: number }> = ({
  texto,
  color,
  tinta = "#fff",
  desde,
  x,
  y,
  giro = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, desde, 11, 170);
  if (frame < desde) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        background: color,
        color: tinta,
        fontFamily: JOST,
        fontWeight: 600,
        fontSize: 46,
        padding: "14px 34px",
        borderRadius: 60,
        transform: `scale(${s}) rotate(${giro}deg)`,
        boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// =============== 1 · Gancho: «Nueva web, más cercanía» ===============
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = sp(frame, fps, 0);
  const l2 = sp(frame, fps, 6);
  const sub = sp(frame, fps, 16);
  return (
    <AbsoluteFill>
      <Puntos />
      <div style={{ position: "absolute", left: 90, top: 250, right: 80, fontFamily: SERIF, fontWeight: 900, color: NEGRO, fontSize: 138, lineHeight: 0.98, letterSpacing: -1.5, wordSpacing: 6 }}>
        <div style={{ opacity: l1, transform: `translateY(${(1 - l1) * 50}px)` }}>Nueva web,</div>
        <div style={{ opacity: l2, transform: `translateY(${(1 - l2) * 50}px)` }}>más cercanía</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 550,
          right: 110,
          fontFamily: JOST,
          fontWeight: 400,
          fontSize: 54,
          lineHeight: 1.22,
          color: NEGRO,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
        }}
      >
        Lanzamos nueva web para que encuentres fácilmente todo lo que necesita tu centro
      </div>
      <Dispositivos x={40} y={930} delay={20} scrollHasta={150} />
      <Flecha x={50} y={800} desde={52} />
      {/* sincronizado: «Más fácil, más rápida y más cerca de ti» */}
      <Pastilla texto="Más fácil" color={C.lima} tinta={NEGRO} desde={66} x={70} y={1500} giro={-4} />
      <Pastilla texto="Más rápida" color={C.amarillo} tinta={NEGRO} desde={93} x={350} y={1530} giro={3} />
      <Pastilla texto="Más cerca de ti" color={C.rojo} desde={128} x={560} y={1470} giro={-3} />
    </AbsoluteFill>
  );
};

// =============== 2 · Catálogo: +200.000 referencias ===============
// Posiciones de la barra de categorías de la web (px CSS sobre 1440)
const CATEGORIAS = [
  { desde: 129, chip: "Material escolar", cap: "cat-papeleria", nav: [168, 82], color: C.lima, tinta: NEGRO },
  { desde: 162, chip: "Didáctico", cap: "cat-didactico", nav: [384, 222], color: C.amarillo, tinta: NEGRO },
  { desde: 186, chip: "Robótica", cap: "cat-robotica", nav: [645, 184], color: C.rojo, tinta: "#fff" },
  { desde: 212, chip: "Juegos", cap: "cat-didactico", nav: [384, 222], color: C.cian, tinta: "#fff" },
  { desde: 233, chip: "Libros", cap: "cat-libros", nav: [288, 62], color: C.lima, tinta: NEGRO },
  { desde: 250, chip: "Mobiliario", cap: "cat-mobiliario", nav: [862, 90], color: C.amarillo, tinta: NEGRO },
  { desde: 286, chip: "¡Y mucho más!", cap: "", nav: [0, 0], color: NEGRO, tinta: "#fff" },
];

const Contador: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, desde, 13, 150);
  const n = Math.round(interpolate(frame, [desde, desde + 26], [0, 200000], { ...clamp, easing: Easing.out(Easing.cubic) }));
  if (frame < desde) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 340, opacity: s, transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "left center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, lineHeight: 0.95, letterSpacing: -2, color: NEGRO }}>
        +{n.toLocaleString("de-DE")}
      </div>
      <div style={{ fontFamily: JOST, fontWeight: 500, fontSize: 60, color: NEGRO, marginTop: 6 }}>
        referencias para tu centro
      </div>
    </div>
  );
};

const Catalogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sp(frame, fps, 0);
  const lap = sp(frame, fps, 4, 16, 110);
  const activa = [...CATEGORIAS].reverse().find((c) => frame >= c.desde && c.cap);
  const cats = CATEGORIAS.filter((c) => c.cap);
  // zoom de cámara sobre la captura de categoría (centro CSS 720×380)
  const z = 1.3;
  return (
    <AbsoluteFill>
      <Puntos />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 250,
          right: 90,
          fontFamily: JOST,
          fontWeight: 500,
          fontSize: 56,
          lineHeight: 1.1,
          color: NEGRO,
          opacity: t,
          transform: `translateY(${(1 - t) * 40}px)`,
        }}
      >
        Todo lo que necesita tu centro
      </div>
      <Contador desde={78} />
      <Portatil x={95} y={720} w={890} style={{ opacity: lap, transform: `translateY(${(1 - lap) * 140}px)` }}>
        {(sw, sh) => {
          const s = sw / 1440; // escala CSS → pantalla sin zoom
          return (
            <>
              <Captura
                src={CAP("home-desk")}
                srcW={2880}
                sw={sw}
                scroll={interpolate(frame, [10, 125], [0, 1700], { ...clamp, easing: suave })}
              />
              {cats.map((c, i) => {
                const primera = cats.findIndex((x) => x.cap === c.cap) === i;
                if (!primera) return null;
                const visible = activa?.cap === c.cap;
                const desdeVis = CATEGORIAS.filter((x) => x.cap === c.cap)[0].desde;
                const op = visible ? interpolate(frame, [desdeVis, desdeVis + 5], [0, 1], clamp) : 0;
                const punch = visible ? 1 + 0.04 * (1 - sp(frame, fps, desdeVis, 12, 160)) : 1;
                const zz = z * punch;
                const cx = 720;
                const cy = 380;
                return (
                  <div
                    key={c.cap}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: sw,
                      height: sh,
                      opacity: op,
                      overflow: "hidden",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: sw / 2 - cx * s * zz,
                        top: sh / 2 - cy * s * zz,
                        width: 1440,
                        height: 900,
                        transform: `scale(${s * zz})`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <Img src={staticFile(CAP(c.cap))} style={{ width: 1440, height: 900, display: "block" }} />
                      {activa && activa.cap === c.cap ? (
                        <div
                          style={{
                            position: "absolute",
                            left: activa.nav[0] - 12,
                            top: 94,
                            width: activa.nav[1] + 24,
                            height: 34,
                            borderRadius: 18,
                            border: `4px solid ${activa.color === NEGRO ? C.amarillo : activa.color}`,
                            boxShadow: `0 0 0 8px ${activa.color}33`,
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </>
          );
        }}
      </Portatil>
      {/* chips de categorías, sincronizados con la locución */}
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1350,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {CATEGORIAS.map((c) => {
          const s = sp(frame, fps, c.desde, 11, 180);
          return (
            <div
              key={c.chip}
              style={{
                background: c.color,
                color: c.tinta,
                fontFamily: JOST,
                fontWeight: 600,
                fontSize: 46,
                padding: "12px 32px",
                borderRadius: 60,
                opacity: frame < c.desde ? 0 : 1,
                transform: `scale(${frame < c.desde ? 0 : s})`,
                boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
              }}
            >
              {c.chip}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== 3 · Área de cliente ===============
const IconoCarrito = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={NEGRO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2.2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20.5 7.5H6.2" />
    <circle cx="9.5" cy="19.5" r="1.3" fill={NEGRO} />
    <circle cx="17" cy="19.5" r="1.3" fill={NEGRO} />
  </svg>
);
const IconoDoc = () => (
  <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke={NEGRO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3h7l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19.5v-15A1.5 1.5 0 0 1 7 3z" />
    <path d="M9 10h6M9 13.5h6M9 17h6" />
  </svg>
);
const IconoDescarga = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={NEGRO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
);
const IconoEtiqueta = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={NEGRO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 3.5h6.5a1.5 1.5 0 0 1 1.5 1.5v6.5L11 21l-8-8z" transform="rotate(0)" />
    <circle cx="16.5" cy="7.5" r="1.2" fill={NEGRO} />
    <path d="M9 15l4-4" />
    <circle cx="9.3" cy="11.6" r="0.9" />
    <circle cx="12.6" cy="14.9" r="0.9" />
  </svg>
);

const VENTAJAS = [
  { desde: 50, hasta: 112, icono: <IconoCarrito />, texto: "Realizar y consultar pedidos" },
  { desde: 112, hasta: 174, icono: <IconoDoc />, texto: "Acceder a albaranes y facturas" },
  { desde: 174, hasta: 238, icono: <IconoDescarga />, texto: "Descargar presupuestos en PDF" },
  { desde: 238, hasta: 9999, icono: <IconoEtiqueta />, texto: "Consultar tus precios y descuentos personalizados" },
];

const Documento: React.FC<{ titulo: string; x: number; y: number; giro: number; desde: number }> = ({ titulo, x, y, giro, desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, desde, 13, 120);
  if (frame < desde) return null;
  const filas = [0, 1, 2, 3, 4, 5];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 330,
        height: 430,
        background: "linear-gradient(160deg, #FFFFFF, #F1F1F1)",
        borderRadius: 6,
        boxShadow: "0 24px 50px rgba(120,80,0,0.28)",
        padding: "34px 30px",
        boxSizing: "border-box",
        opacity: s,
        transform: `translate(${(1 - s) * 140}px, ${(1 - s) * 60}px) rotate(${giro + (1 - s) * 12}deg)`,
      }}
    >
      <div style={{ fontFamily: JOST, fontWeight: 700, fontSize: 42, color: "#2A2A2A" }}>{titulo}</div>
      <div style={{ marginTop: 10, width: 170, height: 10, borderRadius: 5, background: "#BDBDBD" }} />
      <div style={{ marginTop: 10, width: 130, height: 10, borderRadius: 5, background: "#CFCFCF" }} />
      <div style={{ marginTop: 30, border: "2px solid #D2D2D2", borderRadius: 4 }}>
        <div style={{ height: 22, background: "#BDBDBD" }} />
        {filas.map((f) => (
          <div key={f} style={{ display: "flex", gap: 14, padding: "8px 10px", borderTop: f ? "1px solid #E2E2E2" : undefined }}>
            <div style={{ width: 40, height: 7, borderRadius: 4, background: "#A8A8A8" }} />
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#C4C4C4" }} />
            <div style={{ width: 36, height: 7, borderRadius: 4, background: "#A8A8A8" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div style={{ width: 120, height: 26, borderRadius: 4, background: "#9E9E9E" }} />
      </div>
    </div>
  );
};

const Cliente: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = sp(frame, fps, 2, 12, 170);
  const t = sp(frame, fps, 8);
  const panel = sp(frame, fps, 14, 16, 110);
  const circulo = sp(frame, fps, 24, 18, 90);
  return (
    <AbsoluteFill>
      <Puntos />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 240,
          background: C.amarillo,
          color: NEGRO,
          fontFamily: JOST,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 4,
          padding: "10px 28px",
          borderRadius: 40,
          transform: `scale(${k})`,
          transformOrigin: "left center",
        }}
      >
        ÁREA DE CLIENTE
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 320,
          right: 90,
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1,
          letterSpacing: -1,
          color: NEGRO,
          opacity: t,
          transform: `translateY(${(1 - t) * 40}px)`,
        }}
      >
        Todo, a un clic
      </div>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 500,
          width: 980,
          height: 1060,
          borderRadius: 48,
          background: MELOCOTON,
          overflow: "hidden",
          opacity: panel,
          transform: `translateY(${(1 - panel) * 80}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 120,
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: C.amarillo,
            transform: `scale(${circulo})`,
          }}
        />
        <Documento titulo="Albarán" x={640} y={180} giro={0} desde={118} />
        <Documento titulo="Factura" x={650} y={480} giro={9} desde={150} />
        {VENTAJAS.map((v, i) => {
          const s = sp(frame, fps, v.desde, 13, 150);
          const activa = frame >= v.desde && frame < v.hasta;
          const pulso = activa ? 1 + 0.06 * Math.sin((frame - v.desde) / 4) * interpolate(frame - v.desde, [0, 30], [1, 0], clamp) : 1;
          return (
            <div
              key={v.texto}
              style={{
                position: "absolute",
                left: 40,
                top: 70 + i * 240,
                width: 590,
                display: "flex",
                alignItems: "flex-start",
                gap: 28,
                opacity: frame < v.desde ? 0 : s,
                transform: `translateX(${(1 - s) * -80}px)`,
              }}
            >
              <div
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: 58,
                  background: C.amarillo,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${pulso})`,
                  boxShadow: activa ? `0 0 0 12px ${C.amarillo}40` : "none",
                }}
              >
                {v.icono}
              </div>
              <div style={{ fontFamily: JOST, fontWeight: 600, fontSize: 50, lineHeight: 1.12, color: NEGRO, paddingTop: 4 }}>
                {v.texto}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== 4 · Cierre ===============
const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = sp(frame, fps, 2);
  const l2 = sp(frame, fps, 10);
  const logos = sp(frame, fps, 30);
  return (
    <AbsoluteFill style={{ background: CREMA }}>
      <Puntos />
      <div style={{ position: "absolute", left: 90, top: 260, right: 80, fontFamily: SERIF, fontWeight: 900, color: NEGRO, fontSize: 138, lineHeight: 0.98, letterSpacing: -1.5, wordSpacing: 6 }}>
        <div style={{ opacity: l1, transform: `translateY(${(1 - l1) * 50}px)` }}>¡Entra ya</div>
        <div style={{ opacity: l2, transform: `translateY(${(1 - l2) * 50}px)` }}>y descúbrela!</div>
      </div>
      <Dispositivos x={40} y={640} delay={0} scrollHasta={95} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", opacity: logos, transform: `translateY(${(1 - logos) * 30}px)` }}>
        <Img src={staticFile("marca/logos-azarbe-ude-transp.png")} style={{ height: 100 }} />
      </div>
    </AbsoluteFill>
  );
};

export const Lanzamiento: React.FC = () => {
  const escenas: [keyof typeof DUR, React.FC][] = [
    ["hook", Gancho],
    ["catalogo", Catalogo],
    ["cliente", Cliente],
    ["cierre", Cierre],
  ];
  return (
    <AbsoluteFill style={{ background: CREMA }}>
      <FuentesLanzamiento />
      <Series>
        {escenas.map(([k, Comp]) => (
          <Series.Sequence key={k} durationInFrames={DUR[k]}>
            <Escena dur={DUR[k]}>
              <Comp />
            </Escena>
          </Series.Sequence>
        ))}
      </Series>
      <Sequence from={RETRASO_VOZ}>
        <Audio src={staticFile("audio/004-lanzamiento-voz-a-norm.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
