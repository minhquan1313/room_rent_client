import { UserContext } from "@/Contexts/UserProvider";
import { chatPushNotification } from "@/services/chatPushNotification";
import logger from "@/utils/logger";
import { toStringUserName } from "@/utils/toString";
import { Modal } from "antd";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
};

interface INotificationContext {
  enabling: boolean;
  denied: boolean;
  unRegister: () => Promise<void>;
  register: () => Promise<boolean>;
}

export const NotificationContext = createContext<INotificationContext>(
  null as never,
);
export default function NotificationProvider({ children }: Props) {
  const location = useLocation();

  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [enabling, setEnabling] = useState(false);
  const [denied, setDenied] = useState(false);

  const unRegister = async () => {
    await chatPushNotification.removeServiceWorker();
    clearStorage();
    setEnabling(false);
  };
  const register = async () => {
    try {
      const sub = await chatPushNotification.subscribe();
      if (sub) {
        // save server db
        await chatPushNotification.makeSubscribeToServer(sub);
        setEnabling(true);
        setDenied(false);
        return true;
      }
      return false;
    } catch (error) {
      logger(`🚀 ~ //.then ~ error:`, error);
      unRegister();
      setDenied(true);

      return false;
    }
  };

  useEffect(() => {
    if (!user?._id) {
      logger(`Không có user`);

      /**
       * User logout hoặc đổi user
       * Lúc này cần unregister
       */
      unRegister();
      return;
    }

    /**
     * Nếu user đã bấm cancel trước đó
     * thì lần này không hiện
     */
    if (getStorage() === false) {
      logger(`User đã từ chối`);

      setEnabling(false);
      return;
    }

    chatPushNotification.checkSubscribe().then(async (sub) => {
      logger(
        `🚀 ~ chatPushNotification.subscribe ~ sub:`,
        sub,
        JSON.parse(JSON.stringify(sub)),
      );

      if (sub) {
        /**
         * Đã subscribe
         */
        setEnabling(true);
        return;
      }

      const permission = await chatPushNotification.checkPermission();
      if (permission === false) {
        setDenied(true);
      }

      if (permission !== false && location.pathname === "/") {
        setIsModalOpen(true);
      }
    });
  }, [user?._id, location.pathname]);

  async function handleOk() {
    setStorage(true);
    setLoading(true);

    await register();

    setIsModalOpen(false);
    setLoading(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
    setStorage(false);
  }
  const value = { enabling, denied, unRegister, register };
  logger(
    `🚀 ~ NotificationProvider ~ user?.disabled:`,
    user?.disabled,
    isModalOpen,
    user?.disabled !== true,
  );

  return (
    <NotificationContext.Provider value={value}>
      <Modal
        title="Bật thông báo"
        open={isModalOpen && user?.disabled === false}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Ok nhen"
        cancelText="Hông"
        confirmLoading={loading}
        maskClosable={false}
      >
        <p>
          Nhận thông báo khi có tin nhắn đến hong {toStringUserName(user)}??
        </p>
      </Modal>
      {children}
    </NotificationContext.Provider>
  );
}

function clearStorage() {
  localStorage.removeItem(`firstTimeModalChatPushAsk`);
}
function setStorage(v: boolean) {
  localStorage.setItem(`firstTimeModalChatPushAsk`, String(v));
}
function getStorage(): boolean | undefined {
  const value = localStorage.getItem(`firstTimeModalChatPushAsk`);
  const r = value === "true" ? true : value === "false" ? false : undefined;
  return r;
}
