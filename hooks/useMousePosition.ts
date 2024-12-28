import { useEffect, useState } from 'react';

const useMousePosition = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    document.addEventListener('mousemove', (e) =>
      setPos({ x: e.clientX, y: e.clientY })
    );
  }, []);
  return pos;
};

export default useMousePosition;
