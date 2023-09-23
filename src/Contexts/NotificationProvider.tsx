import { UserContext } from "@/Contexts/UserProvider";
import { chatPushNotification } from "@/services/chatPushNotification";
import { toStringUserName } from "@/utils/toString";
import { Modal } from "antd";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

interface IThemeContext {
  //
}

export const NotificationContext = createContext<IThemeContext>(null as never);
export default function NotificationProvider({ children }: Props) {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) {
      console.log(`Không có user`);

      /**
       * User logout hoặc đổi user
       * Lúc này cần unregister
       */
      chatPushNotification.removeServiceWorker();
      clearStorage();
      return;
    }

    /**
     * Nếu user đã bấm cancel trước đó
     * thì lần này không hiện
     */
    if (getStorage() === false) {
      console.log(`User đã từ chối`);

      return;
    }

    console.log(`Check sub`);

    chatPushNotification.checkSubscribe().then(async (sub) => {
      console.log(
        `🚀 ~ chatPushNotification.subscribe ~ sub:`,
        sub,
        JSON.parse(JSON.stringify(sub)),
      );

      if (sub) return;

      const per = await chatPushNotification.checkPermission();
      if (per !== false) setIsModalOpen(true);
    });
  }, [user?._id]);

  async function handleOk() {
    setStorage(true);
    setLoading(true);
    try {
      const sub = await chatPushNotification.subscribe();
      //    .then((sub) => {
      console.log(
        `🚀 ~ chatPushNotification.subscribe ~ sub:`,
        sub,
        JSON.parse(JSON.stringify(sub)),
      );

      if (sub) {
        //
        await chatPushNotification.makeSubscribeToServer(sub);
      }

      // save server db
    } catch (error) {
      //
    }
    setIsModalOpen(false);
    setLoading(false);
    // });
  }

  function handleCancel() {
    setIsModalOpen(false);
    setStorage(false);
  }

  const value = {};
  return (
    <NotificationContext.Provider value={value}>
      <Modal
        title="Bật thông báo"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Ok nhen"
        cancelText="Hông"
        confirmLoading={loading}
        maskClosable={false}
      >
        <p>
          Nhận thông báo khi có tin nhắn đến không {toStringUserName(user)}??
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
