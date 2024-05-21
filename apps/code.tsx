import Code from 'components/Code';
import { getHundredth } from 'utils/number';

export const WindowComponent = () => {
  return <Code />;
};

export const appType = 'windowed';

export const startHeight = getHundredth(window.innerHeight / 1.3);

export const startWidth = getHundredth(Math.max(200, window.innerWidth / 1.6));

export const windowTitle = 'douugIDE';
