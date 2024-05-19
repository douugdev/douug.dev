export const removeStringDuplicates = (arr: string[]) => {
  var seen: { [key: string]: boolean } = {};
  return arr.filter((item) => {
    return seen.hasOwnProperty(item)
      ? false
      : (seen[item as keyof typeof seen] = true);
  });
};
