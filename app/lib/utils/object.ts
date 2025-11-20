export function omitNullUndefined<T extends object>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      newObj[key as keyof T] = value;
    }
  }

  return newObj;
}
