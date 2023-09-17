import { IRoom } from "@/types/IRoom";
import { ReactNode, createContext, useState } from "react";

interface IRoomContext {
  currentRoom: IRoom | undefined;
  setCurrentRoom: React.Dispatch<React.SetStateAction<IRoom | undefined>>;
}
interface IProps {
  children: ReactNode;
}

export const RoomContext = createContext<IRoomContext>(null as never);

export default function RoomProvider({ children }: IProps) {
  const [currentRoom, setCurrentRoom] = useState<IRoom>();

  const value = {
    currentRoom,
    setCurrentRoom,
  };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
