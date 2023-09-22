export interface IChatSeen {
  _id: string;

  room: string;
  message_id: string;
  seen_by: string;

  updatedAt: Date;
  createdAt: Date;
}
