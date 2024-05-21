import { WindowProps } from 'components/Window';
import { atom } from 'nanostores';
import { MutableRefObject } from 'react';
import { v4 } from 'uuid';

export type ProcessType =
  | {
      appName: string;
      processId: string;
      iconSource: string;
      type: 'windowed';
      launchOpts: { [key: string]: string };
      window: {
        Component: React.FunctionComponent<
          WindowProps & { launchOpts: { [key: string]: string } }
        >;
        title?: string;
        hideDefaultHandler?: boolean;
        handleRef?: MutableRefObject<HTMLDivElement>;
        pos: { x: number; y: number };
        isFocused: boolean;
        state: 'minimized' | 'open' | 'fullscreen';
        size: {
          width: number;
          startWidth: number;
          height: number;
          startHeight: number;
        };
      };
    }
  | {
      appName: string;
      processId: string;
      iconSource: string;
      launchOpts: { [key: string]: string };
      type: 'background';
    };

export type BootStateType = 'booting' | 'booted' | 'suspended' | 'off';

export const bootState = atom<BootStateType>('booting');

export const globalPath = atom<string[]>([]);

export const processes = atom<ProcessType[]>([]);

export const launchApp = async (
  appName: string,
  launchOpts: { [key: string]: string } = {}
) => {
  const oldProcesses = processes.get();

  const appInfo = await import(`apps/${appName}`);

  processes.set([
    ...oldProcesses,
    {
      appName,
      processId: v4(),
      iconSource: appInfo.iconSource || `/appIcons/${appName}.png`,
      type: 'windowed',
      launchOpts: launchOpts,
      window: {
        Component: appInfo.WindowComponent,
        title: appInfo.windowTitle,
        hideDefaultHandler: appInfo.hideDefaultHandler,
        handleRef: appInfo.handleRef,
        pos: { x: 100, y: 100 },
        size: {
          height: appInfo.startHeight ?? 400,
          startHeight: appInfo.startHeight ?? 400,
          width: appInfo.startWidth ?? 500,
          startWidth: appInfo.startWidth ?? 500,
        },
        isFocused: true,
        state: 'open',
      },
    },
  ]);
};

export const closeWindow = async (processId: string) => {
  const oldProcesses = processes.get();
  console.log(oldProcesses, processId);

  processes.set(
    oldProcesses.filter((process) => process.processId !== processId)
  );
};

export const minimizeWindow = async (processId: string) => {
  const oldProcesses = processes.get();

  processes.set(
    oldProcesses.map((process) => {
      if (process.processId !== processId || process.type === 'background') {
        return process;
      }

      return { ...process, window: { ...process.window, state: 'minimized' } };
    })
  );
};

export const maximizeWindow = async (processId: string) => {
  const oldProcesses = processes.get();

  processes.set(
    oldProcesses.map((process) => {
      if (process.processId !== processId || process.type === 'background') {
        return process;
      }

      return { ...process, window: { ...process.window, state: 'fullscreen' } };
    })
  );
};

export const focusWindow = async (processId: string) => {
  const oldProcesses = processes.get();
  console.log(processId);
  processes.set(
    oldProcesses.map((process) => {
      if (process.type === 'background') {
        return process;
      }

      if (process.processId !== processId) {
        return { ...process, window: { ...process.window, isFocused: false } };
      }

      return { ...process, window: { ...process.window, isFocused: true } };
    })
  );
};
