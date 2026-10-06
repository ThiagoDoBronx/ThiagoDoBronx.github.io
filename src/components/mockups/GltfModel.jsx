import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { assetUrl } from './shared';

const TARGET_HEIGHT = 3.3;

/** Any .glb, centred and normalised to the same height as the other mockups. */
export default function GltfModel({ path }) {
  const { scene } = useGLTF(assetUrl(path), true);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(TARGET_HEIGHT / Math.max(size.y, 1e-6));
    return wrapper;
  }, [scene]);
  return <primitive object={object} />;
}
