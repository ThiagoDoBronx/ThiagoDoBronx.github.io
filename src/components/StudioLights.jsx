import { Environment, Lightformer } from '@react-three/drei';

/** Studio lighting built from light-formers: no HDR download needed. */
export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={60} castShadow />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 4, -6]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[5, 4, 6]} scale={3} />
      </Environment>
    </>
  );
}
