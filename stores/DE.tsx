import { computed, deepMap } from 'nanostores';

export type DesktopEnvironmentType = {
  // TODO: sync between sessions
  desktop: {
    wallpaper: string;
  };
};

export const desktopEnvironment = deepMap<DesktopEnvironmentType>({
  desktop: {
    wallpaper: '/bg-cafe-preblurred.jpg',
  },
});

export const wallpaper = computed(
  desktopEnvironment,
  (de) => de.desktop.wallpaper
);
