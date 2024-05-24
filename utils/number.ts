export const getHundredth = (num: number) => {
  return num - (num % 100);
};

export const isBetween = (
  num: number,
  low: number,
  high: number,
  inclusive?: boolean
) => {
  if (inclusive) {
    if (num === low || num === high) {
      return true;
    }
  }

  return num > low && num < high;
};

export const normalizeValue = (
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
