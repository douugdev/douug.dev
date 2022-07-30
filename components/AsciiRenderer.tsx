import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AsciiEffect } from 'three-stdlib';

const AsciiRenderer = ({
  renderIndex = 1,
  characters = '@%*=+: ',
  ...options
}) => {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options);
    effect.domElement.id = 'ascii';
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    effect.domElement.style.color = 'greenyellow';
    effect.domElement.style.backgroundColor = 'transparent';
    effect.domElement.style.pointerEvents = 'none';
    return effect;
  }, [characters, gl, options]);

  // Append on mount, remove on unmount
  useEffect(() => {
    document
      .getElementById('loading-container')
      ?.appendChild(effect.domElement);
    return () => {
      console.log();
      document.getElementById('ascii')?.remove();
    };
  }, [effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it has no view, it is a purely logical
  return <></>;
};

export default AsciiRenderer;
