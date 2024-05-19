import { MutableRefObject, useState } from 'react';
import styles from 'styles/Browser.module.scss';
import windowStyles from 'styles/Window.module.scss';
import { WindowProps } from './Window';
import { IoLockClosed } from 'react-icons/io5';

export type BrowserProps = {
  handleRef: MutableRefObject<HTMLDivElement>;
} & Partial<WindowProps>;

const Browser = ({
  handleRef,
  onClose,
  onMaximize,
  onMinimize,
  onFocus,
}: BrowserProps) => {
  const [currentURL, setCurrentURL] = useState<string>(
    'https://www.youtube.com/embed/i99UG0MJDwY?si=hgP9fU7dvN2cEOZ9&autoplay=1'
  );
  const [isEditingURL, setIsEditingURL] = useState<boolean>(false);

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
          <button>
            <span>youtube.com</span>
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
