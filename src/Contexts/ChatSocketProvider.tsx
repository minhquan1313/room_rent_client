import { UserContext } from "@/Contexts/UserProvider";
import { chatSocketAction } from "@/constants/chatSocketAction";
import { VITE_CHAT_SERVER } from "@/constants/env";
import { fetcher } from "@/services/fetcher";
import { IChatMessagePayload } from "@/types/IChatMessage";
import { IChatMessageWithSeen, TChatList } from "@/types/IChatRoom";
import { IChatSeen } from "@/types/IChatSeen";
import { objectToPayloadParams } from "@/utils/objectToPayloadParams";
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
  isFetchingMessage: boolean;
  chatList: TChatList[];
  switchRoom: (room_?: string | undefined) => TChatList | undefined;
  sendMessage: (msg: {
    message: string;
    receiver?: string[] | undefined;
  }) => void;
  loadMoreHistoryChat: () => Promise<void>;
  removeChatRoom: (room?: string | undefined) => void;
  searchForChatRoom: (receivers: string[]) => Promise<TChatList[]>;
}

interface IProps {
  children: ReactNode;
}

export const ChatSocketContext = createContext<IChatSocketContext>(
  null as never,
);

const LIMIT = 5;
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

  const [shouldFetch, setShouldFetch] = useState(true);

  /**
   * Load tất cả các cuộc trò chuyện hiện có của user này :>
   * Là load tất cả 1 lần luôn
   */
  const { data: chatListInit, isLoading } = useSWR<TChatList[]>(
    () => (shouldFetch ? `/chat/list/${user!._id}` : null),
    fetcher,
  );

  const sendMessage = (msg: { message: string; receiver?: string[] }) => {
    if (!room) {
      // Không trong 1 room nào, gửi tin nhắn cho người mới
      if (msg.receiver?.length) {
        sendMessageToNewUser(msg as any);
      }
    } else {
      sendMessageInRoom(msg);
    }
  };

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
      room: msg.room || room.room,
      sender: user._id,
      members: room.members,
    };

    socket?.emit(chatSocketAction.C_SEND_MSG, msg_);
  };

  const switchRoom = (room_?: string) => {
    console.log(`🚀 ~ switchRoom ~ room_:`, room_);

    if (room_ === room?.room) return;

    const chat = findChatInRoom(room_);
    console.log(`🚀 ~ switchRoom ~ chat:`, chat);

    updateReceiver(chat);
    setRoom(chat);

    return chat;
  };

  const receiveNewMessage = (msg: TChatList) => {
    console.log(`🚀 ~ receiveNewMessage ~ msg:`, msg);
    if (!user) return;

    newMessageToRoom(msg.room, msg);

    if (msg.room === room?.room && msg.messages[0].sender !== user._id)
      triggerSeen(
        msg.messages.slice(-1)[0],
        room.members.map((e) => e.user),
      );
  };

  const triggerSeen = (msg: IChatMessageWithSeen, receiver: string[]) => {
    socket?.emit(chatSocketAction.C_SEEN_MSG, msg, receiver);
  };

  const chatDeletedByOther = (msg: TChatList) => {
    setChatList((list) => list.filter((r) => r.room !== msg.room));
    if (msg.room === room?.room) {
      switchRoom(undefined);
    }
  };
  const onMessageSeen = (seen: IChatSeen) => {
    console.log(`🚀 ~ onMessageSeen ~ seen:`, seen);

    const chat = findChatInRoom(seen.room);
    if (!chat) return;

    const msg = chat.messages.find((m) => m._id === seen.message_id);
    if (!msg) return;

    msg.seen = [...msg.seen, seen];
    // msg.seen.push(seen);

    setChatList([...chatList]);
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
  const findChatByReceivers = (receivers: string[]) => {
    const chat = chatList.filter((c) => {
      if (c.members.length !== receivers.length) return false;

      return c.members.every((member) => receivers.includes(member.user));
    });

    return chat;
  };
  const searchForChatRoom = async (receivers: string[]) => {
    if (!user?._id) return [];

    const receivers_ = receivers;

    const chatLocal = findChatByReceivers(receivers_);
    console.log(`🚀 ~ searchForChatRoom ~ chatLocal:`, chatLocal);

    if (chatLocal.length) return chatLocal;

    // fetch from server
    const o = objectToPayloadParams({ receivers: receivers_ });

    const chatRoom = await fetcher.get<any, TChatList[]>(
      `/chat/room/search-by-receiver?${o.toString()}`,
    );
    console.log(`🚀 ~ searchForChatRoom ~ chatRoom:`, chatRoom);

    return chatRoom;
  };
  function loadMoreHistoryChat() {
    return new Promise<void>((rs) => {
      // tải lịch sử tin nhắn
      if (!room || !room.canFetchMoreMessage) return;

      console.log(`tải lịch sử tin nhắn`);

      const param = new URLSearchParams({
        limit: String(LIMIT),
        from_date_to_previous: room.messages[0].createdAt.toString(),
      });
      console.log(
        `🚀 ~ switchRoom ~ param:`,
        decodeURIComponent(param as unknown as string),
      );

      fetcher
        .get<any, IChatMessageWithSeen[]>(`/chat/room/${room.room}?${param}`)
        .then((d) => {
          console.log(`🚀 ~ d ~ d:`, d);

          if (!d.length || d.length < LIMIT) {
            room.canFetchMoreMessage = false;
          }

          room.messages.unshift(...d);

          setRoom({ ...room });
          // setMessages([...room.messages]);

          rs();
        });
    });
  }

  function removeChatRoom(room?: string) {
    const chat = findChatInRoom(room);
    if (!chat) return;

    // const newC = arrayMoveImmutable(chatList, chatList.indexOf(chat), 0).slice(
    //   1,
    // );

    chat.messages = [];
    chat.members = chat.members.filter((m) => m.user !== user?._id);

    socket?.emit(chatSocketAction.C_DELETE_ROOM, chat);
    console.log(`🚀 ~ removeChatRoom ~ chat:`, chat);

    setChatList((list) => {
      list.splice(chatList.indexOf(chat), 1);

      return [...list];
    });

    switchRoom(undefined);
  }

  useEffect(() => {
    const chat = findChatInRoom(room?.room);

    if (chat) {
      // setMessages(chat.messages);
      chat.canFetchMoreMessage ?? (chat.canFetchMoreMessage = true);
      // loadMoreHistoryChat();
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

    chatListInit.forEach((r) => (r.canFetchMoreMessage = true));
    setChatList(chatListInit);
    console.log(`🚀 ~ useEffect ~ chatListInit:`, chatListInit);
  }, [chatListInit]);

  useEffect(() => {
    // Tạo các listeners
    if (!socket) return;

    socket.on(chatSocketAction.S_SEND_MSG, receiveNewMessage);

    socket.on(chatSocketAction.S_DELETE_ROOM, chatDeletedByOther);

    socket.on(chatSocketAction.S_SEEN_MSG, onMessageSeen);

    return () => {
      socket.off(chatSocketAction.S_SEND_MSG);
      socket.off(chatSocketAction.S_DELETE_ROOM);
      socket.off(chatSocketAction.S_SEEN_MSG);
    };
  });

  useEffect(() => {
    if (!room?.room) return;
    const lastMessage = room.messages.slice(-1)[0];

    const isUserSeen = lastMessage.seen.find((u) => u.seen_by === user?._id);
    if (isUserSeen) {
      return;
    } else {
      // #BUG: Nếu có nhiều máy đăng nhập, thì sẽ gửi nhiều lần cái này làm tạo nhiều lần trên db
      // #BUG: Nếu có nhiều máy đăng nhập, thì khi gửi tin nhắn ở máy A, máy B sẽ không hiện tin nhắn
      triggerSeen(
        lastMessage,
        room.members.map((e) => e.user),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.room]);

  const value = (() => ({
    room,
    isFetchingMessage: isLoading,
    chatList,
    switchRoom,
    sendMessage,
    loadMoreHistoryChat,
    removeChatRoom,
    searchForChatRoom,
    // sendMessage,
  }))();
  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}
