export type Either<T, E> = [T, null] | [null, E];

export async function e<T, E extends Error>(
  promise: Promise<T>
): Promise<Either<T, E>> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
