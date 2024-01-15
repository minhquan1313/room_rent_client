import { fetcher } from "@/services/fetcher";
import { IUser, UserLoginPayload, UserRegisterPayload } from "@/types/IUser";
import { getUserLocalStorage } from "@/utils/getUserLocalStorage";
import logger from "@/utils/logger";
import { toStringUserName } from "@/utils/toString";
import { Modal } from "antd";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IUserContext {
  user: IUser | null;
  isLogging: boolean;
  login: (u: UserLoginPayload, remember: boolean) => Promise<IUser>;
  logout: () => void;
  refresh: () => void;
  register: (u: UserRegisterPayload, remember: boolean) => Promise<IUser>;
  loginTokenBackground: (
    token: string,
    remember: boolean,
  ) => Promise<IUser | null>;
}
interface IProps {
  children: ReactNode;
}

export const UserContext = createContext<IUserContext>(null as never);

export default function UserProvider({ children }: IProps) {
  const [user, setUser] = useState<IUserContext["user"]>(getUserLocalStorage());
  const [isLogging, setIsLogging] = useState(false);

  const login = useCallback(async (u: UserLoginPayload, remember: boolean) => {
    setIsLogging(true);

    try {
      const url = `/users/login`;

      const user = await fetcher.post<never, IUser>(url, u);
      logger(`🚀 ~ login ~ user:`, user);

      setIsLogging(false);

      saveData(user, remember);
      setUser(user);
      // _user = user;
      return user;
    } catch (error) {
      logout();
      setIsLogging(false);

      // return null;
      throw error;
    }
  }, []);

  const loginTokenBackground = useCallback(
    async (token: string, remember: boolean) => {
      // setIsLogging(() => true);
      const url = `/users/login-token`;

      try {
        const user = await fetcher.post<never, IUser>(url, undefined, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetcher.update({
          token,
        });

        // setIsLogging(() => false);

        saveData(user, remember);
        setUser(user);

        return user;
      } catch (error) {
        logout();
        // setIsLogging(() => false);

        return null;
      }
    },
    [],
  );

  const logout = () => {
    logger(`calling logout`);

    clearData();
    setUser(null);
  };

  const register = useCallback(async function (
    u: UserRegisterPayload,
    remember: boolean,
  ) {
    try {
      const user = await fetcher.post<never, IUser>(`/users`, u);
      logger(`🚀 ~ UserProvider ~ user:`, user);

      saveData(user, remember);
      setUser(() => user);
      return user;
    } catch (error) {
      logger(`🚀 ~ UserProvider ~ error:`, error);

      logout();

      throw error;
    }
  }, []);

  const refresh = useCallback(() => {
    user?.token && loginTokenBackground(user.token, true);
  }, [loginTokenBackground, user?.token]);

  // refresh token on app start
  useEffect(() => {
    if (user) {
      user.token && loginTokenBackground(user.token, true);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        loginTokenBackground(token, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh token background
  // useEffect(() => {
  //   function autoLogin() {
  //     user && user.token && loginTokenBackground(user.token, isRemember);
  //   }

  //   // const itv = setInterval(autoLogin, 60000);

  //   // return () => clearInterval(itv);
  // }, [loginTokenBackground, user]);

  useEffect(() => {
    const myInterceptor = fetcher.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        logger(`🚀 ~ useEffect ~ error:`, error);

        error.response.status === 401 && logout();
        return Promise.reject(error);
      },
    );

    return () => {
      fetcher.interceptors.response.eject(myInterceptor);
    };
  }, []);

  const value: IUserContext = useMemo(
    () => ({
      user,
      isLogging,
      login,
      logout,
      register,
      loginTokenBackground,
      refresh,
    }),
    [isLogging, login, loginTokenBackground, refresh, register, user],
  );
  return (
    <UserContext.Provider value={value}>
      <Modal
        title="Bị chặn gòi"
        open={Boolean(user && user?.disabled === true)}
        closable={false}
        okText="Đăng xuất"
        okType="primary"
        onOk={logout}
        cancelButtonProps={{
          hidden: true,
        }}
        maskClosable={false}
      >
        <p>
          Bạn đã bị chặn rùi {toStringUserName(user)} ơi :{">"}
        </p>
      </Modal>

      {children}
    </UserContext.Provider>
  );
}

function clearData() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");

  fetcher.update({ token: null });
}
function saveData(u: IUser, remember: boolean) {
  (remember ? localStorage : sessionStorage).setItem("user", JSON.stringify(u));
  if (u.token) {
    (remember ? localStorage : sessionStorage).setItem("token", u.token);

    fetcher.update({ token: u.token });
  }
}

// function getUserLocalStorage() {
//   try {
//     let userJson = localStorage.getItem("user");
//     if (userJson) {
//       isRemember = true;
//     } else {
//       isRemember = false;
//       userJson = sessionStorage.getItem("user");
//     }

//     if (!userJson) throw new Error();

//     const json: IUser = JSON.parse(userJson);
//     return json;
//   } catch (error) {
//     return null;
//   }
// }
