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
          <Link aria-label="Link to email" href="mailto:me@douug.dev">
            <MdEmail />
          </Link>
          <Link
            aria-label="Link to X (previously twitter)"
            href="https://x.com/douugdev"
          >
            <FaSquareXTwitter />
          </Link>
        </div>
        <div className={styles.phraseContainer}>
          <h1 className={styles.phrase}>
            Turning <strong className={styles.coffee}>coffee</strong> into
            <br />
            production <strong className={styles.software}>software</strong>
          </h1>
        </div>
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
          <MdOutlinePiano className={styles.icon} />
        </Link>
      </div>
    </div>
  );
};

export default QuoteCard;
