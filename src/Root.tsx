import { Composition } from "remotion";
import { FlujoRegistro, DURACION_FLUJO_REGISTRO } from "./videos/001-flujo-registro/FlujoRegistro";
import { AccesoAzarbe, DURACION_ACCESO_AZARBE } from "./videos/002-acceso-azarbe/AccesoAzarbe";
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
        component={AccesoAzarbe}
        durationInFrames={DURACION_ACCESO_AZARBE}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
