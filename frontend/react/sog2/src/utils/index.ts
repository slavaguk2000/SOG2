type MapFunction<T, P> = (item: T, idx: number) => P;
type KeyMapperFunction<T> = (item: T) => string;

export function arrayToMap<T extends Record<string, unknown>, P>(
  array: T[],
  options: { key?: string; mapper: MapFunction<T, P> },
): Record<string, P>;

export function arrayToMap<T extends Record<string, unknown>>(
  array: T[],
  options?: { key?: string },
): Record<string, T>;

export function arrayToMap<T extends Record<string, unknown>>(
  array: T[],
  options: { keyMapper: KeyMapperFunction<T> },
): Record<string, T>;

export function arrayToMap<T extends Record<string, unknown>, P>(
  array: T[],
  options?: { key?: string; mapper?: MapFunction<T, P>; keyMapper?: KeyMapperFunction<T> },
): Record<string, P | T> {
  const keyMapper = options?.keyMapper ?? ((item: T) => item[options?.key || 'id'] as string);

  return array.reduce((acc: Record<string, P | T>, item, idx) => {
    acc[keyMapper(item)] = options?.mapper ? options.mapper(item, idx) : item;
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
