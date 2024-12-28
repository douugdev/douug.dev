'use client';

import { useRef, useState } from 'react';
import styles from './Browser.module.scss';
import windowStyles from '../Window/Window.module.scss';
import { IoLockClosed } from 'react-icons/io5';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { ContentComponentProps } from '@/components/Window';
import useWindowedProcess from '@/hooks/useWindow';

type URLInfo = {
  protocol: string;
  fqdn: string;
  service: string;
  subdomain: string;
  domain: string;
  port: string;
  path: string;
  query: string;
  hash: string;
};

const RICK_ROLL_EMBED =
  'https://www.youtube.com/embed/dQw4w9WgXcQ?si=zCVyrSU3qkd5cJNG&autoplay=1';

const Browser = ({
  onMouseDown,
  close,
  maximize,
  minimize,
  pid,
}: ContentComponentProps) => {
  const [windowedProcess] = useWindowedProcess(pid);

  const [currentURL, setCurrentURL] = useState<string>(
    windowedProcess.launchOpts?.initialURL || RICK_ROLL_EMBED
  );
  const [editingURL, setEditingURL] = useState<string>(currentURL);
  const [isEditingURL, setIsEditingURL] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null!);

  const getBeautifiedUrl = (url: string) => {
    try {
      const matchedGroups = url?.match(
        /^(?<protocol>https?:\/\/)(?=(?<fqdn>[^:/]+))(?:(?<service>www|ww\d|cdn|ftp|mail|pop\d?|ns\d?|git)\.)?(?:(?<subdomain>[^:/]+)\.)*(?<domain>[^:/]+\.[a-z0-9]+)(?::(?<port>\d+))?(?<path>\/[^?]*)?(?:\?(?<query>[^#]*))?(?:#(?<hash>.*))?/i
      )?.groups as URLInfo | undefined;

      if (!matchedGroups) {
        return url;
      }

      if (!matchedGroups.subdomain) {
        return matchedGroups.domain;
      }

      const baseURL = `${matchedGroups.subdomain}.${matchedGroups.domain}`;
      return baseURL;
    } catch {
      return url;
    }
  };

  const getHttpfiedURL = (url: string) => {
    if (url.includes('.') && !url.startsWith('http')) {
      return `https://${url}`;
    }

    return url;
  };

  const startChangingUrl = () => {
    setIsEditingURL(true);
    setEditingURL(getHttpfiedURL(editingURL));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const stopChangingURL = () => {
    setIsEditingURL(false);
    setCurrentURL(getHttpfiedURL(editingURL));
    setTimeout(() => {
      inputRef.current?.blur();
    }, 100);
  };

  return (
    <div className={styles.fill}>
      <div
        className={`${windowStyles.handle} ${styles.extendedHandle}`}
        onMouseDown={onMouseDown}
      >
        <div className={windowStyles.windowButtonsContainer}>
          <button
            className={windowStyles.windowButtonClose}
            onClick={() => close?.()}
          />
          <button
            className={windowStyles.windowButtonMinimize}
            onClick={() => minimize?.()}
          />
          <button
            className={windowStyles.windowButtonMaximize}
            onClick={() =>
              maximize?.(
                windowedProcess.window.state === 'fullscreen' ? false : true
              )
            }
          />
        </div>
        <div className={styles.urlBar}>
          <button>
            <IoLockClosed />
          </button>

          <input
            className={styles.input}
            ref={inputRef}
            onClick={() => startChangingUrl()}
            onBlur={() => stopChangingURL()}
            value={isEditingURL ? editingURL : getBeautifiedUrl(currentURL)}
            onChange={(e) => {
              setEditingURL(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.code.toUpperCase() === 'ENTER') {
                stopChangingURL();
              }
            }}
          />
          <button onClick={() => stopChangingURL()}>
            <IoIosArrowDroprightCircle />
          </button>
        </div>
      </div>
      <iframe
        src={currentURL}
        title="coffeeOS Navigator"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default Browser;
