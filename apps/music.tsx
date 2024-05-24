import Music from 'components/Music';
import { getHundredth } from 'utils/number';

export const WindowComponent = Music;

export const appType = 'windowed';

export const startHeight = getHundredth(window.innerHeight / 1.5);

export const startWidth = getHundredth(Math.max(200, window.innerWidth / 3));

export const windowTitle = 'SoundCloud';
