const a = import.meta.env.VITE_APP_NAME ?? "";

// let currentTitle: string | undefined = a;
export function pageTitle(title: string) {
  const tit = title ? `${title} - ${a}` : a;

  // document.title = tit;
  setTimeout(() => {
    document.title = tit;
  }, 100);

  return (document.title = tit);
}
