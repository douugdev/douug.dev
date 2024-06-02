'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Euler, MathUtils, Mesh, Vector3 } from 'three';
import { useEffect, useRef, useState } from 'react';
import { Text3D } from '@react-three/drei';
import styles from 'styles/SplashScreen.module.scss';
import { bootState } from 'stores/OS';

const bootTexts = [
  '[boot] coffeeOS - Copyright (c) Douglas Silva',
  '[kernel] kernel systems OK',
  '[boot] loading standard lib',
  '[mount] mounting filesystems...',
  '[mount] xfs not found, loading douugfs instead...',
  '[mount] coffs mount returned code 0',
  '[boot] standard lib OK',
  '[mount] mounting OK',
  '[drivers] loading browser drivers',
  '[kernel] freeing unused memory 69420K',
  '[dde] loading desktop environment',
  '[drivers] notifications OK',
  '[dde] generic USB mouse discovered at port dis_cool',
  '[dde] systemd disabled',
  '[drivers] sound OK',
  '[drivers] video OK',
  `[dde] support for useragent: ${
    typeof navigator === 'object' ? navigator?.userAgent : 'Browser'
  } OK`,
  '[drivers] browser drivers OK',
  '[info] welcome.',
];

const RotatingText: React.FC<{ finished: boolean }> = ({ finished }) => {
  const textRef = useRef<Mesh>(null!);
  const mouseRef = useRef<MouseEvent>(null!);
  const { scene } = useThree();
  const [currentState, setCurrentState] = useState<
    'starting' | 'gaming' | 'finishing' | 'finished'
  >('starting');

  scene.background = new Color('#000000');

  window.addEventListener('mousemove', (ev) => {
    mouseRef.current = ev;
  });

  useEffect(() => {
    setTimeout(() => {
      setCurrentState('gaming');
    }, 1000);
  }, []);

  useEffect(() => {
    if (finished) {
      setCurrentState('finishing');
      setTimeout(() => {
        setCurrentState('finished');
      }, 500);
    }
  }, [finished]);

  useFrame(({ clock }) => {
    textRef.current.geometry.center();

    if (currentState === 'starting') {
      textRef.current.position.z = MathUtils.lerp(
        textRef.current.position.z,
        -1,
        0.025
      );

      if (Array.isArray(textRef.current.material)) return;

      textRef.current.material.opacity = MathUtils.lerp(
        textRef.current.material.opacity,
        1,
        0.1
      );
    }

    if (currentState === 'finishing') {
      textRef.current.rotation.copy(
        new Euler(
          MathUtils.lerp(textRef.current.rotation.x, 0, 0.1),
          MathUtils.lerp(textRef.current.rotation.y, 0, 0.1),
          MathUtils.lerp(textRef.current.rotation.z, 0, 0.1)
        )
      );
      return;
    }

    if (currentState === 'finished') {
      textRef.current.position.copy(
        new Vector3(
          MathUtils.lerp(textRef.current.position.x, 0, 0.1),
          MathUtils.lerp(textRef.current.position.y, 0, 0.1),
          MathUtils.lerp(textRef.current.position.z, 6, 0.1)
        )
      );
      if (Array.isArray(textRef.current.material)) return;

      textRef.current.material.opacity = MathUtils.lerp(
        textRef.current.material.opacity,
        -1,
        0.1
      );
      return;
    }

    if (currentState !== 'gaming') return;

    if (!mouseRef.current?.x || !mouseRef.current?.y) {
      return;
    }

    const { x: mouseX, y: mouseY } = mouseRef.current;

    const centeredX = (mouseX - window.innerWidth / 2) / window.innerWidth;
    const centeredY = (mouseY - window.innerHeight / 2) / window.innerHeight;

    textRef.current.rotation.copy(
      new Euler(
        MathUtils.lerp(textRef.current.rotation.x, centeredY * 2, 0.075),
        MathUtils.lerp(textRef.current.rotation.y, centeredX * 2, 0.075),
        MathUtils.lerp(textRef.current.rotation.z, 0, 0.075)
      )
    );
  });

  return (
    <Text3D
      ref={textRef}
      bevelSegments={10}
      bevelSize={0.02}
      bevelEnabled={true}
      position={[0, 0, 6]}
      font={'/pacifico.typeface.json'}
    >
      coffeeOS
      <meshNormalMaterial transparent opacity={0} />
    </Text3D>
  );
};

const SplashScreen = () => {
  const [currentBootTexts, setCurrentBootTexts] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (currentBootTexts.length == bootTexts.length) {
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentBootTexts((prev) => [...prev, bootTexts[prev.length]]);
    }, Math.random() * 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentBootTexts]);

  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        bootState.set('booted');
      }, 1000);
    }

    const timeout = setTimeout(() => {
      setLoadingProgress((prev) => Math.min(100, prev + 1));
    }, Math.random() * 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingProgress]);

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.bootTexts}>
        {currentBootTexts.map((txt) => (
          <span key={txt}>{txt}</span>
        ))}
      </div>
      <div className={styles.loadingBarContainer}>
        <div
          className={styles.loadingBarInner}
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <div id="loading-container" className={styles.loadingContainer}>
        <Canvas
          className={styles.canvas}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={1}
        >
          <RotatingText finished={loadingProgress === 100} />
          <directionalLight position={[-10, -10, -10]} intensity={2} />
          <spotLight position={[0, 2, 10]} intensity={1} />
        </Canvas>
      </div>
    </div>
  );
};

export default SplashScreen;
