'use server';

import Link from 'next/link';
import styles from '../styles/QuoteCard.module.scss';
import { PiCoffeeBean } from 'react-icons/pi';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaSquareXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import cappuccino from '@/static/coffee-keyboard.jpg';

const QuoteCard = async () => {
  return (
    <div className={styles.card}>
      <Image
        src={cappuccino}
        alt="A cappuccino with latte art and a computer behind it"
        className={styles.image}
        placeholder="blur"
        priority
      />
      <div className={styles.rightContainer}>
        <h1>Douglas Silva</h1>
        <h2>Software Engineer</h2>
        <div className={styles.linksContainer}>
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
          className={styles.bootButton}
          aria-label="Boot virtual coffee OS button"
        >
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
