export interface INotification {
  _id: string;

  user: string;

  endpoint: string;

  keys: {
    p256dh: string;
    auth: string;
  };

  updatedAt: string;
  createdAt: string;
}

export type TSubscription = {
  user: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
