import { fetcher } from "@/services/fetcher";
import { IGender } from "@/types/IGender";
import { IRole } from "@/types/IRole";
import { ReactNode, createContext } from "react";
import useSWR from "swr";

type Props = {
  children: ReactNode;
};

interface IThemeContext {
  //
  roles?: IRole[];
  genders?: IGender[];
}
export const GlobalDataContext = createContext<IThemeContext>(null as never);
export default function GlobalDataProvider({ children }: Props) {
  const { data: roles } = useSWR<IRole[]>("/roles", fetcher);
  const { data: genders } = useSWR<IGender[]>("/genders", fetcher);

  const value = {
    roles,
    genders,
  };
  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}
