import { UserContext } from "@/Contexts/UserProvider";
import { chatSocketAction } from "@/constants/chatSocketAction";
import { VITE_CHAT_SERVER } from "@/constants/env";
import { fetcher } from "@/services/fetcher";
import { IChatMessage, IChatMessagePayload } from "@/types/IChatMessage";
import { TChatList } from "@/types/IChatRoom";
import { arrayMoveImmutable } from "array-move";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import useSWR from "swr";

interface IChatSocketContext {
  room: TChatList | undefined;
  // messages,
  isFetchingMessage: boolean;
  canFetchMoreMessage: boolean;
  chatList: TChatList[];
  switchRoom: (room?: string | undefined) => void;
  sendMessageInRoom: (msg: {
    message: string;
    room?: string | undefined;
  }) => void;
  sendMessageToNewUser: (msg: { message: string; receiver: string[] }) => void;
  loadMoreHistoryChat: () => void;
}

interface IProps {
  children: ReactNode;
}

export const ChatSocketContext = createContext<IChatSocketContext>(
  null as never,
);

const LIMIT = 10;
export default function ChatSocketProvider({ children }: IProps) {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket>();

  /**
   * Chat room được fetch duy nhất 1 lần từ server, để lấy các chat
   * trong lịch sử, khi có chat mới đến, cũng cập nhật lại chatList này
   */
  const [chatList, setChatList] = useState<TChatList[]>([]);

  /**
   * Khi user focus vào 1 chat nào đó, thì switch room qua chat đó
   * nếu user focus vào
   */
  const [receiver, setReceiver] = useState<string[]>([]);
  const [room, setRoom] = useState<TChatList>();
  const [canFetchMoreMessage, setCanFetchMoreMessage] = useState(true);
  // const [messages, setMessages] = useState<IChatMessage[]>([]);

  const [shouldFetch, setShouldFetch] = useState(true);
  const { data: chatListInit, isLoading } = useSWR<TChatList[]>(
    () => (shouldFetch ? `/chat/list/${user!._id}` : null),
    fetcher,
  );

  // function reset() {
  //   setSocket(undefined);
  //   setRoom(undefined);
  //   setMessages([]);
  //   setChatList([]);
  // }

  const sendMessageToNewUser = (msg: {
    message: string;
    receiver: string[];
  }) => {
    console.log(`🚀 ~ ChatSocketProvider ~ receiver:`, receiver, user);
    if (!user?._id || !msg.receiver.length) return;

    const msg_: IChatMessagePayload = {
      ...msg,
      sender: user._id,
    };
    socket?.emit(chatSocketAction.C_SEND_MSG, msg_);
  };

  const sendMessageInRoom = (msg: { message: string; room?: string }) => {
    console.log(`🚀 ~ sendMessageInRoom ~ user?._id:`, user?._id);
    console.log(`🚀 ~ sendMessageInRoom ~ room:`, room);
    if (!room || !user?._id || !receiver) return;

    console.log(`send in room`);

    const msg_: IChatMessagePayload = {
      ...msg,
      receiver,
      // message: msg,
      room: msg.room || room.room,
      sender: user._id,
      members: room.members,
    };

    socket?.emit(chatSocketAction.C_SEND_MSG, msg_);
  };

  const switchRoom = (room?: string) => {
    console.log(`switch`);

    const chat = findChatInRoom(room);

    updateReceiver(chat);
    setRoom(chat);
  };

  const receiveNewMessage = (msg: TChatList) => {
    console.log(`🚀 ~ receiveNewMessage ~ msg:`, msg);
    if (!user) return;

    newMessageToRoom(msg.room, msg);

    // if (room?.room !== msg.room) {
    //   console.log(room, msg.room);

    //   socket?.emit(chatSocketAction.C_JOIN_ROOM, msg.room);
    // }
  };

  function newMessageToRoom(room_: string, msg: TChatList) {
    const chat = findChatInRoom(room_);
    if (chat) {
      console.log(`has chat`);

      chat.messages.push(msg.messages[0]);

      // setMessages([...messages, msg.messages[0]]);

      setChatList(arrayMoveImmutable(chatList, chatList.indexOf(chat), 0));
      // setChatList([...chatList]);
    } else {
      console.log(`no chat`);
      const newChat: TChatList = msg;

      setChatList([newChat, ...chatList]);

      if (msg.messages[0].sender === user?._id) {
        /**
         * Tin nhắn bắn ngược lại, này là tạo cuộc trò chuyện mới
         * nghĩa là trước đó, user đã focus vào 1 tin nhắn với 1 người
         * mà trước đó chưa có lịch sử chat, sau khi gửi tin nhắn đầu tiên
         * đến người đó, thì sẽ tự chuyển room đến room hiện tại đó
         *
         */
        // switchRoom(msg.room);
        updateReceiver(msg);
        setRoom(newChat);
      }
    }

    // if (room_ === room) {
    //   setMessages([...messages, msg]);
    // }
  }

  const updateReceiver = (source?: TChatList) => {
    setReceiver(
      source
        ? source.members.map((e) => e.user).filter((e) => e !== user?._id)
        : [],
    );
  };

  const findChatInRoom = (room?: string) => {
    return chatList.find((c) => c.room === room);
  };

  function loadMoreHistoryChat() {
    // tải lịch sử tin nhắn
    if (!room) return;

    console.log(`tải lịch sử tin nhắn`);
    console.log(
      `🚀 ~ loadMoreHistoryChat ~ room:`,
      room.messages.slice(-1),
      room.messages.length,
    );

    const param = new URLSearchParams({
      limit: String(LIMIT),
      from_date_to_previous: room.messages[0].createdAt.toString(),
    });
    console.log(
      `🚀 ~ switchRoom ~ param:`,
      decodeURIComponent(param as unknown as string),
    );

    fetcher
      .get<any, IChatMessage[]>(`/chat/room/${room.room}?${param}`)
      .then((d) => {
        console.log(`🚀 ~ d ~ d:`, d);

        if (!d.length || d.length < LIMIT) setCanFetchMoreMessage(false);

        room.messages.unshift(...d);

        setRoom({ ...room });
        // setMessages([...room.messages]);
      });
  }
  useEffect(() => {
    const chat = findChatInRoom(room?.room);

    if (chat) {
      // setMessages(chat.messages);
      setCanFetchMoreMessage(true);
      loadMoreHistoryChat();
    } else {
      // setMessages([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.room]);

  useEffect(() => {
    // Init socket

    if (!user?.token) {
      // reset();
      return;
    }

    const sock = io(VITE_CHAT_SERVER, {
      auth: {
        token: user.token,
      },
    });
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, [user?.token]);

  useEffect(() => {
    if (!chatListInit) return;
    setShouldFetch(false);
    setChatList(chatListInit);
    console.log(`🚀 ~ useEffect ~ chatListInit:`, chatListInit);
  }, [chatListInit]);

  useEffect(() => {
    // Tạo các listeners
    if (!socket) return;

    socket.on(chatSocketAction.S_SEND_MSG, receiveNewMessage);

    // socket.on(
    //   chatSocketAction.S_USER_ONLINE_STATUS,
    //   (userId: string, online: boolean) => {
    //     // setMessages([...messages, msg]);
    //   },
    // );

    return () => {
      socket.off(chatSocketAction.S_SEND_MSG);
      // socket.off(chatSocketAction.S_SEND_MSG_TO_ROOM);
    };
  });

  const value = (() => ({
    room,
    // messages,
    isFetchingMessage: isLoading,
    canFetchMoreMessage,
    chatList,
    switchRoom,
    sendMessageInRoom,
    sendMessageToNewUser,
    loadMoreHistoryChat,
    // sendMessage,
  }))();
  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}
