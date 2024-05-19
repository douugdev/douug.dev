import type { NextPage } from 'next';
import { useWindowSize } from 'hooks/useWindowSize';
import dynamic from 'next/dynamic';
import { useStore } from '@nanostores/react';
import { bootState } from 'stores/OS';
import Desktop from 'components/Desktop';

const SplashScreen = dynamic(() => import('components/SplashScreen'), {
  ssr: false,
});

const Home: NextPage = () => {
  const { width } = useWindowSize();
  const env = process.env.NODE_ENV;

  const boot = useStore(bootState);

  // TODO: pretty obvious
  if (env !== 'development' && width && width < 800) {
    return <h1>This website is not made for cellphones... yet.</h1>;
  }

  if (boot === 'booting' && env !== 'development') {
    return <SplashScreen />;
  }

  return <Desktop />;
};

export default Home;
