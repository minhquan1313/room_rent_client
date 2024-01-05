import { TTheme } from "@/Contexts/ThemeProvider";

export function setMetaTheme(theme: TTheme, color?: string) {
  setMeta({ content: theme, name: "color-scheme" });
  setMeta({ content: color, name: "theme-color" });
}

export function setMeta({ name, content }: { name: string; content?: string }) {
  let meta = document.head.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    // create
    meta = document.createElement(`meta`);
    meta.setAttribute(`name`, name);
    document.head.appendChild(meta);
  }

  content ? meta.setAttribute(`content`, content) : meta.remove();
}
