export function numberFormat<T = unknown>(value?: string | number, K?: T) {
  let s = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (K === true && s.length >= 5) {
    s = s.slice(0, -4) + "K";
  }

  return s;
}

export function numberParser(value?: string) {
  return value!.replace(/\$\s?|(,*)/g, "");
}
