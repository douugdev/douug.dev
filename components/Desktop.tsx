import { useStore } from '@nanostores/react';
import { desktopEnvironment } from 'stores/DE';
import styles from 'styles/Desktop.module.scss';
import { useEffect } from 'react';
import {
  closeWindow,
  focusWindow,
  launchApp,
  maximizeWindow,
  minimizeWindow,
  processes,
} from 'stores/OS';
import dynamic from 'next/dynamic';
import { computed } from 'nanostores';
import { removeStringDuplicates } from 'utils/array';

const Window = dynamic(() => import('components/Window'), { ssr: false });

const pinnedDockApps = ['terminal', 'browser'];

const computedDockItems = computed(processes, (window) => {
  return window.map((w) => w.appName);
});

const Desktop = () => {
  const de = useStore(desktopEnvironment);
  const windows = useStore(processes);
  const dockItems = useStore(computedDockItems);

  useEffect(() => {
    launchApp('terminal');
  }, []);

  return (
    <div
      id="desktop"
      className={styles.desktop}
      style={{ backgroundImage: `url(${de.desktop.wallpaper})` }}
    >
      {windows.map((windowItem) => {
        if (windowItem.type === 'background') return <></>;

        const defaultWindowProps = {
          onClose: () => closeWindow(windowItem.processId),
          onMaximize: () => maximizeWindow(windowItem.processId),
          onMinimize: () => minimizeWindow(windowItem.processId),
          onFocus: () => focusWindow(windowItem.processId),
          startHeight: windowItem.window.size.startHeight,
          startWidth: windowItem.window.size.startWidth,
          customHandleRef: windowItem.window.handleRef,
          customHandler: !!windowItem.window.hideDefaultHandler,
          isFocused: windowItem.window.isFocused,
        };

        return (
          <Window key={windowItem.processId} {...defaultWindowProps}>
            <windowItem.window.Component {...defaultWindowProps} />
          </Window>
        );
      })}
      <div className={styles.dock}>
        {removeStringDuplicates([...dockItems, ...pinnedDockApps]).map(
          (appName) => {
            const dockItem = windows.find((win) => win.appName === appName);

            if (dockItem?.type === 'background') return <></>;

            return (
              <div
                key={`${appName}_dock_item`}
                className={`${styles.dockItem} ${
                  dockItem?.window.isFocused ? styles.dockItemFocused : ''
                }`}
                onClick={() => launchApp(appName)}
              >
                <img src={dockItem?.iconSource ?? `/appIcons/${appName}.png`} />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Desktop;
