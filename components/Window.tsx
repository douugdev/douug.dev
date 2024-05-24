'use client';

import {
  focusWindow,
  getProcess,
  getSafeProcessInfo,
  killProcess,
  setProcess,
} from '@/stores/OS';
import { isBetween, normalizeValue } from '@/utils/number';
import { useStore } from '@nanostores/react';
import {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from 'styles/Window.module.scss';
import desktopStyles from 'styles/Desktop.module.scss';

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

const Window = ({
  ContentComponent,
  pid,
}: // customHandler,
// title,
PropsWithChildren<WindowProps>) => {
  const processInfo = useStore(getProcess(pid));
  if (!processInfo || processInfo.type === 'background') {
    throw 'Tried rendering a window for a background or unavailable process';
  }
  const windowRef = useRef<HTMLDivElement>(null!);

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
    const oldProcess = getSafeProcessInfo(pid);
    setProcess(pid, {
      ...oldProcess,
      window: {
        ...oldProcess.window,
        state: 'minimized',
      },
    });
  };

  const maximize = useCallback(
    (enterFullscreen: boolean) => {
      const oldProcess = getSafeProcessInfo(pid);

      setProcess(pid, {
        ...oldProcess,
        window: {
          ...oldProcess.window,
          pos: !enterFullscreen
            ? {
                x:
                  window.innerWidth / 2 - oldProcess.window.size.startWidth / 2,
                y: 5,
              }
            : oldProcess.window.pos,
          // Also save the height and width so we can use when exiting maximize state
          size: {
            ...oldProcess.window.size,
          },
          state: enterFullscreen ? 'fullscreen' : 'open',
        },
      });
    },
    [pid]
  );

  const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (isBetween(e.clientY, -1000, 5, true)) {
        maximize(true);
      }
      setMaxThroughSnapping(undefined);
      setChangeAction('idle');
    },
    [maximize]
  );

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      console.log('onMouseDownCalled');
      e.preventDefault();
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      setChangeAction('dragging');

      if (processInfo.window.state === 'fullscreen') {
        return maximize(false);
      }
    },
    [maximize, processInfo.window.state]
  );

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      switch (changeAction) {
        case 'dragging':
          e.preventDefault();
          const oldProcess = getProcess(pid).get();
          if (!oldProcess || oldProcess.type === 'background') {
            return;
          }
          // If you move more than this amount, the snap disables
          const MOUSE_OFFSET = 45; // Px

          // If true, you can´t move windows out of the top bounding box
          const FIXED_TOP_Y_SNAPPING = true;

          const xMouseDiff = mouseX - e.clientX;
          const yMouseDiff = mouseY - e.clientY;

          const { left, top, bottom, right } =
            windowRef.current.getBoundingClientRect();

          const isHittingCeiling = isBetween(top, -1000, 1, true);

          if (isBetween(e.clientY, -1000, 1, true)) {
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
            setMouseX(e.clientX);
          }

          if (!shouldSnapToYBorder) {
            setMouseY(e.clientY);
          }

          setProcess(pid, {
            ...oldProcess,
            window: {
              ...oldProcess.window,
              pos: {
                x:
                  windowRef.current.offsetLeft -
                  (!shouldSnapToXBorder ? xMouseDiff : 0),
                y: !shouldSnapToYBorder
                  ? windowRef.current.offsetTop - yMouseDiff
                  : 0,
              },
            },
          });
          break;
        case 'resizing':
          break;
      }
    },
    [changeAction, mouseX, mouseY, pid]
  );

  useEffect(() => {
    if (changeAction !== 'idle') {
      console.log('changed mouse listeners');
      // @ts-expect-error I'll fix the typing sometime in the future...
      document.onmouseup = onMouseUp;
      // @ts-expect-error
      document.onmousemove = onMouseMove;
    } else {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }, [changeAction, onMouseUp, onMouseMove, mouseX, mouseY]);

  useEffect(() => {
    if (processInfo.window.state === 'fullscreen') {
      const oldProcess = getSafeProcessInfo(pid);

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

      setProcess(pid, {
        ...oldProcess,
        window: {
          ...oldProcess.window,
          size: {
            startHeight: oldProcess.window.size.height,
            startWidth: oldProcess.window.size.width,
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
      });
    }

    if (processInfo.window.state === 'open') {
      const oldProcess = getSafeProcessInfo(pid);
      setProcess(pid, {
        ...oldProcess,
        window: {
          ...oldProcess.window,
          // pos: {
          //   x: window.innerWidth / 2,
          //   y: window.innerHeight / 2,
          // },
          size: {
            ...oldProcess.window.size,
            width: oldProcess.window.size.startWidth,
            height: oldProcess.window.size.startHeight,
          },
        },
      });
    }
  }, [pid, processInfo.window.state]);

  useEffect(() => {
    // TODO: display preview of maximizing
  }, [maxThroughSnapping]);

  useEffect(() => {
    const { width } = processInfo.window.size;
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
          processInfo.window.state === 'open'
            ? styles.windowOpen
            : processInfo.window.state === 'minimized'
            ? styles.windowMinimized
            : ''
        }`}
        onMouseDown={() => focusWindow(pid)}
        style={{
          left: processInfo.window.pos.x,
          top: processInfo.window.pos.y,
          height:
            processInfo.window.size.height ||
            processInfo.window.size.startHeight,
          width:
            processInfo.window.size.width || processInfo.window.size.startWidth,
        }}
      >
        {!processInfo.window.hideDefaultHandler ? (
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
                    processInfo.window.state === 'fullscreen' ? false : true
                  )
                }
              />
            </div>
            {processInfo.window.title ? (
              <span className={styles.windowTitle}>
                {processInfo.window.title}
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
      <div
        className={`${styles.fullscreenHint} ${
          maxThroughSnapping === 'top' ? styles.fullscreenHintShow : ''
        }`}
      />
    </>
  );
};

export default Window;
