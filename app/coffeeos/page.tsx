'use client';

import type { NextPage } from 'next';
import { useWindowSize } from 'hooks/useWindowSize';
import Desktop from '@/components/Desktop';

const Home: NextPage = () => {
  const { width } = useWindowSize();
  const env = process.env.NODE_ENV;

  // TODO: pretty obvious
  if (env !== 'development' && width && width < 800) {
    return <h1>This OS does not support for mobile devices... yet.</h1>;
  }

  return <Desktop />;
};

export default Home;
