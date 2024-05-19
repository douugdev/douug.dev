import { deepMap } from 'nanostores';

export type DesktopEnvironmentType = {
  // TODO: sync between sessions
  desktop: {
    wallpaper: string;
  };
};

export const desktopEnvironment = deepMap<DesktopEnvironmentType>({
  desktop: {
    wallpaper: '/pexels-stephan-seeber-1261728.jpg',
  },
});