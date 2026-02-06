import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import { FieldModel } from "./FieldModel";

export function FieldScene() {
  const controlsRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <Canvas camera={{ position: [0, 6, 8], fov: 45 }} style={{ height: 420 }}>
      <FieldModel
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enableRotate={isInteracting}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.1}
      />

      <Environment preset="city" />
    </Canvas>
  );
}
