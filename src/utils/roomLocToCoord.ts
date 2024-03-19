import { RoomPayload } from "@/types/IRoom";
import { IRoomLocation } from "@/types/IRoomLocation";
import { Coords } from "google-map-react";

export function roomLocPayloadToCoord<T extends RoomPayload["location"] | null | undefined>(
  location?: T,
): T extends null | undefined ? undefined : Coords {
  return location
    ? {
        lat: location.lat,
        lng: location.long,
      }
    : (undefined as any);
}

export function roomLocToPayload<T extends IRoomLocation | null | undefined>(location?: T): T extends null | undefined ? undefined : Coords {
  return location
    ? {
        lat: location.lat_long.coordinates[1],
        long: location.lat_long.coordinates[0],
      }
    : (undefined as any);
}
function roomLocToCoord<T extends IRoomLocation | null | undefined>(location?: T): T extends null | undefined ? undefined : Coords {
  return location
    ? {
        lat: location.lat_long.coordinates[1],
        lng: location.lat_long.coordinates[0],
      }
    : (undefined as any);
}

export default roomLocToCoord;
