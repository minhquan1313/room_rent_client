// TRASH :))))) NO USE
import { fetcher } from "@/services/fetcher";
import { IUser, UserLoginPayload, UserRegisterPayload } from "@/types/IUser";
import logger from "@/utils/logger";

export type ActionType =
  | "LOGIN"
  | "LOGIN_TOKEN"
  | "REGISTER"
  | "LOGOUT"
  | "REFRESH";

// type UserActionLOGIN = {
//   type: "LOGIN";
//   payload: {
//     u: UserLoginPayload;
//     remember: boolean;
//   };
// };
// type UserActionREGISTER = {
//   type: "REGISTER";
//   payload: {
//     u: UserRegisterPayload;
//     remember: boolean;
//   };
// };
// type UserActionLOGOUT = {
//   type: "LOGOUT";
// };
// type UserActionREFRESH = {
//   type: "REFRESH";
// };
// type Actions = UserActionLOGOUT | UserActionREFRESH | UserActionLOGIN | UserActionREGISTER;
// type UserAction<T extends ActionType> = Extract<
//   Actions,
//   {
//     type: T;
//   }
// > extends {
//   payload: infer unknown;
// }
//   ? {
//       type: T;
//       payload: PLX[T];
//     }
//   : {
//       type: T;
//     };
type UserAction3<T extends ActionType> = {
  type: T;
  payload: PayLoad[T];
};

// type UserAction2<T extends ActionType> =
//   | {
//       type: "LOGIN";
//       payload: PL[T];
//     }
//   | {
//       type: "REGISTER";
//       payload: PL[T];
//     }
//   | {
//       type: "LOGOUT";
//     }
//   | {
//       type: "REFRESH";
//     };

type PayLoad = {
  LOGIN: {
    u: UserLoginPayload;
    remember: boolean;
  };
  REGISTER: {
    u: UserRegisterPayload;
    remember: boolean;
  };
  LOGOUT: undefined;
  REFRESH: undefined;
  LOGIN_TOKEN: undefined;
};
export type UserState = IUser | null;

export const initUserReducer: UserState = (() => {
  try {
    const userJson = localStorage.getItem("user");

    return userJson ? (JSON.parse(userJson) as IUser) : null;
  } catch (error) {
    return null;
  }
})();

export default async function userReducer<T extends ActionType>(
  state: UserState,
  action: UserAction3<T>,
): Promise<UserState> {
  try {
    switch (action.type) {
      case "LOGIN": {
        const url = `/users/login`;
        const payload = action.payload as PayLoad["LOGIN"];
        const u = payload.u;

        const d = await fetcher.post<IUser>(url, u);
        saveData(d.data, action.payload?.remember);

        return d.data;
      }
      case "REGISTER": {
        const url = `/users`;
        const payload = action.payload as PayLoad["REGISTER"];
        const u = payload.u;

        const d = await fetcher.post<IUser>(url, u);
        saveData(d.data, action.payload?.remember);

        return d.data;
      }
      case "LOGOUT": {
        if (!state) return state;
        localStorage.removeItem("user");

        return null;
      }
      case "LOGIN_TOKEN": {
        if (!state) return state;
        const { token } = state;
        if (!token) return null;

        const url = `/users/login-token`;
        const d = await fetcher.post<IUser>(url);

        if (JSON.stringify(state) === JSON.stringify(d.data)) {
          return state;
        } else {
          saveData(d.data, action.payload?.remember);
          return d.data;
        }
      }
    }

    throw new Error();
  } catch (error) {
    logger(`🚀 ~ file: userReducer.tsx:131 ~ error:`, error);

    clearData();
    return null;
  }
}
// userReducer(null, {
//   type: "REFRESH",
//   payload: undefined,
// });
function clearData() {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");

  fetcher.update({ token: null });
}
function saveData(u: IUser, remember?: boolean) {
  (remember ? localStorage : sessionStorage).setItem("user", JSON.stringify(u));

  u.token && fetcher.update({ token: u.token });
}
