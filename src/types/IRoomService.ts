import { IRoomServiceCategory } from "./IRoomServiceCategory";

export type TRoomService =
  | "wifi"
  | "mt"
  | "tttp"
  | "nth"
  | "anc"
  | "hgx"
  | "og"
  | "gl"
  | "bnl"
  | "kb"
  | "mg"
  | "dh"
  | "tl"
  | "gn"
  | "taq"
  | "bct"
  | "bdxr"
  | "can"
  | "hb"
  | "sv"
  | "c"
  | "st"
  | "bv"
  | "th"
  | "cv"
  | "bxb"
  | "tttdtt";
export interface IRoomService {
  _id: string;

  title: string;
  display_name: string | null;
  category: IRoomServiceCategory | null;

  updatedAt: string;
  createdAt: string;
}

export type ServicesInCategory = {
  category: IRoomServiceCategory | "unknown";
  services: IRoomService[];
};
