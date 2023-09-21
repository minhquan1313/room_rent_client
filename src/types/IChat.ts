export interface IChat {
  _id: string;

  sender: string;
  receiver: string;
  message: string;

  updatedAt: Date;
  createdAt: Date;
}
