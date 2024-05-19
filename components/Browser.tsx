import {
  MutableRefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import styles from 'styles/Browser.module.scss';
import windowStyles from 'styles/Window.module.scss';
import { WindowProps } from './Window';
import { IoLockClosed } from 'react-icons/io5';
import { IoIosArrowDroprightCircle } from 'react-icons/io';

export type BrowserProps = {
  handleRef: MutableRefObject<HTMLDivElement>;
  launchOpts?: { [key: string]: string };
} & Partial<WindowProps>;

const Browser = ({
  handleRef,
  onClose,
  onMaximize,
  onMinimize,
  onFocus,
  launchOpts,
}: BrowserProps) => {
  const [currentURL, setCurrentURL] = useState<string>(
    launchOpts?.initialURL ||
      'https://www.youtube.com/embed/dQw4w9WgXcQ?si=zCVyrSU3qkd5cJNG&autoplay=1'
  );
  const [editingURL, setEditingURL] = useState<string>(currentURL);
  const [isEditingURL, setIsEditingURL] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null!);

  const beautifiedURL = useMemo(() => {
    try {
      return currentURL
        .split(/https:\/\//)[1]
        .split('/')[0]
        .split('www.')[1];
    } catch {
      return currentURL;
    }
  }, [currentURL]);

  const getHttpfiedURL = () => {};
  const startChangingUrl = () => {
    setIsEditingURL(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const stopChangingURL = () => {
    setIsEditingURL(false);
    setCurrentURL(editingURL);
    setTimeout(() => {
      inputRef.current?.blur();
    }, 100);
  };

  return (
    <div className={styles.fill} onDoubleClick={onFocus}>
      <div className={windowStyles.handle} ref={handleRef}>
        <div className={windowStyles.windowButtonsContainer}>
          <button
            className={windowStyles.windowButtonClose}
            onClick={() => onClose?.()}
          />
          <button
            className={windowStyles.windowButtonMinimize}
            onClick={() => onMinimize?.()}
          />
          <button
            className={windowStyles.windowButtonMaximize}
            onClick={() => onMaximize?.()}
          />
        </div>
        <div className={styles.urlBar}>
          <button>
            <IoLockClosed />
          </button>

          <input
            className={
              isEditingURL ? styles.focusedInput : styles.unfocusedInput
            }
            ref={inputRef}
            onClick={() => {
              startChangingUrl();
            }}
            defaultValue={beautifiedURL}
            value={isEditingURL ? editingURL : beautifiedURL}
            // disabled={!isEditingURL}
            // onBlur={stopChangingURL}
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
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default Browser;
