export interface INotification {
  _id: string;

  user: string;

  endpoint: string;

  keys: {
    p256dh: string;
    auth: string;
  };

  updatedAt: Date;
  createdAt: Date;
}

export type TSubscription = {
  user: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
