import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, useGLTF } from '@react-three/drei';
import { intro, pose } from '../lib/choreography';
import AcrylicStand from './AcrylicStand';

const TARGET_HEIGHT = 3.4;

/** Procedural bottle used when the product has no .glb yet. */
function ProceduralBottle({ paper, ink }) {
  const bodyGeometry = useMemo(() => {
    const pts = [new THREE.Vector2(0, -1.7)];
    // Rounded base.
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
      pts.push(new THREE.Vector2(0.8 + 0.15 * Math.cos(a), -1.55 + 0.15 * Math.sin(a)));
    }
    pts.push(new THREE.Vector2(0.95, 0.4));
    // Shoulder into the neck.
    const shoulder = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(0.95, 0.4),
      new THREE.Vector2(0.95, 0.95),
      new THREE.Vector2(0.34, 0.98),
    );
    pts.push(...shoulder.getPoints(24).slice(1));
    pts.push(new THREE.Vector2(0.34, 1.2), new THREE.Vector2(0, 1.2));
    return new THREE.LatheGeometry(pts, 128);
  }, []);

  return (
    <group>
      <mesh geometry={bodyGeometry} castShadow>
        <meshPhysicalMaterial
          color={ink}
          roughness={0.12}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.06}
          transmission={0.2}
          thickness={1}
          ior={1.5}
        />
      </mesh>
      {/* Matte sleeve */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.958, 0.958, 1.05, 128, 1, true]} />
        <meshStandardMaterial color={paper} emissive={paper} emissiveIntensity={0.35} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.958, 0.008, 12, 128]} />
        <meshStandardMaterial color={ink} roughness={0.4} />
      </mesh>
      {/* Brushed metal cap */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 96]} />
        <meshPhysicalMaterial color="#cfc9bf" metalness={1} roughness={0.32} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 1.71, 0]}>
        <cylinderGeometry args={[0.36, 0.4, 0.03, 96]} />
        <meshPhysicalMaterial color="#cfc9bf" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Any .glb, centred and normalised to the same height as the procedural mock. */
function GltfModel({ path }) {
  const { scene } = useGLTF(path, true);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(TARGET_HEIGHT / Math.max(size.y, 1e-6));
    clone.traverse((o) => o.isMesh && (o.castShadow = true));
    return wrapper;
  }, [scene]);
  return <primitive object={object} />;
}

export default function Protagonist({ product, reducedMotion, onReady }) {
  const travel = useRef();
  const spin = useRef();
  const tilt = useRef();
  const { viewport } = useThree();
  const [paper, ink] = product.colors;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((state) => {
    const narrow = viewport.aspect < 0.8;
    const halfW = viewport.width / 2;
    const halfH = viewport.height / 2;
    // On portrait screens the object can't sit beside the copy, so it lives
    // in the upper half (copy sits at the bottom) and drifts less sideways.
    const xRange = narrow ? 0.3 : 1;
    const yShift = narrow ? halfH * 0.3 : 0;
    const base = narrow ? Math.min(0.7, viewport.width / 4.2) : 1;
    const k = intro.v;

    travel.current.position.set(pose.x * halfW * xRange, pose.y * halfH * (narrow ? 0.3 : 1) + yShift, 0);
    travel.current.scale.setScalar(pose.scale * base * (0.6 + 0.4 * k));
    spin.current.rotation.set(0, pose.rotY - (1 - k) * Math.PI, pose.rotZ);

    // Mouse parallax: soft lerp towards the pointer.
    const { x, y } = state.pointer;
    tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, x * 0.5, 0.1);
    tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -y * 0.3, 0.1);
  });

  return (
    <group ref={travel}>
      <group ref={spin}>
        <Float
          speed={reducedMotion ? 0 : 2}
          rotationIntensity={0.5}
          floatIntensity={reducedMotion ? 0 : 1}
        >
          <group ref={tilt}>
            {product.modelPath ? (
              <GltfModel path={product.modelPath} />
            ) : product.texture ? (
              <AcrylicStand texture={product.texture} />
            ) : (
              <ProceduralBottle paper={paper} ink={ink} />
            )}
          </group>
        </Float>
      </group>
      <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={8} blur={2.6} far={3} color={ink} />
    </group>
  );
}
