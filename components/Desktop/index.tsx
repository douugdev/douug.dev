'use client';

import { useStore } from '@nanostores/react';
import { desktopEnvironment } from 'stores/DE';
import styles from './Desktop.module.scss';
import { useEffect } from 'react';
import { launchApp, processes } from 'stores/OS';
import dynamic from 'next/dynamic';
import { computed } from 'nanostores';
import { removeStringDuplicates } from 'utils/array';
import Image from 'next/image';

const Window = dynamic(() => import('@/components/Window'), {
  ssr: false,
});

const pinnedDockApps = ['terminal', 'browser', 'music', 'code'];

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
      {windows.toReversed().map((windowItem) => {
        if (windowItem.type === 'background') return <></>;

        return (
          <Window
            key={windowItem.processId}
            pid={windowItem.processId}
            ContentComponent={windowItem.window.Component}
          />
        );
      })}
      <div className={styles.dock}>
        {removeStringDuplicates([...pinnedDockApps, ...dockItems]).map(
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
                <Image
                  className={styles.image}
                  src={dockItem?.iconSource ?? `/appIcons/${appName}.png`}
                  width={500}
                  height={500}
                  objectFit=""
                  alt="dock-item"
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Desktop;
