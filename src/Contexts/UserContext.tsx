import { fetcher } from "@/services/fetcher";
import { IUser, UserLoginPayload, UserRegisterPayload } from "@/types/IUser";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

interface IUserContext<T = IUser | null> {
  user: T;
  isLogging: boolean;
  login: (u: UserLoginPayload, remember: boolean) => Promise<T>;
  logout: () => void;
  register: (u: UserRegisterPayload, remember: boolean) => Promise<T>;
  loginTokenBackground: (token: string, remember: boolean) => Promise<T>;
}
interface IProps {
  children: ReactNode;
}

function clearData() {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");

  fetcher.update({ token: null });
}
function saveData(u: IUser, remember: boolean) {
  (remember ? localStorage : sessionStorage).setItem("user", JSON.stringify(u));

  u.token && fetcher.update({ token: u.token });
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
    try {
      const url = `/users/login`;
      setIsLogging(true);

      const d = await fetcher.post<IUser>(url, u);
      console.log(`🚀 ~ file: UserContext.tsx:52 ~ login ~ d:`, d);

      const user = d.data;

      saveData(user, remember);
      setUser(() => user);

      return user;
    } catch (error) {
      logout();

      return null;
    }
  }, []);
  const loginTokenBackground = useCallback(async (token: string, remember: boolean) => {
    try {
      const url = `/users/login-token`;

      fetcher.update({
        token,
      });

      const d = await fetcher.post<IUser>(url);
      console.log(`🚀 ~ file: UserContext.tsx:83 ~ loginTokenBackground ~ d:`, d);

      const user = d.data;

      saveData(user, remember);
      setUser(() => user);

      return user;
    } catch (error) {
      logout();

      return null;
    }
  }, []);
  const register = useCallback(async (u: UserRegisterPayload, remember: boolean) => {
    try {
      const url = `/users/register/`;
      const d = await fetcher.post<IUser>(url, u);
      console.log(`🚀 ~ file: UserContext.tsx:73 ~ register ~ d:`, d);

      const user = d.data;
      saveData(user, remember);
      setUser(() => user);

      return user;
    } catch (error) {
      logout();

      return null;
    }
  }, []);
  const logout = () => {
    clearData();
    setUser(() => null);
  };

  // refresh token on app start and get user change
  useEffect(() => {
    user && user.token && loginTokenBackground(user.token, isRemember);
    console.log(`🚀 ~ file: UserContext.tsx:120 ~ useEffect ~ user:`, user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    isLogging,
    login,
    logout,
    register,
    loginTokenBackground,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
