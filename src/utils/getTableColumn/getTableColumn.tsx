import { actionAllowance } from "@/utils/getTableColumn/actionAllowance";
import { filterCustom } from "@/utils/getTableColumn/filterCustom";
import { room } from "@/utils/getTableColumn/room";
import { roomServices } from "@/utils/getTableColumn/roomServices";
import { roomServicesCate } from "@/utils/getTableColumn/roomServicesCate";
import { roomTypes } from "@/utils/getTableColumn/roomTypes";
import { user } from "@/utils/getTableColumn/user";

const getTableColumn = {
  user,
  room,
  filterCustom,
  actionAllowance,
  roomTypes,
  roomServices,
  roomServicesCate,
};
export default getTableColumn;
