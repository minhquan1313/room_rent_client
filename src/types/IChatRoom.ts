import { IChatMember } from "@/types/IChatMember";
import { IChatMessage } from "@/types/IChatMessage";
import { IChatSeen } from "@/types/IChatSeen";

export interface IChatRoom {
  _id: string;

  updatedAt: Date;
  createdAt: Date;
}

export interface IChatMessageWithSeen extends IChatMessage {
  seen: IChatSeen[];
}
export type TChatList = {
  room: string;
  members: IChatMember[];
  messages: IChatMessageWithSeen[];

  canFetchMoreMessage: boolean; //FE only
};
