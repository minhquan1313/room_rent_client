import { getUserCoords } from "@/utils/getUserCoords";
import logger from "@/utils/logger";
import { Coords } from "google-map-react";
import { ReactNode, createContext, useState } from "react";

interface IUserLocationContext {
  coords: Coords | undefined;
  locationDenied: boolean | undefined;
  refreshCoords: () => Promise<Coords | null | undefined>;
}
interface IProps {
  children: ReactNode;
}

export const UserLocationContext = createContext<IUserLocationContext>(
  null as never,
);

export default function UserLocationProvider({ children }: IProps) {
  const [coords, setCoords] = useState<Coords>();
  const [locationDenied, setLocationDenied] = useState<boolean>();

  const refreshCoords = async () => {
    if (locationDenied) return null;

    const coord = await getUserCoords();
    logger(`🚀 ~ refreshCoords ~ coord:`, coord);

    if (typeof coord !== "object") {
      if (coord === "PERMISSION_DENIED") setLocationDenied(true);
      return null;
    }

    setCoords(coord);
    return coord;
  };

  const value = {
    coords,
    locationDenied,
    refreshCoords,
  };
  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}
