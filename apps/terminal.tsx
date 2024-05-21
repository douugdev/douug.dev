import Terminal from 'components/Terminal';
import { getHundredth } from 'utils/number';

export const WindowComponent = () => {
  return <Terminal />;
};

export const appType = 'windowed';

export const startHeight = getHundredth(window.innerHeight / 1.5);

export const startWidth = getHundredth(Math.max(200, window.innerWidth / 2));

export const windowTitle = 'Terminal';
