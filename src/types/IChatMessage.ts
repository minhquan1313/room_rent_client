import { IChatMember } from "@/types/IChatMember";

export interface IChatMessage {
  _id: string;

  room: string;
  sender: string;
  message: string;

  updatedAt: string;
  createdAt: string;
}

type IChatMessageWithoutProps = Omit<
  IChatMessage,
  "_id" | "updatedAt" | "createdAt" | "room"
>;

export type IChatMessagePayload = IChatMessageWithoutProps & {
  receiver: string[];
  room?: string;
  members?: IChatMember[];
};
