import { ChatMessage } from "@/Components/Chat/ChatMessage";
import { SideChatItem } from "@/Components/Chat/SideChatItem";
import MyButton from "@/Components/MyButton";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeChat } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { isProduction } from "@/utils/isProduction";
import { toStringUserName } from "@/utils/toString";
import { SendOutlined } from "@ant-design/icons";
import {
  Col,
  Divider,
  Form,
  Input,
  InputRef,
  Row,
  Select,
  Typography,
} from "antd";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSWR from "swr";

function Chat() {
  const {
    chatList,
    room,
    isFetchingMessage,
    switchRoom,
    sendMessage,
    loadMoreHistoryChat,
    removeChatRoom,
    searchForChatRoom,
  } = useContext(ChatSocketContext);

  const { user } = useContext(UserContext);
  const { getUser } = useContext(InteractedUserProviderContext);

  const [query] = useSearchParams();

  const { data: allUserDb } = useSWR<IUser[]>(
    isProduction ? null : `/users`,
    fetcher,
  );

  const { roomId } = useParams();
  const navigate = useNavigate();

  const inputRef = useRef<InputRef>(null);

  const chatLoaded = useRef(true);
  const chatLoadedByScroll = useRef(false);

  const messageBoxRef = useRef<HTMLDivElement>(null);
  const firstMsgBeforeLoaded = useRef<Element | null | undefined>(null);

  const [form] = Form.useForm();

  const onChangeRoom = useCallback(
    function (room_: string): void {
      if (room?.room === room_) {
        // navigate(`${routeChat}`);
      } else {
        navigate(`${routeChat}/${room_}`);
      }
    },
    [navigate, room?.room],
  );

  useEffect(() => {
    document.querySelector("#root")?.classList.add("max-h-full");
    return () => {
      document.querySelector("#root")?.classList.remove("max-h-full");
    };
  }, []);

  useEffect(() => {
    if (!messageBoxRef.current) return;
    const { clientHeight, scrollHeight } = messageBoxRef.current;

    if (
      clientHeight === scrollHeight &&
      room?.canFetchMoreMessage &&
      chatLoaded.current
    ) {
      chatLoaded.current = false;
      // messageBoxRef.current.scrollTop = 1;
      loadMoreHistoryChat().then(() => {
        chatLoaded.current = true;
        chatLoadedByScroll.current = false;
      });
    }
  });

  useEffect(() => {
    if (chatLoaded.current) {
      if (!chatLoadedByScroll.current) {
        // console.log(`messageBoxRef.current?.lastElementChild?.scrollIntoView`);

        messageBoxRef.current?.lastElementChild?.scrollIntoView();
      } else {
        if (messageBoxRef.current?.scrollTop === 0) {
          firstMsgBeforeLoaded.current?.scrollIntoView();
        }

        chatLoadedByScroll.current = false;
      }
    }
  }, [room?.messages.length]);

  useEffect(() => {
    if (roomId === room?.room) return;
    console.log(`calling switchRoom effect`);
    console.log(`🚀 ~ useEffect ~ oom?.ro:`, room?.room, roomId);

    if (!roomId) {
      console.log(`calling !roomId`);
      console.log(`🚀 ~ useEffect ~ room?.room:`, room?.room);

      if (room?.room) {
        if (query.get(`to`)) {
          navigate(`${routeChat}/${room?.room}`);
        } else {
          switchRoom(room?.room);
        }
      }
      return;
    }

    console.log(`roomId !== room?.room`);
    if (roomId !== room?.room) {
      switchRoom(roomId) || navigate(`${routeChat}`);
    }
  }, [navigate, query, room?.room, roomId, switchRoom]);

  useEffect(() => {
    (async () => {
      const to = query
        .get("to")
        ?.split(",")
        .filter((id) => id !== user?._id);

      if (!to || !to.length || !user) return;
      console.log(`🚀 ~ to:`, to);

      const chatRoom = await searchForChatRoom([...to, user._id]);
      console.log(`🚀 ~ chatRoom:`, chatRoom);

      if (chatRoom.length) {
        switchRoom(chatRoom[0].room);
      }
    })();
  }, [query, searchForChatRoom, switchRoom, user]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [room?.messages.length]);

  return (
    <div className="h-full">
      {!isFetchingMessage ? (
        <Row className="h-full">
          <Col className="h-full w-full max-w-[12rem] overflow-y-auto overflow-x-hidden md:max-w-xs ">
            {/* ChatHeads */}
            {!isProduction && (
              <div>
                <MyButton
                  onClick={() => {
                    if (
                      messageBoxRef.current &&
                      messageBoxRef.current.scrollTop === 0
                    ) {
                      messageBoxRef.current.scrollTop = 1;
                    }
                    loadMoreHistoryChat();
                  }}
                  disabled={!room?.canFetchMoreMessage}
                  block
                >
                  [DEV] Tải thêm
                </MyButton>
                <Select
                  placeholder="[DEV] Tìm user"
                  options={allUserDb?.map((d) => ({
                    value: d._id,
                    label: d.username,
                    title: d._id,
                  }))}
                  mode="multiple"
                  className="w-full"
                  onChange={(e) => {
                    if (!e.length) {
                      if (query.get("to")) {
                        navigate(`${routeChat}`);
                      }
                      return;
                    }
                    switchRoom(undefined);

                    navigate(
                      `${routeChat}?${new URLSearchParams({
                        to: e,
                      })}`,
                    );
                  }}
                />
              </div>
            )}

            {chatList.map((c) => (
              <SideChatItem
                user={(() => {
                  const u = c.members.find((e) => e.user !== user?._id)?.user;

                  const x = getUser(u);

                  return x;
                })()}
                onDelete={async (r) => {
                  await fetcher.delete(`/chat/room/${r}`);
                  removeChatRoom(r);
                  if (r === c.room) navigate(routeChat);
                }}
                onChangeRoom={onChangeRoom}
                key={c.room}
                room={c.room}
                type={room?.room === c.room ? "primary" : "default"}
                lastMsg={c.messages.slice(-1)[0]}
                members={c.members}
              />
            ))}
          </Col>

          <Divider type="vertical" className="m-0 h-full" />

          <Col flex={"1"} className="h-full max-h-full overflow-hidden">
            {/* {chatList.length === 0 ? (
              <Typography.Title className="flex h-full w-full items-center justify-center">
                Hãy tìm ai đó để bắt chuyện
              </Typography.Title>
            ) : 
            ( */}
            <Form
              onFinish={(e) => {
                form.resetFields();
                inputRef.current?.focus();

                const to = query.get("to");
                if (to) {
                  // send to new user

                  const receiver = to.split(",");
                  // setUserFetchedAll(false);
                  sendMessage({ message: e.message, receiver });
                } else {
                  sendMessage({ message: e.message });
                }
              }}
              disabled={!room?.room && !query.get("to")}
              className="flex h-full flex-col"
              form={form}
            >
              <div className="">header</div>
              {/* Chat messages */}
              <div
                onScroll={(e) => {
                  if (
                    messageBoxRef.current &&
                    messageBoxRef.current.scrollTop <= 500 &&
                    room?.canFetchMoreMessage &&
                    chatLoaded.current
                  ) {
                    e.preventDefault();
                    e.stopPropagation();

                    chatLoaded.current = false;

                    loadMoreHistoryChat().then(() => {
                      chatLoaded.current = true;
                      chatLoadedByScroll.current = true;

                      if (messageBoxRef.current) {
                        firstMsgBeforeLoaded.current =
                          messageBoxRef.current.firstElementChild;
                      }
                    });
                  }
                }}
                className="flex-1 space-y-5 overflow-y-scroll p-5"
                ref={messageBoxRef}
              >
                {query.get("to") && (
                  <Typography.Title
                    className="!m-0 flex h-full items-center justify-center text-center"
                    level={3}
                  >
                    Bắt đầu cuộc trò chuyện mới với{" "}
                    {toStringUserName(getUser(query.get("to")))}
                  </Typography.Title>
                )}
                {room?.messages.map(
                  ({ sender, message, createdAt, _id, seen }) => (
                    <ChatMessage
                      showDetailUser={room.members.length >= 3}
                      user={getUser(sender)}
                      message={message}
                      date={String(createdAt)}
                      seen={seen}
                      key={_id}
                    />
                  ),
                )}
              </div>

              <Divider type="horizontal" className="m-0 w-full" />

              <Row gutter={[8, 8]} align={"bottom"} className="p-5">
                <Col flex={"auto"}>
                  <Form.Item
                    noStyle
                    name={"message"}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input.TextArea
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          form.submit();
                        }
                      }}
                      placeholder="Tin nhan"
                      ref={inputRef}
                      // bordered={false}
                      translate="yes"
                      autoSize
                      className="bg-slate-800"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col className="">
                  <MyButton
                    icon={<SendOutlined />}
                    htmlType="submit"
                    block
                    size="large"
                    type="primary"
                    className="w-full"
                  ></MyButton>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default Chat;
