'use client';

import { Gltf, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Euler, MathUtils, Mesh } from 'three';
import CanvasHOC from './CanvasHOC';

const Cup = () => {
  const mouseRef = useRef<MouseEvent>(null!);
  const cupRef = useRef<Mesh>(null!);
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  window.addEventListener('mousemove', (ev) => {
    mouseRef.current = ev;
  });

  useFrame(({ clock }) => {
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
    console.log(centeredX, centeredY);
    cupRef.current.rotation.copy(
      new Euler(
        MathUtils.lerp(cupRef.current.rotation.x, centeredY * 1, 0.015),
        MathUtils.lerp(cupRef.current.rotation.y, centeredX * 1, 0.015),
        MathUtils.lerp(cupRef.current.rotation.z, 0, 0.2)
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
      <mesh ref={cupRef}>
        <Gltf
          scale={0.8}
          src="/coffee-cup.glb"
          position={[0, -2, 0]}
          receiveShadow
          castShadow
        />
      </mesh>
    </>
  );
};

export default CanvasHOC(Cup);
