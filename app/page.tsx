import type { NextPage } from 'next/types';
import styles from './Home.module.scss';
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
      <QuoteCard />
    </div>
  );
};

export default Home;
