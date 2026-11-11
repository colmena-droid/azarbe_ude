import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FUENTE } from "../../config";
import {
  CabeceraPaso,
  Cursor,
  entrada,
  Escena,
  Escribe,
  Fondo,
  Fuentes,
  Navegador,
  PieLogos,
  Resalte,
} from "../../componentes";

// Plantilla · Cómo acceder a la nueva web (Azarbe / UDE → abacuseducacion.es)
// Locución: ElevenLabs, voz «Lydia» (español peninsular), toma A.
// Los cortes de escena están sincronizados con las pausas de la locución.

export type Marca = {
  nombre: string; // como se escribe en pantalla
  url: string; // por marca se muestra siempre su dominio (azarbe.es / ude.es)
  logo: string;
  voz: string;
  retrasoVoz: number; // frames antes de que empiece a hablar
  desfasePaso1: number; // ajuste (frames) del zoom/clic a «Inicia sesión» según la locución
  dur: Record<Escena, number>;
};

export type Escena =
  | "intro"
  | "paso1"
  | "cliente"
  | "nuevo"
  | "aviso"
  | "formulario"
  | "registrarse"
  | "ventajas"
  | "cierre";

const MarcaCtx = createContext<Marca | null>(null);
const useMarca = () => {
  const m = useContext(MarcaCtx);
  if (!m) throw new Error("Falta <MarcaCtx.Provider>");
  return m;
};
export const duracionTotal = (m: Marca) => Object.values(m.dur).reduce((a, b) => a + b, 0);

const INICIO = "capturas/01-inicio.png"; // 1440×900
const LOGIN = "capturas/02-iniciar-sesion.png"; // 1440×900
const REGISTRO = "capturas/03-crear-cuenta.png"; // 1440×1825

const NAV = { x: 40, y: 590, w: 1000, h: 1010 };
const FIT = NAV.w / 1440;

const R: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.cian }) => (
  <span style={{ color }}>{children}</span>
);

// ---------------- 1 · Intro ----------------
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entrada(frame, fps, 0);
  const t1 = entrada(frame, fps, 8);
  const t2 = entrada(frame, fps, 70);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FUENTE, color: C.tinta }}>
      <Img src={staticFile(useMarca().logo)} style={{ width: 760, transform: `scale(${logo})`, marginBottom: 120 }} />
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          letterSpacing: -2.5,
          lineHeight: 1.04,
          textAlign: "center",
          opacity: t1,
          transform: `translateY(${(1 - t1) * 40}px)`,
        }}
      >
        ¿Quieres acceder
        <br />a la <R>nueva web</R>
        <br />
        de {useMarca().nombre}?
      </div>
      <div
        style={{
          marginTop: 60,
          background: C.tinta,
          color: "#fff",
          fontSize: 42,
          fontWeight: 700,
          padding: "18px 42px",
          borderRadius: 50,
          opacity: t2,
          transform: `scale(${0.8 + 0.2 * t2})`,
        }}
      >
        Te explicamos cómo 👇
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 2 · Paso 1: dominio → «Inicia sesión» ----------------
const Paso1: React.FC = () => {
  const d = useMarca().desfasePaso1;
  return (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 1"
      titulo={
        <>
          Entra en <R>{useMarca().url}</R>
        </>
      }
      sub={
        <>
          Y pulsa <b style={{ color: C.azulWeb }}>«Inicia sesión»</b>, arriba a la derecha
        </>
      }
      retrasoSub={125 + d}
    />
    <Navegador
      src={INICIO}
      anchoPagina={1440}
      altoPagina={900}
      url={useMarca().url}
      urlEscrita={{ desde: 14, porFrame: 0.4 }}
      cargaEn={50}
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 450, z: FIT },
        { f: 130 + d, cx: 720, cy: 450, z: FIT },
        { f: 170 + d, cx: 1050, cy: 250, z: 1.85 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={1016} y={21} w={121} h={32} desde={178 + d} />
          <Cursor
            z={z}
            aparece={140 + d}
            puntos={[
              { f: 140 + d, x: 860, y: 380 },
              { f: 185 + d, x: 1070, y: 40 },
            ]}
            clics={[195 + d]}
          />
        </>
      )}
    </Navegador>
  </AbsoluteFill>
  );
};

// ---------------- 3 · Paso 2: ya soy cliente ----------------
const AvisoCorreo: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - desde, fps, config: { damping: 13, stiffness: 150 } });
  if (frame < desde) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: NAV.y + NAV.h - 330,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})`,
        opacity: s,
        background: C.tinta,
        color: "#fff",
        borderRadius: 30,
        padding: "30px 36px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        fontFamily: FUENTE,
        boxShadow: "0 20px 50px rgba(16,34,46,0.35)",
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 26,
          background: C.amarillo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 62,
          flexShrink: 0,
        }}
      >
        ✉️
      </div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.amarillo, letterSpacing: 1 }}>LA PRIMERA VEZ</div>
        <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.18, marginTop: 6 }}>
          Te llegará un correo para crear tu nueva contraseña
        </div>
      </div>
    </div>
  );
};

const Cliente: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 2 · YA SOY CLIENTE"
      titulo={
        <>
          Accede con el <R>correo</R> de tu cuenta
        </>
      }
    />
    <Navegador
      src={LOGIN}
      anchoPagina={1440}
      altoPagina={900}
      url={useMarca().url}
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 450, z: FIT },
        { f: 6, cx: 720, cy: 450, z: FIT },
        { f: 36, cx: 432, cy: 330, z: 1.55 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={152} y={242} w={560} h={48} desde={30} hasta={130} radio={6} />
          <Escribe x={166} y={242} texto="secretaria@micole.es" desde={52} porFrame={0.6} />
          <Cursor
            z={z}
            aparece={30}
            puntos={[
              { f: 30, x: 520, y: 520 },
              { f: 46, x: 330, y: 268 },
            ]}
            clics={[48]}
          />
        </>
      )}
    </Navegador>
    <AvisoCorreo desde={148} />
  </AbsoluteFill>
);

// ---------------- 4 · Paso 2: soy nuevo ----------------
const Nuevo: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 2 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Pulsa <R color={C.rojo}>«Regístrate»</R>
        </>
      }
      sub="En la misma pantalla, en «Nuevo usuario»"
    />
    <Navegador
      src={LOGIN}
      anchoPagina={1440}
      altoPagina={900}
      url={useMarca().url}
      {...NAV}
      claves={[
        { f: 0, cx: 432, cy: 330, z: 1.55 },
        { f: 30, cx: 900, cy: 300, z: 1.6 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={728} y={248} w={390} h={30} desde={58} radio={16} color={C.rojo} />
          <Cursor
            z={z}
            aparece={12}
            puntos={[
              { f: 12, x: 720, y: 450 },
              { f: 60, x: 925, y: 264 },
            ]}
            clics={[76]}
          />
        </>
      )}
    </Navegador>
  </AbsoluteFill>
);

// ---------------- 5 · Aviso: 2 años sin comprar ----------------
const Aviso: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 6);
  const b = entrada(frame, fps, 16);
  const c = entrada(frame, fps, 70);
  const bote = 1 + 0.04 * Math.sin(frame / 6) * interpolate(frame, [0, 30, 60], [0, 1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FUENTE, color: C.tinta, padding: 70 }}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          background: C.amarillo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 120,
          fontWeight: 900,
          color: C.tinta,
          transform: `scale(${a * bote})`,
          boxShadow: `0 0 0 24px ${C.amarillo}40`,
        }}
      >
        !
      </div>
      <div style={{ marginTop: 70, fontSize: 46, fontWeight: 800, letterSpacing: 4, color: C.amarillo, opacity: b, WebkitTextStroke: `1px ${C.tinta}22` }}>
        RECUERDA
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
        }}
      >
        ¿Llevas <R color={C.rojo}>2 años</R>
        <br />
        sin comprar?
      </div>
      <div
        style={{
          marginTop: 50,
          background: C.blanco,
          borderRadius: 30,
          padding: "30px 44px",
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.25,
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(16,34,46,0.12)",
          opacity: c,
          transform: `scale(${0.85 + 0.15 * c})`,
        }}
      >
        Tendrás que <R color={C.rojo}>registrarte de nuevo</R>,
        <br />
        aunque ya tuvieras cuenta
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 6 · Paso 3: formulario ----------------
const GRUPOS = [
  { desde: 118, hasta: 198, y: 273, h: 171, color: C.cian, texto: "Datos del centro: CIF y nombre" },
  { desde: 203, hasta: 268, y: 454, h: 261, color: C.lima, texto: "Tus datos: nombre, apellido y correo" },
  { desde: 273, hasta: 343, y: 725, h: 443, color: C.amarillo, texto: "Dirección: país, calle, número, ciudad y C.P." },
  { desde: 348, hasta: 420, y: 1179, h: 266, color: C.rojo, texto: "Opcional: teléfono y mensaje" },
];

const EtiquetaGrupo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < GRUPOS[0].desde - 5) return null;
  const g = GRUPOS.find((x) => frame >= x.desde - 5 && frame < x.hasta) ?? GRUPOS[GRUPOS.length - 1];
  const i = GRUPOS.indexOf(g);
  const s = spring({ frame: frame - (g.desde - 5), fps, config: { damping: 15, stiffness: 160 } });
  const out = interpolate(frame, [g.hasta - 6, g.hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = i === GRUPOS.length - 1 ? 1 : out;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: NAV.y + NAV.h - 140,
        display: "flex",
        justifyContent: "center",
        opacity: op,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`,
      }}
    >
      <div
        style={{
          background: C.tinta,
          color: "#fff",
          fontFamily: FUENTE,
          fontSize: 36,
          fontWeight: 700,
          padding: "20px 34px",
          borderRadius: 26,
          display: "flex",
          alignItems: "center",
          gap: 18,
          boxShadow: "0 16px 40px rgba(16,34,46,0.3)",
        }}
      >
        <span
          style={{
            background: g.color,
            color: C.tinta,
            width: 52,
            height: 52,
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {i + 1}
        </span>
        {g.texto}
      </div>
    </div>
  );
};

const Formulario: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 3 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Completa tus datos y los de tu <R color={C.rojo}>centro</R>
        </>
      }
      sub="Para centros educativos, autónomos y profesionales del sector educativo"
      retrasoSub={200}
    />
    <Navegador
      src={REGISTRO}
      anchoPagina={1440}
      altoPagina={1825}
      url={useMarca().url}
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 760, z: 0.72 },
        { f: 100, cx: 720, cy: 800, z: 0.72 },
        { f: 125, cx: 720, cy: 400, z: 1.5 },
        { f: 200, cx: 720, cy: 400, z: 1.5 },
        { f: 218, cx: 720, cy: 600, z: 1.5 },
        { f: 270, cx: 720, cy: 600, z: 1.5 },
        { f: 290, cx: 720, cy: 960, z: 1.5 },
        { f: 345, cx: 720, cy: 960, z: 1.5 },
        { f: 365, cx: 720, cy: 1320, z: 1.5 },
      ]}
    >
      {(z) => (
        <>
          {GRUPOS.map((g) => (
            <Resalte key={g.y} z={z} x={432} y={g.y} w={576} h={g.h} desde={g.desde} hasta={g.hasta} color={g.color} />
          ))}
        </>
      )}
    </Navegador>
    <EtiquetaGrupo />
  </AbsoluteFill>
);

// ---------------- 7 · Paso 4: «Registrarse» ----------------
const Enviada: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - desde, fps, config: { damping: 11, stiffness: 150 } });
  if (frame < desde) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: NAV.y + 280,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${s})`,
      }}
    >
      <div
        style={{
          background: C.blanco,
          borderRadius: 40,
          padding: "44px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 30px 80px rgba(16,34,46,0.25)",
          fontFamily: FUENTE,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            background: C.lima,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24">
            <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ marginTop: 24, fontSize: 56, fontWeight: 900, color: C.tinta }}>Solicitud enviada</div>
        <div style={{ marginTop: 10, fontSize: 36, fontWeight: 600, color: C.gris }}>Pendiente de validación</div>
      </div>
    </div>
  );
};

const Registrarse: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 4 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Pulsa <R color={C.azulWeb}>«Registrarse»</R>
        </>
      }
      sub="Y validaremos tu solicitud"
      retrasoSub={30}
    />
    <Navegador
      src={REGISTRO}
      anchoPagina={1440}
      altoPagina={1825}
      url={useMarca().url}
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 1320, z: 1.5 },
        { f: 18, cx: 720, cy: 1300, z: 1.7 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={432} y={1455} w={576} h={48} desde={22} hasta={56} />
          <Cursor
            z={z}
            aparece={6}
            puntos={[
              { f: 6, x: 900, y: 1330 },
              { f: 30, x: 722, y: 1481 },
            ]}
            clics={[38]}
          />
        </>
      )}
    </Navegador>
    <Enviada desde={50} />
  </AbsoluteFill>
);

// ---------------- 8 · Ventajas ----------------
const VENTAJAS = [
  { desde: 88, icono: "💶", texto: "Consultar precios", color: C.cian },
  { desde: 118, icono: "🏷️", texto: "Descuentos personalizados", color: C.lima },
  { desde: 158, icono: "🛒", texto: "Realizar tus compras", color: C.rojo },
];

const Ventajas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = entrada(frame, fps, 4);
  return (
    <AbsoluteFill style={{ fontFamily: FUENTE, color: C.tinta, alignItems: "center", paddingTop: 300 }}>
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1.06,
          textAlign: "center",
          opacity: t,
          transform: `translateY(${(1 - t) * 40}px)`,
        }}
      >
        Una vez hayas
        <br />
        <R>iniciado sesión</R>, podrás:
      </div>
      <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 36, width: 880 }}>
        {VENTAJAS.map((v) => {
          const s = spring({ frame: frame - v.desde, fps, config: { damping: 14, stiffness: 150 } });
          return (
            <div
              key={v.texto}
              style={{
                background: C.blanco,
                borderRadius: 32,
                padding: "30px 36px",
                display: "flex",
                alignItems: "center",
                gap: 34,
                boxShadow: "0 18px 44px rgba(16,34,46,0.12)",
                borderLeft: `14px solid ${v.color}`,
                opacity: s,
                transform: `translateX(${(1 - s) * 120}px)`,
              }}
            >
              <div style={{ fontSize: 76 }}>{v.icono}</div>
              <div style={{ fontSize: 52, fontWeight: 800 }}>{v.texto}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 9 · Cierre ----------------
const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 0);
  const b = entrada(frame, fps, 6);
  const c = entrada(frame, fps, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FUENTE, color: C.tinta }}>
      <Img src={staticFile(useMarca().logo)} style={{ width: 760, transform: `scale(${a})` }} />
      <div
        style={{
          marginTop: 110,
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
        }}
      >
        ¡Visita la
        <br />
        <R>nueva web</R>!
      </div>
      <div
        style={{
          marginTop: 64,
          background: C.cian,
          color: "#fff",
          fontSize: 66,
          fontWeight: 800,
          padding: "26px 70px",
          borderRadius: 70,
          transform: `scale(${c})`,
          boxShadow: `0 20px 50px ${C.cian}66`,
        }}
      >
        {useMarca().url}
      </div>
    </AbsoluteFill>
  );
};

const Progreso: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: "100%", background: "rgba(16,34,46,0.06)" }}>
      <div
        style={{
          height: "100%",
          width: `${(frame / duracionTotal(useMarca())) * 100}%`,
          background: `linear-gradient(90deg, ${C.cian}, ${C.lima}, ${C.amarillo}, ${C.rojo})`,
        }}
      />
    </div>
  );
};

export const AccesoMarca: React.FC<{ marca: Marca }> = ({ marca }) => {
  const escenas: [Escena, React.FC, boolean][] = [
    ["intro", Intro, false],
    ["paso1", Paso1, true],
    ["cliente", Cliente, true],
    ["nuevo", Nuevo, true],
    ["aviso", Aviso, true],
    ["formulario", Formulario, true],
    ["registrarse", Registrarse, true],
    ["ventajas", Ventajas, true],
    ["cierre", Cierre, false],
  ];
  return (
    <MarcaCtx.Provider value={marca}>
    <AbsoluteFill style={{ fontFamily: FUENTE }}>
      <Fuentes />
      <Fondo />
      <Series>
        {escenas.map(([k, Comp, logo]) => (
          <Series.Sequence key={k} durationInFrames={marca.dur[k]}>
            <Escena dur={marca.dur[k]}>
              <Comp />
              {logo ? <PieLogos src={marca.logo} alto={84} /> : null}
            </Escena>
          </Series.Sequence>
        ))}
      </Series>
      <Sequence from={marca.retrasoVoz}>
        <Audio src={staticFile(marca.voz)} />
      </Sequence>
      <Progreso />
    </AbsoluteFill>
    </MarcaCtx.Provider>
  );
};
