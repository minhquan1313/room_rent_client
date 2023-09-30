import { fetcher } from "@/services/fetcher";
import { ISaved } from "@/types/ISaved";

export async function getSavedRoomOfUser(
  userId: string,
  limit: number,
  page: number,
) {
  const doc = await fetcher.get<any, ISaved[]>(
    `/saved?${new URLSearchParams({
      user: userId,
      limit: String(limit),
      page: String(page),
    })}`,
  );

  return doc;
}

export async function saveRoom(userId: string, roomId: string) {
  const doc = await fetcher.post<any, ISaved>(`/saved`, {
    userId,
    roomId,
  });

  return doc;
}

export async function deleteSaved(id: string) {
  await fetcher.delete(`/saved/${id}`);
}
