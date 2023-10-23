export function isMobile() {
  const isMobile = /Mobile|Android/i.test(navigator.userAgent);

  return isMobile;
}
