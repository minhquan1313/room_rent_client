import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import logger from "@/utils/logger";
import { ReactNode, createContext, useCallback, useRef, useState } from "react";

interface IInteractedUserProviderContext {
  getUser: (id?: string | null) => IUser | null;
  preloadUser: (id: string | string[]) => Promise<void>;
  addUser: (user: IUser) => void;
  hasUsers: (id: string[]) => boolean;
}
interface IProps {
  children: ReactNode;
}

export const InteractedUserProviderContext =
  createContext<IInteractedUserProviderContext>(null as never);

export default function InteractedUserProviderProvider({ children }: IProps) {
  const users = useRef<{ [k: string]: IUser }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_shouldUpdate, setShouldUpdate] = useState({});

  const fetchingUser = useRef<{ [k: string]: boolean }>({});

  const fetchUser = async (id: string) => {
    if (fetchingUser.current[id]) return;

    try {
      fetchingUser.current[id] = true;
      const user = await fetcher.get<any, IUser>(`/users/${id}`);

      if (!user) return;

      addUser(user);
      return;
    } catch (error) {
      return;
    }
  };

  function addUser(user: IUser) {
    // if (users.current[user._id]) {
    //   users.current[user._id] = user;
    //   return;
    // } else {
    users.current[user._id] = user;
    setShouldUpdate({});
    // }
  }

  function preloadUser(id: string | string[]) {
    return new Promise<void>((rs) => {
      // const promises: Promise<void>[] = [];

      if (Array.isArray(id)) {
        id.forEach((id) => {
          if (users.current[id]) return;
          fetchUser(id);
          // promises.push(fetchUser(id));
        });

        const i = setInterval(() => {
          let someNotFetched = false;

          for (const i of id) {
            if (users.current[i]) continue;

            someNotFetched = true;
            break;
          }

          if (!someNotFetched) {
            clearInterval(i);
            rs();
          }
        }, 50);

        // Promise.all(promises).then(() => {
        //   logger(`oks`);

        //   rs();
        // });
      } else {
        if (users.current[id]) return;
        fetchUser(id).then(() => {
          logger(`ok`);

          rs();
        });
      }
    });
  }
  const hasUsers = useCallback(function (id: string[]) {
    return Object.keys(users.current).every((e) => id.includes(e));
  }, []);

  function getUser(id?: string | null): IUser | null {
    // logger(`🚀 ~ getUser ~ id:`, id);

    if (!id) return null;
    // if (!id) throw new Error("Missing ID");

    const u = users.current[id];
    // logger(`🚀 ~ getUser ~ u:`, u);

    if (u) return u;

    fetchUser(id);

    // throw new Error("User not found");
    return null;
  }

  const value = {
    getUser,
    preloadUser,
    addUser,
    hasUsers,
  };
  return (
    <InteractedUserProviderContext.Provider value={value}>
      {children}
    </InteractedUserProviderContext.Provider>
  );
}
