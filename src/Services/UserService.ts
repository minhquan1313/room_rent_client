import { fetcher } from "@/services/fetcher";

export const UserService = {
  async update(id: string, payload: any) {
    await fetcher.patch(`/users/${id}`, payload);
  },
};
