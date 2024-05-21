'use client';

import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import styles from 'styles/Window.module.scss';

const makeElementDraggable = (element: HTMLElement, handle: HTMLElement) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const dragMouseUp = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const dragMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    element.style.top = `${element.offsetTop - pos2}px`;
    element.style.left = `${element.offsetLeft - pos1}px`;
  };

  const dragMouseDown = (event: MouseEvent) => {
    event.preventDefault();

    pos3 = event.clientX;
    pos4 = event.clientY;

    document.onmouseup = dragMouseUp;
    document.onmousemove = dragMouseMove;
  };

  handle.onmousedown = dragMouseDown;
};

export type WindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  startHeight: number;
  startWidth: number;
  customHandler?: boolean;
  customHandleRef?: MutableRefObject<HTMLDivElement>;
  isFocused?: boolean;
  title?: string;
};

const Window = ({
  children,
  startHeight,
  startWidth,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isFocused,
  customHandler,
  customHandleRef,
  title,
}: PropsWithChildren<WindowProps>) => {
  const windowRef = useRef<HTMLDivElement>(null!);
  const handleRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (windowRef.current) {
      makeElementDraggable(
        windowRef.current,
        customHandler && customHandleRef
          ? customHandleRef.current
          : handleRef.current
      );
    }
  }, [customHandleRef, customHandler]);

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isFocused ? styles.focused : ''}`}
      onDoubleClick={() => onFocus()}
      style={{
        width: startWidth,
        height: startHeight,
      }}
    >
      {!customHandler ? (
        <div ref={handleRef} className={styles.handle}>
          <div className={styles.windowButtonsContainer}>
            <button
              className={styles.windowButtonClose}
              onClick={() => onClose()}
            />
            <button
              className={styles.windowButtonMinimize}
              onClick={() => onMinimize()}
            />
            <button
              className={styles.windowButtonMaximize}
              onClick={() => onMaximize()}
            />
          </div>
          {title ? <span className={styles.windowTitle}>{title}</span> : <></>}
        </div>
      ) : (
        <></>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Window;
