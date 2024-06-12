'use client';

import { focusWindow, killProcess } from '@/stores/OS';
import { isBetween, normalizeValue } from '@/utils/number';
import {
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useMousePosition from '@/hooks/useMousePosition';
import useWindowedProcess from '@/hooks/useWindow';
import styles from './Window.module.scss';
import desktopStyles from '../Desktop/Desktop.module.scss';

export type ContentComponentProps = {
  pid: string;
  close: () => void;
  minimize: () => void;
  maximize: (shouldEnterFullscreen: boolean) => void;

  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseUp: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
};

export type WindowProps = {
  ContentComponent: React.FunctionComponent<ContentComponentProps>;
  pid: string;
};

const Window = ({ ContentComponent, pid }: PropsWithChildren<WindowProps>) => {
  const [windowedProcess, setWindowedProcess] = useWindowedProcess(pid);
  const windowRef = useRef<HTMLDivElement>(null!);

  const { x, y } = useMousePosition();
  const [changeAction, setChangeAction] = useState<
    'idle' | 'dragging' | 'resizing'
  >('idle');
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  const [maxThroughSnapping, setMaxThroughSnapping] = useState<'top'>();

  const close = () => {
    killProcess(pid);
  };

  const minimize = () => {
    setWindowedProcess((prev) => ({
      ...prev,
      window: {
        ...prev.window,
        state: 'minimized',
      },
    }));
  };

  const maximize = useCallback(
    (enterFullscreen: boolean) => {
      setWindowedProcess((prev) => ({
        ...prev,
        window: {
          ...prev.window,
          pos: !enterFullscreen
            ? {
                x: window.innerWidth / 2 - prev.window.size.startWidth / 2,
                y: 5,
              }
            : prev.window.pos,
          // Also save the height and width so we can use when exiting maximize state
          size: {
            ...prev.window.size,
          },
          state: enterFullscreen ? 'fullscreen' : 'open',
        },
      }));
    },
    [setWindowedProcess]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      if (changeAction === 'idle') {
        return;
      }

      e.preventDefault();
      if (isBetween(e.clientY, -1000, 5, true)) {
        maximize(true);
      }
      setMaxThroughSnapping(undefined);
      setChangeAction('idle');
    },
    [changeAction, maximize]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      setChangeAction('dragging');

      if (windowedProcess.window.state === 'fullscreen') {
        return maximize(false);
      }
    },
    [maximize, windowedProcess.window.state]
  );

  const onMouseMove = useCallback(() => {
    switch (changeAction) {
      case 'dragging':
        // If you move more than this amount, the snap disables
        const MOUSE_OFFSET = 45; // Px

        // If true, you can´t move windows out of the top bounding box
        const FIXED_TOP_Y_SNAPPING = true;

        const xMouseDiff = mouseX - x;
        const yMouseDiff = mouseY - y;

        const { left, top, bottom, right } =
          windowRef.current.getBoundingClientRect();

        const isHittingCeiling = isBetween(top, -1000, 1, true);

        if (isBetween(y, -1000, 1, true)) {
          // setIsDragging(false);
          setMaxThroughSnapping('top');
        } else {
          setMaxThroughSnapping(undefined);
        }

        // Snap to horizontal window borders
        const shouldSnapToXBorder =
          (isBetween(left, -1, 1, true) ||
            isBetween(
              right,
              window.innerWidth + 1,
              window.innerWidth - 1,
              true
            )) &&
          Math.abs(xMouseDiff) < MOUSE_OFFSET;

        // Snap to vertical window borders
        const shouldSnapToYBorder = (() => {
          const shouldReleaseSnapping = !(
            (FIXED_TOP_Y_SNAPPING ? -yMouseDiff : Math.abs(yMouseDiff)) <
            MOUSE_OFFSET
          );
          if (shouldReleaseSnapping) {
            return false;
          }

          if (isHittingCeiling) {
            return true;
          }

          if (
            isBetween(
              bottom,
              window.innerHeight + 1,
              window.innerHeight - 1,
              true
            ) &&
            !FIXED_TOP_Y_SNAPPING
          ) {
            return true;
          }
        })();

        if (!shouldSnapToXBorder) {
          setMouseX(x);
        }
        if (!shouldSnapToYBorder) {
          setMouseY(y);
        }

        setWindowedProcess((prev) => ({
          ...prev,
          window: {
            ...prev.window,
            pos: {
              x:
                windowRef.current.offsetLeft -
                (!shouldSnapToXBorder ? xMouseDiff : 0),
              y: !shouldSnapToYBorder
                ? windowRef.current.offsetTop - yMouseDiff
                : 0,
            },
          },
        }));
        break;
      case 'resizing':
        break;
    }
  }, [changeAction, mouseX, mouseY, setWindowedProcess, x, y]);

  useEffect(() => {
    const listener: MouseEventHandler<HTMLDivElement> = (e) => {
      onMouseUp(e);
    };

    if (changeAction !== 'idle') {
      // @ts-expect-error
      document.addEventListener('mouseup', listener);
    } else {
      // @ts-expect-error
      document.addEventListener('mouseup', listener);
    }

    return () => {
      // @ts-expect-error
      document.removeEventListener('mouseup', listener);
    };
  }, [changeAction, onMouseUp, pid]);

  useEffect(() => {
    if (changeAction !== 'idle') {
      onMouseMove();
    }
  }, [changeAction, onMouseMove]);

  useEffect(() => {
    if (windowedProcess.window.state === 'fullscreen') {
      const dockElement = document.getElementsByClassName(
        desktopStyles.dock
      )[0];
      const dockBottomDistance = parseInt(
        dockElement
          .computedStyleMap()
          .get('bottom')
          ?.toString()
          .replace('px', '') || '0',
        10
      );

      setWindowedProcess((prev) => ({
        ...prev,
        window: {
          ...prev.window,
          size: {
            startHeight: prev.window.size.height,
            startWidth: prev.window.size.width,
            width: window.innerWidth,
            height:
              window.innerHeight -
              // Maximize until the dock
              (dockElement.getBoundingClientRect().height + dockBottomDistance),
          },
          pos: {
            x: 0,
            y: 0,
          },
        },
      }));
    }

    if (windowedProcess.window.state === 'open') {
      setWindowedProcess((prev) => ({
        ...prev,
        window: {
          ...prev.window,
          size: {
            ...prev.window.size,
            width: prev.window.size.startWidth,
            height: prev.window.size.startHeight,
          },
        },
      }));
    }
  }, [pid, setWindowedProcess, windowedProcess.window.state]);

  useEffect(() => {
    const { width } = windowedProcess.window.size;
    const dockElement = document.getElementsByClassName(desktopStyles.dock)[0];
    const dockBottomDistance = parseInt(
      dockElement
        .computedStyleMap()
        .get('bottom')
        ?.toString()
        .replace('px', '') || '0',
      10
    );
    const dockTotalDistance =
      dockElement.getBoundingClientRect().height + dockBottomDistance;

    if (!windowRef.current) {
      return;
    }

    const { x, y } = windowRef.current?.getBoundingClientRect();

    const dockPosX = `${Math.floor(
      normalizeValue(width / 2 + (x ?? 0), 0, window.innerWidth, 100, -100)
    )}%`;
    const dockPosY = `${Math.floor(
      normalizeValue(window.innerHeight - y, 0, window.innerHeight, 0, 100)
    )}vh`;

    document.documentElement.style.setProperty('--dockPosX', dockPosX);
    document.documentElement.style.setProperty('--dockPosY', dockPosY);
    document.documentElement.style.setProperty(
      '--dockDistance',
      dockTotalDistance.toString() + 'px'
    );
    document.documentElement.style.setProperty(
      '--mouseX',
      mouseX.toString() + 'px'
    );
  });

  return (
    <>
      <div
        ref={windowRef}
        className={`${styles.window} ${
          windowedProcess.window.state === 'open'
            ? styles.windowOpen
            : windowedProcess.window.state === 'minimized'
            ? styles.windowMinimized
            : ''
        }`}
        onMouseDown={() => focusWindow(pid)}
        style={{
          left: windowedProcess.window.pos.x,
          top: windowedProcess.window.pos.y,
          height:
            windowedProcess.window.size.height ||
            windowedProcess.window.size.startHeight,
          width:
            windowedProcess.window.size.width ||
            windowedProcess.window.size.startWidth,
        }}
      >
        <div className={styles.container}>
          {!windowedProcess.window.hideDefaultHandler ? (
            <div className={styles.handle}>
              <div className={styles.draggable} onMouseDown={onMouseDown}></div>
              <div className={styles.windowButtonsContainer}>
                <button
                  className={styles.windowButtonClose}
                  onClick={() => close()}
                />
                <button
                  className={styles.windowButtonMinimize}
                  onClick={() => minimize()}
                />
                <button
                  className={styles.windowButtonMaximize}
                  onClick={() =>
                    maximize(
                      windowedProcess.window.state === 'fullscreen'
                        ? false
                        : true
                    )
                  }
                />
              </div>
              {windowedProcess.window.title ? (
                <span className={styles.windowTitle}>
                  {windowedProcess.window.title}
                </span>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className={styles.content}>
            <ContentComponent
              pid={pid}
              close={close}
              maximize={maximize}
              minimize={minimize}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            />
          </div>
        </div>
      </div>
      <div
        className={`${styles.fullscreenHint} ${
          maxThroughSnapping === 'top' ? styles.fullscreenHintShow : ''
        }`}
      />
    </>
  );
};

export default Window;
