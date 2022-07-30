import type { NextPage } from 'next';
import Terminal from 'components/Terminal';
import { useWindowSize } from 'hooks/useWindowSize';

const Home: NextPage = () => {
  const { width } = useWindowSize();
  const env = process.env.NODE_ENV;

  return env !== 'development' && width && width < 800 ? (
    <h1>This website is not made for cellphones... yet.</h1>
  ) : (
    <Terminal />
  );
};

export default Home;
