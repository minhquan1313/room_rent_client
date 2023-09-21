import MyContainer from "@/Components/MyContainer";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { useContext } from "react";

function Chat() {
  const {
    chatList,
    // messages,
    canFetchMoreMessage,
    room,
    switchRoom,
    sendMessageInRoom,
    sendMessageToNewUser,
    loadMoreHistoryChat,
  } = useContext(ChatSocketContext);

  return <MyContainer></MyContainer>;
}

export default Chat;
