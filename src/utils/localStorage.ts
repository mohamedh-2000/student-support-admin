export function readLS<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function writeLS<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
