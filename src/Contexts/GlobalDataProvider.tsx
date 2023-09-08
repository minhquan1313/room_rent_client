import { fetcher } from "@/services/fetcher";
import { IGender } from "@/types/IGender";
import { IRole } from "@/types/IRole";
import { IRoomService } from "@/types/IRoomService";
import { IRoomType } from "@/types/IRoomType";
import { ReactNode, createContext } from "react";
import useSWR from "swr";

type Props = {
  children: ReactNode;
};

interface IThemeContext {
  //
  roles?: IRole[];
  genders?: IGender[];
  roomServices?: IRoomService[];
  roomTypes?: IRoomType[];
}
export const GlobalDataContext = createContext<IThemeContext>(null as never);
export default function GlobalDataProvider({ children }: Props) {
  const { data: roles } = useSWR<IRole[]>("/roles", fetcher);
  const { data: genders } = useSWR<IGender[]>("/genders", fetcher);
  const { data: roomServices } = useSWR<IRoomService[]>(
    "/room-services",
    fetcher,
  );
  const { data: roomTypes } = useSWR<IRoomType[]>("/room-types", fetcher);

  const value = {
    roles,
    genders,
    roomServices,
    roomTypes,
  };
  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}
