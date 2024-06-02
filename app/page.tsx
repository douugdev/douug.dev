import type { NextPage } from 'next/types';
import QuoteCard from '../components/QuoteCard';
import styles from '../styles/Home.module.scss';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.bgImage}
        alt="Background coffee shop"
        src="/bg-cafe-preblurred.jpg"
        width={1920}
        height={1080}
      />
      <QuoteCard />
    </div>
  );
};

export default Home;
