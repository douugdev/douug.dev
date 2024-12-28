import { ContentComponentProps } from '@/components/Window';
import { atom, computed } from 'nanostores';
import { MutableRefObject } from 'react';
import { v4 } from 'uuid';

export type WindowedProcessType = {
  appName: string;
  processId: string;
  iconSource: string;
  type: 'windowed';
  launchOpts: { [key: string]: string };
  window: {
    Component: React.FunctionComponent<ContentComponentProps>;
    title?: string;
    hideDefaultHandler?: boolean;
    handleRef?: MutableRefObject<HTMLDivElement>;
    pos: { x?: number; y?: number };
    isFocused: boolean;
    state: 'minimized' | 'open' | 'fullscreen';
    size: {
      width: number;
      startWidth: number;
      height: number;
      startHeight: number;
    };
  };
};

export type BackgroundProcessType = {
  appName: string;
  processId: string;
  iconSource: string;
  launchOpts: { [key: string]: string };
  type: 'background';
};

export type ProcessType = WindowedProcessType | BackgroundProcessType;

export type BootStateType = 'booting' | 'booted' | 'suspended' | 'off';

export const isProcess = (obj: any): obj is ProcessType => {
  return (
    obj.appName && obj.processId && obj.iconSource && obj.type && obj.launchOpts
  );
};

export const mouse = atom<BootStateType>('booting');

export const bootState = atom<BootStateType>('booting');

export const globalPath = atom<string[]>(['/bin']);

export const processes = atom<ProcessType[]>([]);

export const launchApp = async (
  appName: string,
  launchOpts: { [key: string]: string } = {}
) => {
  const oldProcesses = processes.get();

  const appInfo = await import(`apps/${appName}`);

  const defaultOpts = {
    startHeight: 400,
    startWidth: 500,
    x: 200,
    y: 250,
  };

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const newApp: ProcessType = {
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
      size: {
        height: appInfo.startHeight ?? defaultOpts.startHeight,
        startHeight: appInfo.startHeight ?? defaultOpts.startHeight,
        width: appInfo.startWidth ?? defaultOpts.startWidth,
        startWidth: appInfo.startWidth ?? defaultOpts.startWidth,
      },
      pos: {
        x: windowWidth / 2 - (appInfo.startWidth ?? 0) / 2,
        y: windowHeight / 2 - (appInfo.startHeight ?? 0) / 2,
      },
      isFocused: true,
      state: 'open',
    },
  };

  processes.set([newApp, ...oldProcesses]);
};

export const killProcess = async (processId: string) => {
  const oldProcesses = processes.get();

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
  const process = getProcess(processId).get();

  if (!process || process.type === 'background') {
    throw new Error('Tried to focus on dead process/window');
  }

  processes.set([
    { ...process, window: { ...process.window, isFocused: true } },
    ...oldProcesses
      .map((process) => {
        if (process.type === 'background') {
          return process;
        }

        if (process.processId !== processId) {
          return {
            ...process,
            window: { ...process.window, isFocused: false },
          };
        }

        return null;
      })
      .filter(<T,>(p: T | null): p is T => p !== null),
  ]);
};

export const getProcess = (processId: string) => {
  return computed(processes, (currProcesses) =>
    currProcesses.find((p) => p.processId === processId)
  );
};

export const setProcess = (processId: string, newProcess: ProcessType) => {
  return processes.set(
    processes.get().map((p) => {
      if (p.processId !== processId) {
        return p;
      }

      return newProcess;
    })
  );
};

export const getSafeProcessInfo = (pid: string) => {
  const oldProcess = getProcess(pid).get();

  if (!oldProcess || oldProcess.type === 'background') {
    throw new Error(
      'Tried getting window info from background or unavailable process'
    );
  }

  return oldProcess;
};
