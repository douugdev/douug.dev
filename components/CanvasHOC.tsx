import { Canvas } from '@react-three/fiber';

const CanvasHOC = (Component: React.FunctionComponent) => {
  const MyComp = (props: any) => {
    return (
      <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Component {...props} />
      </Canvas>
    );
  };
  MyComp.displayName = 'test';

  return MyComp;
};

export default CanvasHOC;
