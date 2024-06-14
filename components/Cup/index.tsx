'use client';

import { Gltf, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Euler, MathUtils, Mesh, PointLight } from 'three';
import CanvasHOC from '../CanvasHOC';

const Cup = () => {
  const mouseRef = useRef<MouseEvent>(null!);
  const cupRef = useRef<Mesh>(null!);
  const pointLightRef = useRef<PointLight>(null!);
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  window.addEventListener('mousemove', (ev) => {
    mouseRef.current = ev;
  });

  useFrame(() => {
    gl.shadowMap.enabled = true;

    if (pointLightRef.current) {
      pointLightRef.current.shadow.mapSize.height = 2048;
      pointLightRef.current.shadow.mapSize.width = 2048;
      pointLightRef.current.shadow.radius = 30;
    }
    if (!cupRef.current) {
      return;
    }

    cupRef.current.geometry.center();

    if (!mouseRef.current) {
      cupRef.current.rotation.set(0.2, 0, 0.1);
      return;
    }

    const { x: mouseX, y: mouseY } = mouseRef.current;

    const centeredX = (mouseX - window.innerWidth / 3) / window.innerWidth;
    const centeredY =
      ((mouseY - window.innerHeight / 2) / window.innerHeight) *
      -Math.sign(centeredX);

    cupRef.current.rotation.copy(
      new Euler(
        MathUtils.lerp(
          cupRef.current.rotation.x,
          centeredY * 0.15 + 0.2,
          0.015
        ),
        MathUtils.lerp(cupRef.current.rotation.y, centeredX * 1, 0.015),
        0.1
      )
    );
  });

  return (
    <>
      <ambientLight color={'#6e5645'} intensity={1.5} />
      <PerspectiveCamera makeDefault position={[10, 0, 0]}>
        <directionalLight
          position={[0, 3, 0]}
          intensity={3}
          color={'#ddb291'}
          rotation={new Euler(0, -5, 0)}
          castShadow
        />
        <directionalLight
          castShadow
          position={[50, 10, 10]}
          color={'#ddae8a'}
          intensity={5}
        />
      </PerspectiveCamera>
      <pointLight
        ref={pointLightRef}
        position={[9, 0.7, -0.5]}
        color={'#ffd4b1'}
        intensity={20}
        castShadow
      />
      <mesh ref={cupRef}>
        <Gltf
          scale={0.8}
          src="/coffee-cup.glb"
          position={[0, -2, 0]}
          castShadow
        />
      </mesh>
      <mesh scale={1} position={[-5, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 50, 50]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
};

export default CanvasHOC(Cup);
