import { IRoomService, ServicesInCategory } from "@/types/IRoomService";

export function convertServiceOptionGroup(d: IRoomService[]) {
  const obj: { [k in string]: IRoomService[] } = {};

  d.forEach((r) => {
    const cate = r.category?.title ?? "unknown";

    obj[cate] ? obj[cate].push(r) : (obj[cate] = [r]);
  });

  const result: ServicesInCategory[] = [];

  let unknown: ServicesInCategory | undefined = undefined;

  Object.keys(obj).forEach((r) => {
    const cate = d.find((e) => e.category?.title === r)?.category;

    const ooo: ServicesInCategory = {
      category: cate ?? "unknown",
      services: obj[r],
      // .sort((a, b) => {
      //   const nameA = (a.display_name ?? a.title).toUpperCase();
      //   const nameB = (b.display_name ?? b.title).toUpperCase();

      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }
      //   return 0;
      // }),
    };
    if (!cate) unknown = ooo;
    result.push(ooo);
  });

  if (unknown) {
    // put unknown at last
    const i = result.indexOf(unknown);

    const t = result[result.length - 1];

    result[i] = t;
    result[result.length - 1] = unknown;
  }

  return result;
}
