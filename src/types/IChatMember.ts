export interface IChatMember {
  _id: string;

  room: string;
  user: string;

  updatedAt: Date;
  createdAt: Date;
}
