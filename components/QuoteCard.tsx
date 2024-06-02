'use server';

import Link from 'next/link';
import styles from '../styles/QuoteCard.module.scss';
import { PiCoffeeBean } from 'react-icons/pi';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaSquareXTwitter } from 'react-icons/fa6';

const QuoteCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.rightContainer}>
        <h1>Douglas Silva</h1>
        <h3>Software Engineer</h3>
        <div className={styles.linksContainer}>
          <Link href="https://github.com/douugdev">
            <FaGithub />
          </Link>
          <Link href="mailto:douglas@prototech.dev">
            <MdEmail />
          </Link>
          <Link href="https://x.com/douugdev">
            <FaSquareXTwitter />
          </Link>
        </div>
        <blockquote className={styles.quoteContainer}>
          <div>
            <p className={styles.quote}>
              <span className={styles.quotationMarkStart}>“</span>
              Take big bites.
              <br />
              Anything worth doing is worth
              <br />
              overdoing.
              <span className={styles.quotationMarkEnd}>”</span>
            </p>
          </div>
          <footer className={styles.quoteAuthor}>
            Robert A. Heinlein
            <br />
            <cite>Time Enough for Love</cite>
          </footer>
        </blockquote>
        <Link href="/coffeeos" className={styles.bootButton}>
          <label>
            Boot <b>coffeeOS</b>
          </label>
          <PiCoffeeBean className={styles.icon} />
        </Link>
      </div>
    </div>
  );
};

export default QuoteCard;
