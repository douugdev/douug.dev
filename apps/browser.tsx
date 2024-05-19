import Browser from 'components/Browser';
import { MutableRefObject, createRef } from 'react';

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

export const startHeight = 800;

export const startWidth = 1200;
