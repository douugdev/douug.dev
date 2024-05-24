export const removeStringDuplicates = (arr: string[]) => {
  var seen: { [key: string]: boolean } = {};
  return arr.filter((item) => {
    return seen.hasOwnProperty(item)
      ? false
      : (seen[item as keyof typeof seen] = true);
  });
};

export const spliceNoMutate = <T>(
  myArray: T[],
  indexToRemove: number,
  ...items: T[]
) => {
  return myArray
    .slice(0, indexToRemove)
    .concat(...items, myArray.slice(indexToRemove));
};
