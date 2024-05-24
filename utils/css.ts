export const convertRemToPixels = (rem: string | number) => {
  const parsedRem = typeof rem === 'string' ? parseFloat(rem) : rem;
  return (
    parsedRem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
};
