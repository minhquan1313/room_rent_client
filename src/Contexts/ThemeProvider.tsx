import { darkToken, lightToken } from "@/config/themeToken";
import { setMetaTheme } from "@/utils/setMeta";
import { ConfigProvider, theme } from "antd";
import { ReactNode, createContext, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
export type TTheme = "light" | "dark";
interface IThemeContext {
  myTheme: TTheme;
  systemTheme: TTheme;
  isUsingSystemTheme: boolean;
  switchTheme: (theme: TTheme | "system") => void;
}

const initTheme = getInitTheme();

export const ThemeContext = createContext<IThemeContext>(null as never);
export default function ThemeProvider({ children }: Props) {
  const [myTheme, setMyTheme] = useState<TTheme>(initTheme.theme);
  console.log(`🚀 ~ ThemeProvider ~ myTheme:`, myTheme);

  const [systemTheme, setSystemTheme] = useState<TTheme>(initTheme.systemTheme);
  console.log(`🚀 ~ ThemeProvider ~ systemTheme:`, systemTheme);

  const [isUsingSystemTheme, setIsUsingSystemTheme] = useState(
    !initTheme.manual,
  );
  console.log(`🚀 ~ ThemeProvider ~ isUsingSystemTheme:`, isUsingSystemTheme);

  function switchTheme(theme: TTheme | "system") {
    if (theme === "system") {
      localStorage.removeItem("theme");

      setMyTheme(getInitTheme().systemTheme);
      setIsUsingSystemTheme(true);
    } else {
      localStorage.setItem("theme", theme);

      setMyTheme(theme);
      setIsUsingSystemTheme(false);
    }
  }

  useEffect(() => {
    const schemeHandler = (event: MediaQueryListEvent): void => {
      const colorScheme = event.matches ? "dark" : "light";

      setSystemTheme(colorScheme);
      if (isUsingSystemTheme) return;

      setMyTheme(colorScheme);
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", schemeHandler);

    return () => {
      mediaQuery.removeEventListener("change", schemeHandler);
    };
  }, [isUsingSystemTheme]);

  useEffect(() => {
    setMetaTheme(
      myTheme,
      myTheme === "dark"
        ? darkToken?.colorBgContainer
        : lightToken?.colorBgContainer,
    );
  }, [myTheme]);

  const value = {
    myTheme,
    systemTheme,
    isUsingSystemTheme,
    switchTheme,
  };
  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm:
            myTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            ...(myTheme === "dark" ? darkToken : lightToken),
            fontFamily: "SVNPoppins",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

function getInitTheme(): {
  theme: TTheme;
  systemTheme: TTheme;
  manual: boolean;
} {
  const systemTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  console.log(`🚀 ~ getInitTheme ~ systemTheme:`, systemTheme);

  const themeStr = localStorage.getItem(`theme`);
  if (themeStr && ["light", "dark"].includes(themeStr))
    return {
      theme: themeStr as TTheme,
      manual: true,
      systemTheme,
    };

  return {
    theme: systemTheme,
    manual: false,
    systemTheme,
  };
}
