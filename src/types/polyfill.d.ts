import { TMapAsync } from "@/utils/arrMapAsync";

declare global {
  interface Array {
    mapAsync: TMapAsync;
  }
}
