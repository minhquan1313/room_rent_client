import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { dateFormat } from "@/utils/dateFormat";
import { Form, Input, InputRef, Typography } from "antd";
import classNames from "classnames";
import { useContext, useRef, useState } from "react";

function Chat() {
  const {
    chatList,
    canFetchMoreMessage,
    room,
    switchRoom,
    sendMessageInRoom,
    sendMessageToNewUser,
    loadMoreHistoryChat,
  } = useContext(ChatSocketContext);

  const { user } = useContext(UserContext);

  const [receiverInp, setReceiverInp] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [roomInp, setRoomInp] = useState<string>("");
  const ref = useRef<InputRef>(null);

  return (
    <MyContainer>
      <Form
        onFinish={(e) => {
          ref.current?.focus();

          setMessage("");
          setRoomInp("");

          if (room) {
            sendMessageInRoom({
              message,
            });
          } else if (roomInp) {
            sendMessageInRoom({
              message,
              room: roomInp,
            });
          } else if (receiverInp) {
            console.log(`🚀 ~ Chat ~ receiver:`, receiverInp);

            sendMessageToNewUser({
              message: message,
              receiver: [receiverInp],
            });
          }
        }}
      >
        <div>
          ID của bạn:
          <Typography.Text copyable>{user?._id}</Typography.Text> |{" "}
          <Typography.Text copyable>{user?.username}</Typography.Text>
        </div>

        <div>
          <MyButton
            onClick={() => loadMoreHistoryChat()}
            disabled={!canFetchMoreMessage}
          >
            Tải thêm
          </MyButton>
        </div>

        <div>
          Chat rooms:
          {chatList.map((c) => (
            <MyButton
              type={room?.room === c.room ? "primary" : "default"}
              key={c.room}
              onClick={() => {
                if (room?.room === c.room) {
                  switchRoom(undefined);
                } else switchRoom(c.room);
              }}
            >
              {c.room}
            </MyButton>
          ))}
        </div>

        <div>
          {room?.messages.map((message) => (
            <div
              key={message._id}
              className={classNames({
                "text-right": message.sender === user?._id,
              })}
            >
              {message.sender === user?._id ? (
                <>{message.message}</>
              ) : (
                <>
                  {message.sender} : {message.message}
                </>
              )}
              {/* [{String(message.createdAt)}] */}[
              {dateFormat(message.createdAt).format("LTS")}]
            </div>
          ))}
        </div>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tin nhan"
          ref={ref}
        />
        <Input
          value={receiverInp}
          onChange={(e) => setReceiverInp(e.target.value)}
          placeholder="Id người nhận"
        />
        <Input
          value={roomInp}
          onChange={(e) => setRoomInp(e.target.value)}
          placeholder="Room"
        />
        {/* <Input value={sendTo} onChange={(e) => setMessage(e.target.value)} /> */}
        <MyButton htmlType="submit">Gửi</MyButton>
      </Form>
    </MyContainer>
  );
}

export default Chat;
