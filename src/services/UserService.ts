import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";

export const UserService = {
  async update(id: string, payload: any) {
    await fetcher.patchForm(`/users/${id}`, payload);
  },
  async delete(id: string) {
    await fetcher.delete(`/users/${id}`);
  },
  async create(payload: any) {
    await fetcher.postForm<any, IUser>(`/users`, payload);
  },
};
