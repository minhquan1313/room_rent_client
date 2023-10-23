import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";

export const RoomService = {
  async update(id: string, payload: any) {
    await fetcher.patchForm(`/rooms/${id}`, payload);
  },
  async delete(id: string) {
    await fetcher.delete(`/rooms/${id}`);
  },
  async create(payload: any) {
    await fetcher.postForm<any, IUser>(`/users`, payload);
  },
};
