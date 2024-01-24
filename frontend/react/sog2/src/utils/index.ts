export const arrayToMap = <T extends Record<string, string>>(array: T[], key?: string): Record<string, T> =>
  array.reduce((acc: Record<string, T>, item) => {
    acc[item[key || 'id']] = item;
    return acc;
  }, {});
