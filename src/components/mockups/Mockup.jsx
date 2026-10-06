import { useTexture } from '@react-three/drei';
import { assetUrl } from './shared';
import AcrylicStand from './AcrylicStand';
import EmbossedStand from './EmbossedStand';
import GltfModel from './GltfModel';
import SquarePlaque from './SquarePlaque';

/** Renders one product mockup from its entry in product.json → models. */
export default function Mockup({ model }) {
  switch (model.type) {
    case 'square':
      return <SquarePlaque texture={model.texture} />;
    case 'glb':
      return <GltfModel path={model.path} />;
    case 'embossed':
      return <EmbossedStand finish={model.finish} />;
    case 'stand':
    default:
      return <AcrylicStand texture={model.texture} />;
  }
}

/** Starts downloading every model's texture so switching is instant. */
export function preloadMockups(models) {
  models.forEach((m) => m.texture && useTexture.preload(assetUrl(m.texture)));
}
