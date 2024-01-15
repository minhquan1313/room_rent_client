import { UserContext } from "@/Contexts/UserProvider";
import { IRoom } from "@/types/IRoom";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

interface IContext {
  saved: IRoom[];
  page: number;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  remove: (roomId: string) => void;
  add: (s: IRoom, pos?: "left" | "right") => void;
}
export const SavedContext = createContext<IContext>(null as never);
export default function SavedProvider({ children }: Props) {
  const { user } = useContext(UserContext);

  const [saved, setSaved] = useState<IRoom[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const { data: savedRooms } = useSWR<IRoom[]>(
  //   () => `/saved?user=${user!._id}`,
  //   fetcher,
  // );

  function add(s: IRoom, pos: "left" | "right" = "right") {
    setSaved((saved) => {
      if (saved.find((r) => r._id === s._id)) return saved;

      return pos === "left" ? [s, ...saved] : [...saved, s];
    });
  }
  function remove(roomId: string) {
    setSaved((saved) => saved.filter((r) => r._id !== roomId));
  }
  function reset() {
    setSaved([]);
    setPage(1);
    setHasMore(true);
  }

  useEffect(() => {
    if (user) return;
    reset();
    // logger(`🚀 ~ SavedProvider ~ savedRooms:`, savedRooms);
  }, [user]);

  const value = useMemo(
    () => ({
      saved,
      page,
      hasMore,
      setHasMore,
      setPage,
      remove,
      add,
    }),
    [hasMore, page, saved],
  );
  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}
