type MapFunction<T, P> = (item: T, idx: number) => P;

export function arrayToMap<T extends Record<string, unknown>, P>(
  array: T[],
  options: { key?: string; mapper: MapFunction<T, P> },
): Record<string, P>;

export function arrayToMap<T extends Record<string, unknown>>(
  array: T[],
  options?: { key?: string },
): Record<string, T>;

export function arrayToMap<T extends Record<string, unknown>, P>(
  array: T[],
  options?: { key?: string; mapper?: MapFunction<T, P> },
): Record<string, P | T> {
  const key = options?.key || 'id';

  return array.reduce((acc: Record<string, P | T>, item, idx) => {
    acc[item[key] as string] = options?.mapper ? options.mapper(item, idx) : item;
    return acc;
  }, {});
}

export const formatTime = (seconds: number | typeof NaN) => {
  if (isNaN(seconds)) {
    seconds = 0;
  }

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};
