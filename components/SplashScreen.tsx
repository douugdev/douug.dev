'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Text3D } from '@react-three/drei';
import AsciiRenderer from './AsciiRenderer';
import styles from 'styles/SplashScreen.module.scss';
import { bootState } from 'stores/OS';

const bootTexts = [
  '[boot] douugOS - Copyright (c) Douglas Silva',
  '[kernel] kernel systems OK',
  '[boot] loading standard lib',
  '[mount] mounting filesystems...',
  '[mount] xfs not found, loading douugfs instead...',
  '[mount] douugfs mount returned code 0',
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
  `[dde] support for useragent: ${navigator.userAgent} OK`,
  '[drivers] browser drivers OK',
  '[info] welcome.',
];

const RotatingText: React.FC = () => {
  const textRef = useRef<Mesh>(null!);
  const mouseRef = useRef<MouseEvent>(null!);

  window.addEventListener('mousemove', (ev) => {
    mouseRef.current = ev;
  });

  useFrame(({ clock }) => {
    textRef.current.geometry.center();

    if (!mouseRef.current?.x || !mouseRef.current?.y) {
      return;
    }

    const { x: mouseX, y: mouseY } = mouseRef.current;

    const centeredX = (mouseX - window.innerWidth / 2) / window.innerWidth;
    const centeredY = (mouseY - window.innerHeight / 2) / window.innerHeight;

    textRef.current.rotation.y = centeredX * 1.5;
    textRef.current.rotation.x = centeredY * 1.5;
  });

  return (
    <Text3D
      ref={textRef}
      bevelSegments={1}
      position={[0, 0, 0]}
      font={'/ibmplex.typeface.json'}
    >
      douugOS
      <meshPhongMaterial color="#ffffff" />
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
      bootState.set('booted');
    }

    const timeout = setTimeout(() => {
      setLoadingProgress((prev) => Math.min(100, prev + 1));
    }, Math.random() * 100);

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
        <Suspense fallback={<h1>Booting...</h1>}>
          <Canvas className={styles.canvas} gl={{ antialias: false }} dpr={0.2}>
            <RotatingText />
            <AsciiRenderer invert resolution={0.25} color="#fff" />
            <directionalLight />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default SplashScreen;
