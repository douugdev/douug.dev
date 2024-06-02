'use server';

import type { NextPage } from 'next/types';
import QuoteCard from '../components/QuoteCard';
import styles from '../styles/Home.module.scss';
import Image from 'next/image';
import bgImage from '@/static/bg-cafe-preblurred.jpeg';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.bgImage}
        alt="Background coffee shop"
        src={bgImage}
        placeholder="blur"
        aria-label="A blurred image of a coffee shop"
      />
      <QuoteCard />
    </div>
  );
};

export default Home;
