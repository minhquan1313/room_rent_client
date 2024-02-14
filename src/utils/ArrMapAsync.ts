export default async function ArrMapAsync<T, U>(
  arr: T[],
  mapCb: Promise<(item) => U>,
) {
  await Promise.all(arr.map(mapCb));
}
