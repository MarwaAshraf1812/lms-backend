import redis from "../config/redis";

export async function getCachedData<T = unknown>(
  key: string
): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;
  return JSON.parse(cached) as T;
}

export async function setCachedData(
  key: string,
  data: unknown,
  ttlSeconds = 60
): Promise<void> {
  await redis.set(key, JSON.stringify(data), { EX: ttlSeconds });
}
