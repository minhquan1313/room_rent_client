// export default async function arrMapAsync<T, U>(
//   arr: T[],
//   mapCb: (item: T, i: number, original: T[]) => U,
// ) {
//   return await Promise.all(
//     arr.map(async (...params) => await mapCb(...params)),
//   );
// }

export type TMapAsync = typeof mapAsync;

async function mapAsync<T, U>(
  this: T[],
  mapCb: (item: T, i: number, original: T[]) => U,
) {
  return await Promise.all(
    this.map(async (...params) => await mapCb(...params)),
  );
}

export function polyfillArrMapAsync() {
  Array.prototype["mapAsync"] = mapAsync;
}
