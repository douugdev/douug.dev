'use server';

import Link from 'next/link';
import styles from './QuoteCard.module.scss';
import { PiCoffeeBean } from 'react-icons/pi';
import { FaGithub } from 'react-icons/fa';
import { MdEmail, MdOutlinePiano } from 'react-icons/md';
import { FaSquareXTwitter } from 'react-icons/fa6';

import Cup from '../Cup';

const QuoteCard = async () => {
  return (
    <div className={styles.card}>
      <div className={styles.canvas}>
        <Cup />
      </div>
      <div className={styles.rightContainer}>
        <h1>Douglas Silva</h1>
        <h2>Software Engineer</h2>
        <div className={styles.upperLinksContainer}>
          <Link aria-label="Link to github" href="https://github.com/douugdev">
            <FaGithub />
          </Link>
          <Link aria-label="Link to email" href="mailto:douglas@prototech.dev">
            <MdEmail />
          </Link>
          <Link
            aria-label="Link to X (previously twitter)"
            href="https://x.com/douugdev"
          >
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
        <Link
          href="/coffeeos"
          className={styles.linkButton}
          aria-label="Boot virtual coffee OS button"
        >
          <label>
            Boot <b>coffeeOS</b>
          </label>
          <PiCoffeeBean className={styles.icon} />
        </Link>
        <Link
          href="https://synth.douug.dev"
          className={styles.linkButton}
          aria-label="Enter virtual synthesizer button"
        >
          <label>
            Enter <b>synth.ts</b>
          </label>
          <MdOutlinePiano  className={styles.icon} />
        </Link>
      </div>
    </div>
  );
};

export default QuoteCard;
