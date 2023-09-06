import { ConfigProvider, ThemeConfig, theme } from "antd";
import { ReactNode, createContext, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
type TTheme = "light" | "dark";
interface IThemeContext {
  myTheme: TTheme;
  systemTheme: TTheme;
  themeChangedManually: boolean;
  switchTheme: (theme: TTheme | "system") => void;
}

const initTheme = getInitTheme();

const darkToken: ThemeConfig["token"] = {};
const lightToken: ThemeConfig["token"] = {};

export const ThemeContext = createContext<IThemeContext>(null as never);

function getInitTheme(): { theme: TTheme; systemTheme: TTheme; manual: boolean } {
  const systemTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

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

export default function ThemeProvider({ children }: Props) {
  const [myTheme, setMyTheme] = useState<TTheme>(initTheme.theme);
  const [systemTheme, setSystemTheme] = useState<TTheme>(initTheme.systemTheme);
  const [themeChangedManually, setThemeChangedManually] = useState(initTheme.manual);

  function switchTheme(theme: TTheme | "system") {
    if (theme === "system") {
      localStorage.removeItem("theme");

      setMyTheme(getInitTheme().systemTheme);
      setThemeChangedManually(false);
    } else {
      localStorage.setItem("theme", theme);

      setMyTheme(theme);
      setThemeChangedManually(true);
    }
  }

  useEffect(() => {
    const schemeHandler = (event: MediaQueryListEvent): void => {
      const colorScheme = event.matches ? "dark" : "light";

      setSystemTheme(colorScheme);
      if (themeChangedManually) return;

      setMyTheme(colorScheme);
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", schemeHandler);

    return () => {
      mediaQuery.removeEventListener("change", schemeHandler);
    };
  }, [themeChangedManually]);

  const value = {
    myTheme,
    systemTheme,
    themeChangedManually,
    switchTheme,
  };
  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: myTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            ...(myTheme === "dark" ? darkToken : lightToken),
            fontFamily: "SVNPoppins",
          },
        }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
