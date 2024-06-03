import type { NextPage } from 'next/types';
import styles from '../styles/Home.module.scss';
import Image from 'next/image';
import bgImage from '@/static/bg-cafe-preblurred.jpg';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const QuoteCard = dynamic(() => import('@/components/QuoteCard'));

export const metadata: Metadata = {
  title: "Douglas' Portfolio",
  description:
    "This is my portoflio, you'll be able to use a virtual OS to explore my work interactively!",
  robots: `
    User-agent: baiduspider
    Disallow: /
    User-agent: *
    Disallow: 
    Disallow: /cgi-bin/
    Disallow: /coffeeos
    `,
  creator: 'Douglas Silva',
};

const Home: NextPage = async () => {
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
