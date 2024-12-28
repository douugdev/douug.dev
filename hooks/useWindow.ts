import {
  getProcess,
  getSafeProcessInfo,
  ProcessType,
  setProcess,
  WindowedProcessType,
} from '@/stores/OS';
import { useStore } from '@nanostores/react';
import { useCallback, useMemo } from 'react';

const useWindowedProcess = (pid: string) => {
  const processGetter = useStore(getProcess(pid));

  if (!processGetter || processGetter.type === 'background') {
    throw 'Tried rendering a window for a background or unavailable process';
  }

  const processSetter = useCallback(
    (func: (previousProcess: WindowedProcessType) => WindowedProcessType) => {
      const previousProcess = getSafeProcessInfo(pid);

      if (!previousProcess) {
        throw 'Tried rendering a window for a background or unavailable process';
      }

      return setProcess(pid, func(previousProcess));
    },
    [pid]
  );

  return useMemo(
    () => [processGetter, processSetter] as const,
    [processGetter, processSetter]
  );
};

export default useWindowedProcess;
