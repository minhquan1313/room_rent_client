import { fetcher } from "@/services/fetcher";
import { IUser, UserLoginPayload, UserRegisterPayload } from "@/types/IUser";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
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

function getData() {
  try {
    let userJson = localStorage.getItem("user");
    if (userJson) {
      isRemember = true;
    } else {
      isRemember = false;
      userJson = sessionStorage.getItem("user");
    }

    if (!userJson) throw new Error();

    const json: IUser = JSON.parse(userJson);
    return json;
  } catch (error) {
    return null;
  }
}

let isRemember = false;

export const UserContext = createContext<IUserContext>(null as never);

export default function UserProvider({ children }: IProps) {
  const [user, setUser] = useState<IUserContext["user"]>(getData());
  const [isLogging, setIsLogging] = useState(false);

  const login = useCallback(async (u: UserLoginPayload, remember: boolean) => {
    setIsLogging(() => true);

    try {
      const url = `/users/login`;

      const user = await fetcher.post<never, IUser>(url, u);
      setIsLogging(() => false);

      saveData(user, remember);
      setUser(() => user);
      // _user = user;
      return user;
    } catch (error) {
      logout();
      setIsLogging(() => false);

      // return null;
      throw error;
    }
  }, []);

  const loginTokenBackground = useCallback(
    async (token: string, remember: boolean) => {
      setIsLogging(() => true);
      const url = `/users/login-token`;

      try {
        const user = await fetcher.post<never, IUser>(url, undefined, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetcher.update({
          token,
        });

        setIsLogging(() => false);

        saveData(user, remember);
        setUser(() => user);

        return user;
      } catch (error) {
        logout();
        setIsLogging(() => false);

        return null;
      }
    },
    [],
  );
  const register = useCallback(async function (
    u: UserRegisterPayload,
    remember: boolean,
  ) {
    try {
      const user = await fetcher.post<never, IUser>(`/users`, u);
      console.log(`🚀 ~ UserProvider ~ user:`, user);

      saveData(user, remember);
      setUser(() => user);
      return user;
    } catch (error) {
      console.log(`🚀 ~ UserProvider ~ error:`, error);

      logout();

      throw error;
    }
  }, []);
  const refresh = () => {
    user?.token && loginTokenBackground(user.token, true);
  };
  const logout = () => {
    clearData();
    setUser(null);
  };

  // refresh token on app start and get user change
  useEffect(() => {
    user && user.token && loginTokenBackground(user.token, isRemember);
    // console.log(`🚀 ~ file: UserContext.tsx:120 ~ useEffect ~ user:`, user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const myInterceptor = fetcher.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        error.response.status === 401 && logout();
        // throw error;
        return Promise.reject(error);
      },
    );

    return () => {
      fetcher.interceptors.response.eject(myInterceptor);
    };
  }, []);

  const value: IUserContext = {
    user,
    isLogging,
    login,
    logout,
    register,
    loginTokenBackground,
    refresh,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
