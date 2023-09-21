import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { ReactNode, createContext } from "react";

interface IInteractedUserProviderContext {
  getUser: (id: string) => Promise<IUser | null>;
  addUser: (user: IUser) => void;
}
interface IProps {
  children: ReactNode;
}

export const InteractedUserProviderContext =
  createContext<IInteractedUserProviderContext>(null as never);

export default function InteractedUserProviderProvider({ children }: IProps) {
  const users: { [k: string]: IUser } = {};

  const fetchUser = async (id: string) => {
    try {
      const user = await fetcher.get<any, IUser>(`/users/${id}`);

      if (!user) return null;

      addUser(user);
      return user;
    } catch (error) {
      return null;
    }
  };

  function addUser(user: IUser) {
    // if (users.find((u) => u._id === user._id)) return;

    users[user._id] = user;
  }

  async function getUser(id: string) {
    const u = users[id];
    if (u) return u;

    return await fetchUser(id);
  }

  const value = {
    getUser,
    addUser,
  };
  return (
    <InteractedUserProviderContext.Provider value={value}>
      {children}
    </InteractedUserProviderContext.Provider>
  );
}
