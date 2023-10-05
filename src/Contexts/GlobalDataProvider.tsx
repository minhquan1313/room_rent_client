import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { fetcher } from "@/services/fetcher";
import { IGender } from "@/types/IGender";
import { IRole } from "@/types/IRole";
import { IRoomService, ServicesInCategory } from "@/types/IRoomService";
import { IRoomServiceCategory } from "@/types/IRoomServiceCategory";
import { IRoomType } from "@/types/IRoomType";
import { convertServiceOptionGroup } from "@/utils/convertServiceOptionGroup";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

type Props = {
  children: ReactNode;
};

interface IContext {
  //
  roles?: IRole[];
  genders?: IGender[];
  roomServices?: IRoomService[];
  roomServicesConverted?: ServicesInCategory[];
  roomTypes?: IRoomType[];
  provincesAvailable?: string[];
  districtsAvailable?: string[];
  roomServiceCategories?: IRoomServiceCategory[];

  mutateRoles(): Promise<void>;
  mutateGenders(): Promise<void>;
  mutateRoomServices(): Promise<void>;
  mutateProvincesAvailable(): Promise<void>;
  mutateDistrictsAvailable(): Promise<void>;
  mutateRoomTypes(): Promise<void>;
  mutateRoomServiceCategories(): Promise<void>;
}
export const GlobalDataContext = createContext<IContext>(null as never);
export default function GlobalDataProvider({ children }: Props) {
  const { user } = useContext(UserContext);

  const { data: roles, mutate: mutateRoles } = useSWR<IRole[]>(
    "/roles",
    fetcher,
  );
  const { data: roomServiceCategories, mutate: mutateRoomServiceCategories } =
    useSWR<IRoomServiceCategory[]>("/room-services-cate", fetcher);
  const { data: genders, mutate: mutateGenders } = useSWR<IGender[]>(
    "/genders",
    fetcher,
  );
  const { data: roomServices, mutate: mutateRoomServices } = useSWR<
    IRoomService[]
  >("/room-services", fetcher);
  const { data: provincesAvailable, mutate: mutateProvincesAvailable } = useSWR<
    string[]
  >(isRoleAdmin(user?.role?.title) ? "/location/provinces" : null, fetcher);
  const { data: districtsAvailable, mutate: mutateDistrictsAvailable } = useSWR<
    string[]
  >(isRoleAdmin(user?.role?.title) ? "/location/districts" : null, fetcher);
  const { data: roomTypes, mutate: mutateRoomTypes } = useSWR<IRoomType[]>(
    "/room-types",
    fetcher,
  );
  const [roomServicesConverted, setRoomServicesConverted] =
    useState<ServicesInCategory[]>();

  useEffect(() => {
    if (!roomServices) return;

    setRoomServicesConverted(
      convertServiceOptionGroup(
        [...roomServices].sort(
          (a, b) => a.display_name?.localeCompare(b.display_name || "") || 0,
        ),
      ),
    );
  }, [roomServices]);

  const value = {
    roles,
    genders,
    roomServices,
    roomServicesConverted,
    roomTypes,
    provincesAvailable,
    districtsAvailable,
    roomServiceCategories,
    mutateRoles,
    mutateGenders,
    mutateRoomServices,
    mutateProvincesAvailable,
    mutateDistrictsAvailable,
    mutateRoomTypes,
    mutateRoomServiceCategories,
  };
  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
}
