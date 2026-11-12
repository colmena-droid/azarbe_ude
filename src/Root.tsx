import { Composition } from "remotion";
import { FlujoRegistro, DURACION_FLUJO_REGISTRO } from "./videos/001-flujo-registro/FlujoRegistro";
import { AccesoMarca, duracionTotal } from "./videos/acceso/AccesoMarca";
import { AZARBE } from "./videos/002-acceso-azarbe/marca";
import { UDE } from "./videos/003-acceso-ude/marca";
import { Lanzamiento, DURACION_LANZAMIENTO } from "./videos/004-lanzamiento-web/Lanzamiento";
import { FPS, H, W } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="001-flujo-registro"
        component={FlujoRegistro}
        durationInFrames={DURACION_FLUJO_REGISTRO}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="002-acceso-azarbe"
        component={AccesoMarca}
        defaultProps={{ marca: AZARBE }}
        durationInFrames={duracionTotal(AZARBE)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="003-acceso-ude"
        component={AccesoMarca}
        defaultProps={{ marca: UDE }}
        durationInFrames={duracionTotal(UDE)}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="004-lanzamiento-web"
        component={Lanzamiento}
        durationInFrames={DURACION_LANZAMIENTO}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
