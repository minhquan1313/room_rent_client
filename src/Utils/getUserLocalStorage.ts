import { IUser } from "@/types/IUser";

export function getUserLocalStorage() {
  try {
    const userJson = localStorage.getItem("user");

    if (!userJson) return null;

    const json: IUser = JSON.parse(userJson);
    return json;
  } catch (error) {
    return null;
  }
}
