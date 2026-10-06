import { useTexture } from '@react-three/drei';
import { assetUrl } from './shared';
import AcrylicStand from './AcrylicStand';
import BusinessCard from './BusinessCard';
import EmbossedStand from './EmbossedStand';
import GltfModel from './GltfModel';
import SquarePlaque from './SquarePlaque';

/** Renders one product mockup from its entry in product.json → models. */
export default function Mockup({ model }) {
  // Optional per-model size tweak so wide pieces read the same size as the rest.
  return (
    <group scale={model.scale ?? 1}>
      <MockupBody model={model} />
    </group>
  );
}

function MockupBody({ model }) {
  switch (model.type) {
    case 'square':
    case 'plaque':
      return <SquarePlaque texture={model.texture} backing={model.backing} />;
    case 'card':
      return <BusinessCard texture={model.texture} />;
    case 'glb':
      return <GltfModel path={model.path} />;
    case 'embossed':
      return <EmbossedStand finish={model.finish} />;
    case 'stand':
    default:
      return <AcrylicStand texture={model.texture} finish={model.finish} />;
  }
}

/** Starts downloading every model's texture so switching is instant. */
export function preloadMockups(models) {
  models.forEach((m) => m.texture && useTexture.preload(assetUrl(m.texture)));
}
