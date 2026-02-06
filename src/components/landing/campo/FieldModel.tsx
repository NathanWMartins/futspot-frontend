import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useTheme, useMediaQuery } from "@mui/material";
import * as THREE from "three";

export function FieldModel(props: any) {
  const { scene } = useGLTF("/models/soccer-field/scene.gltf");
  const ref = useRef<THREE.Object3D>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isInteracting, setIsInteracting] = useState(false);

  useFrame((_, delta) => {
    if (!isInteracting && ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={isMobile ? 0.11 : 0.15}
      rotation={[-Math.PI / 12, 2, 0]}  
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
      onPointerOut={() => setIsInteracting(false)}
      {...props}
    />
  );
}

useGLTF.preload("/models/soccer-field/scene.gltf");
