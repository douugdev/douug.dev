import Browser from 'components/Browser';
import { MutableRefObject, createRef } from 'react';
import { getHundredth } from 'utils/number';

export const hideDefaultHandler = true;

export const handleRef =
  createRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

export const WindowComponent = ({
  ...props
}: {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}) => {
  return <Browser handleRef={handleRef} {...props} />;
};

export const appType = 'windowed';

export const startHeight = getHundredth(window.innerHeight / 1.2);

export const startWidth = getHundredth(Math.max(200, window.innerWidth / 1.4));
