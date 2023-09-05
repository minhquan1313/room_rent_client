import { ConfigProvider, ThemeConfig, theme } from "antd";
import { ReactNode, createContext, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};
type TTheme = "light" | "dark";
interface IThemeContext {
  myTheme: TTheme;
  switchTheme: (theme: TTheme | "system") => void;
}

const initTheme = getInitTheme();

const darkToken: ThemeConfig["token"] = {};
const lightToken: ThemeConfig["token"] = {};

export const ThemeContext = createContext<IThemeContext>(null as never);

function getInitTheme(): {
  theme: TTheme;
  manual: boolean;
} {
  const themeStr = localStorage.getItem(`theme`);
  if (themeStr && ["light", "dark"].includes(themeStr))
    return {
      theme: themeStr as TTheme,
      manual: true,
    };

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    return {
      theme: "dark",
      manual: false,
    };
  else
    return {
      theme: "light",
      manual: false,
    };
}

export default function ThemeProvider({ children }: Props) {
  const [myTheme, setMyTheme] = useState<TTheme>(initTheme.theme);
  const [themeChangedManually, setThemeChangedManually] = useState(initTheme.manual);

  useEffect(() => {
    const schemeHandler = (event: MediaQueryListEvent): void => {
      if (themeChangedManually) return;

      const colorScheme = event.matches ? "dark" : "light";
      console.log(colorScheme); // "dark" or "light"
      setMyTheme(colorScheme);
    };
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", schemeHandler);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", schemeHandler);
    };
  }, []);

  const themeConfig: ThemeConfig = {
    algorithm: myTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      ...(myTheme === "dark" ? darkToken : lightToken),
      fontFamily: "SVNPoppins",
    },
  };

  function switchTheme(theme: TTheme | "system") {
    if (theme === "system") {
      setMyTheme(getInitTheme().theme);
      localStorage.removeItem("theme");
    } else {
      setMyTheme(theme);
      setThemeChangedManually(true);

      localStorage.setItem("theme", theme);
    }
  }

  const value = {
    myTheme,
    switchTheme,
  };
  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
