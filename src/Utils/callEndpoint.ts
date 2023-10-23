/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
enum Endpoint {
  USERS = "/users/:userId",
  USERS2 = "/users/:userId2",
  ORDERS = "/orders",
}
type UsersEndPoint = {
  endpoint: Endpoint.USERS;
  payload: {
    user_id: number;
    name: string;
  };
};
type OrdersEndpoint = {
  endpoint: Endpoint.ORDERS;
};
type Endpoints = UsersEndPoint | OrdersEndpoint;

export function callEndpoint<T extends Endpoints["endpoint"]>(
  ...args: Extract<
    Endpoints,
    {
      endpoint: T;
    }
  > extends { payload: infer PayloadType }
    ? [endpoint: T, payload: PayloadType]
    : [endpoint: T]
) {
  let z = args[1];
  return { args };
}

// enum Endpoint2 {
//   USERS = "/users/:userId",
//   ORDERS = "/orders",
// }

// type Args =
//   | {
//       endPoint: Endpoint2.USERS;
//       param: string;
//     }
//   | { endpoint: Endpoint2.ORDERS };

// function callEndpoint2(args: Args): {
//   //
// };
