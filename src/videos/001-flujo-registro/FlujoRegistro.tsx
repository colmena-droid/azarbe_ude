import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
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

// Capturas reales de https://abacuseducacion.es (1440 px CSS de ancho, @2x)
const INICIO = "capturas/01-inicio.png"; // 1440×900
const LOGIN = "capturas/02-iniciar-sesion.png"; // 1440×900
const REGISTRO = "capturas/03-crear-cuenta.png"; // 1440×1825 (página completa)

// Ventana del navegador dentro del vídeo
const NAV = { x: 40, y: 590, w: 1000, h: 1010 };
const FIT = NAV.w / 1440; // zoom para ver la página entera de ancho

const DUR = {
  intro: 105,
  paso1: 165,
  paso2a: 210,
  paso2b: 150,
  paso3: 300,
  paso4: 150,
  cierre: 120,
};
export const DURACION_FLUJO_REGISTRO = Object.values(DUR).reduce((a, b) => a + b, 0);

const Resaltado: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.cian }) => (
  <span style={{ color }}>{children}</span>
);

// ---------------- Intro ----------------
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entrada(frame, fps, 0);
  const t1 = entrada(frame, fps, 10);
  const t2 = entrada(frame, fps, 22);
  const t3 = entrada(frame, fps, 34);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FUENTE, color: C.tinta }}>
      <Img
        src={staticFile("marca/logos-azarbe-ude.png")}
        style={{ width: 820, transform: `scale(${logo})`, marginBottom: 110, mixBlendMode: "multiply" }}
      />
      <div
        style={{
          fontSize: 50,
          fontWeight: 600,
          color: C.gris,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
        }}
      >
        Nueva web
      </div>
      <div
        style={{
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: -2.5,
          lineHeight: 1.02,
          textAlign: "center",
          marginTop: 18,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 40}px)`,
        }}
      >
        ¿Cómo <Resaltado>inicio sesión</Resaltado>
        <br />o me <Resaltado color={C.rojo}>registro</Resaltado>?
      </div>
      <div
        style={{
          marginTop: 56,
          background: C.tinta,
          color: "#fff",
          fontSize: 40,
          fontWeight: 700,
          padding: "18px 40px",
          borderRadius: 50,
          opacity: t3,
          transform: `scale(${0.8 + 0.2 * t3})`,
        }}
      >
        Te lo enseñamos paso a paso 👇
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Paso 1: botón «Inicia sesión» ----------------
const Paso1: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 1"
      titulo={
        <>
          Pulsa <Resaltado color={C.azulWeb}>«Inicia sesión»</Resaltado>
        </>
      }
      sub="Arriba a la derecha, en abacuseducacion.es"
    />
    <Navegador
      src={INICIO}
      anchoPagina={1440}
      altoPagina={900}
      url="abacuseducacion.es"
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 450, z: FIT },
        { f: 25, cx: 720, cy: 450, z: FIT },
        { f: 85, cx: 1050, cy: 250, z: 1.85 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={1016} y={21} w={121} h={32} desde={95} />
          <Cursor
            z={z}
            aparece={40}
            puntos={[
              { f: 40, x: 860, y: 380 },
              { f: 95, x: 1070, y: 40 },
            ]}
            clics={[110]}
          />
        </>
      )}
    </Navegador>
  </AbsoluteFill>
);

// ---------------- Paso 2A: ya tienes cuenta ----------------
const Paso2A: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 2 · YA TENGO CUENTA"
      titulo={
        <>
          Escribe tu <Resaltado>correo</Resaltado> y <Resaltado>contraseña</Resaltado>
        </>
      }
      sub="Y pulsa «Iniciar sesión»"
    />
    <Navegador
      src={LOGIN}
      anchoPagina={1440}
      altoPagina={900}
      url="abacuseducacion.es/es/sign-in"
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 450, z: FIT },
        { f: 12, cx: 720, cy: 450, z: FIT },
        { f: 45, cx: 432, cy: 345, z: 1.55 },
      ]}
    >
      {(z) => (
        <>
          <Escribe x={166} y={242} texto="secretaria@micole.es" desde={64} porFrame={0.75} />
          <Escribe x={166} y={332} texto="contrasena" desde={100} porFrame={0.6} oculto />
          <Resalte z={z} x={152} y={423} w={560} h={30} desde={130} radio={16} />
          <Cursor
            z={z}
            aparece={42}
            puntos={[
              { f: 42, x: 520, y: 560 },
              { f: 58, x: 330, y: 268 },
              { f: 90, x: 330, y: 268 },
              { f: 98, x: 330, y: 358 },
              { f: 125, x: 330, y: 358 },
              { f: 145, x: 440, y: 440 },
            ]}
            clics={[60, 98, 160]}
          />
        </>
      )}
    </Navegador>
  </AbsoluteFill>
);

// ---------------- Paso 2B: eres nuevo ----------------
const Paso2B: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 2 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Pulsa <Resaltado color={C.rojo}>«Regístrate»</Resaltado>
        </>
      }
      sub="En la misma pantalla, en «Nuevo usuario»"
    />
    <Navegador
      src={LOGIN}
      anchoPagina={1440}
      altoPagina={900}
      url="abacuseducacion.es/es/sign-in"
      {...NAV}
      claves={[
        { f: 0, cx: 432, cy: 345, z: 1.55 },
        { f: 35, cx: 900, cy: 300, z: 1.6 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={728} y={248} w={390} h={30} desde={60} radio={16} color={C.rojo} />
          <Cursor
            z={z}
            aparece={15}
            puntos={[
              { f: 15, x: 720, y: 450 },
              { f: 65, x: 925, y: 264 },
            ]}
            clics={[80]}
          />
        </>
      )}
    </Navegador>
  </AbsoluteFill>
);

// ---------------- Paso 3: formulario «Crear una cuenta» ----------------
const GRUPOS = [
  { desde: 15, hasta: 80, y: 273, h: 171, color: C.cian, texto: "Datos del centro: CIF y nombre" },
  { desde: 85, hasta: 150, y: 454, h: 261, color: C.lima, texto: "Tus datos: nombre, apellido y correo" },
  { desde: 155, hasta: 225, y: 725, h: 443, color: C.amarillo, texto: "Dirección: país, calle, número, ciudad y C.P." },
  { desde: 230, hasta: 298, y: 1179, h: 266, color: C.rojo, texto: "Opcional: teléfono y mensaje" },
];

const EtiquetaGrupo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = GRUPOS.find((x) => frame >= x.desde - 5 && frame < x.hasta) ?? GRUPOS[GRUPOS.length - 1];
  const i = GRUPOS.indexOf(g);
  const s = spring({ frame: frame - (g.desde - 5), fps, config: { damping: 15, stiffness: 160 } });
  const out = interpolate(frame, [g.hasta - 6, g.hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = i === GRUPOS.length - 1 ? 1 : out;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
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

const Paso3: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 3 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Rellena el formulario <Resaltado color={C.rojo}>«Crear una cuenta»</Resaltado>
        </>
      }
    />
    <Navegador
      src={REGISTRO}
      anchoPagina={1440}
      altoPagina={1825}
      url="abacuseducacion.es/es/login/register"
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 340, z: 1.5 },
        { f: 20, cx: 720, cy: 400, z: 1.5 },
        { f: 85, cx: 720, cy: 400, z: 1.5 },
        { f: 105, cx: 720, cy: 600, z: 1.5 },
        { f: 155, cx: 720, cy: 600, z: 1.5 },
        { f: 178, cx: 720, cy: 960, z: 1.5 },
        { f: 228, cx: 720, cy: 960, z: 1.5 },
        { f: 250, cx: 720, cy: 1320, z: 1.5 },
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

// ---------------- Paso 4: «Registrarse» ----------------
const Listo: React.FC<{ desde: number }> = ({ desde }) => {
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
        top: NAV.y + 330,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${s})`,
      }}
    >
      <div
        style={{
          background: C.blanco,
          borderRadius: 40,
          padding: "40px 70px",
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
        <div style={{ marginTop: 24, fontSize: 60, fontWeight: 900, color: C.tinta }}>¡Listo!</div>
      </div>
    </div>
  );
};

const Paso4: React.FC = () => (
  <AbsoluteFill>
    <CabeceraPaso
      paso="PASO 4 · SOY NUEVO"
      color={C.rojo}
      titulo={
        <>
          Pulsa <Resaltado color={C.azulWeb}>«Registrarse»</Resaltado>
        </>
      }
      sub="Al final del formulario"
    />
    <Navegador
      src={REGISTRO}
      anchoPagina={1440}
      altoPagina={1825}
      url="abacuseducacion.es/es/login/register"
      {...NAV}
      claves={[
        { f: 0, cx: 720, cy: 1320, z: 1.5 },
        { f: 30, cx: 720, cy: 1430, z: 1.7 },
      ]}
    >
      {(z) => (
        <>
          <Resalte z={z} x={432} y={1455} w={576} h={48} desde={62} hasta={100} />
          <Cursor
            z={z}
            aparece={28}
            puntos={[
              { f: 28, x: 900, y: 1330 },
              { f: 70, x: 722, y: 1481 },
            ]}
            clics={[84]}
          />
        </>
      )}
    </Navegador>
    <Listo desde={96} />
  </AbsoluteFill>
);

// ---------------- Cierre ----------------
const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 0);
  const b = entrada(frame, fps, 10);
  const c = entrada(frame, fps, 22);
  const d = entrada(frame, fps, 34);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FUENTE, color: C.tinta }}>
      <Img src={staticFile("marca/logos-azarbe-ude.png")} style={{ width: 800, transform: `scale(${a})`, mixBlendMode: "multiply" }} />
      <div
        style={{
          marginTop: 110,
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.05,
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
        }}
      >
        Haz tus pedidos
        <br />
        en la <Resaltado>nueva web</Resaltado>
      </div>
      <div
        style={{
          marginTop: 60,
          background: C.azulWeb,
          color: "#fff",
          fontSize: 54,
          fontWeight: 800,
          padding: "24px 56px",
          borderRadius: 60,
          transform: `scale(${c})`,
          boxShadow: "0 20px 50px rgba(74,157,224,0.4)",
        }}
      >
        abacuseducacion.es
      </div>
      <div style={{ marginTop: 44, fontSize: 40, fontWeight: 600, color: C.gris, opacity: d }}>
        Inicia sesión&nbsp;&nbsp;·&nbsp;&nbsp;Regístrate
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Barra de progreso ----------------
const Progreso: React.FC = () => {
  const frame = useCurrentFrame();
  const p = frame / DURACION_FLUJO_REGISTRO;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: "100%", background: "rgba(16,34,46,0.06)" }}>
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${C.cian}, ${C.lima}, ${C.amarillo}, ${C.rojo})`,
        }}
      />
    </div>
  );
};

export const FlujoRegistro: React.FC = () => {
  const escenas: [keyof typeof DUR, React.FC, boolean][] = [
    ["intro", Intro, false],
    ["paso1", Paso1, true],
    ["paso2a", Paso2A, true],
    ["paso2b", Paso2B, true],
    ["paso3", Paso3, true],
    ["paso4", Paso4, true],
    ["cierre", Cierre, false],
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FUENTE }}>
      <Fuentes />
      <Fondo />
      <Series>
        {escenas.map(([k, Comp, logos]) => (
          <Series.Sequence key={k} durationInFrames={DUR[k]}>
            <Escena dur={DUR[k]}>
              <Comp />
              {logos ? <PieLogos /> : null}
            </Escena>
          </Series.Sequence>
        ))}
      </Series>
      <Progreso />
    </AbsoluteFill>
  );
};
