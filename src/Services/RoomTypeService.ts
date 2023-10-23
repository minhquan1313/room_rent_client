import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";

const BASE_URL = "room-types";
export const RoomTypeService = {
  async update(id: string, payload: any) {
    await fetcher.patch(`/${BASE_URL}/${id}`, payload);
  },
  async delete(id: string) {
    await fetcher.delete(`/${BASE_URL}/${id}`);
  },
  async create(payload: any) {
    await fetcher.post<any, IUser>(`/${BASE_URL}`, payload);
  },
};
