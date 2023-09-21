import { IChatMember } from "@/types/IChatMember";
import { IChatMessage } from "@/types/IChatMessage";

export interface IChatRoom {
  _id: string;

  updatedAt: Date;
  createdAt: Date;
}

// export interface IChatResponse extends IChatRoom {
//   members: IChatMember[];
//   lastMessage: IChatMessage;
// }
export type TChatList = {
  room: string;
  members: IChatMember[];
  messages: IChatMessage[];
};
