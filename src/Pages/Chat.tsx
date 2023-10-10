import { ChatMessage } from "@/Components/Chat/ChatMessage";
import { SideChatItem } from "@/Components/Chat/SideChatItem";
import MyAvatar from "@/Components/MyAvatar";
import MyButton from "@/Components/MyButton";
import { ChatSocketContext } from "@/Contexts/ChatSocketProvider";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { routeChat, routeUserDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IUser } from "@/types/IUser";
import { isProduction } from "@/utils/isProduction";
import { pageTitle } from "@/utils/pageTitle";
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
  Space,
  Typography,
} from "antd";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useSWR from "swr";

const MIN_SCROLL_TOP = 500;
function Chat() {
  pageTitle("Chat");

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
  const forceLoadChatByCode = useRef(false);

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
    if (roomId === room?.room || isFetchingMessage) return;
    console.log(`calling switchRoom effect`);

    console.log(
      `🚀 ~ useEffect ~ room?.room:`,
      room?.room,
      roomId,
      query.get("to"),
    );

    if (!roomId) {
      if (room?.room) {
        if (query.get("to")) {
          // switchRoom(undefined);
          // console.log("navigate(`${routeChat}/${room?.room}`)");
        } else {
          // console.log("switchRoom(room?.room)");
          navigate(`${routeChat}/${room?.room}`);
          // switchRoom(room?.room);
        }
      }
      return;
    }

    console.log(`roomId !== room?.room`);
    if (roomId !== room?.room) {
      if (!switchRoom(roomId)) {
        console.log("navigate(`${routeChat}`)");
        navigate(`${routeChat}`);
      }
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
        navigate(`${routeChat}/${chatRoom[0].room}`);
      } else {
        switchRoom(undefined);
      }
    })();
  }, [query, searchForChatRoom, switchRoom, user]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [room?.messages.length]);

  useEffect(
    () => {
      // console.log(`🚀 ~ chatLoaded.current:`, chatLoaded.current);
      if (chatLoaded.current) {
        // console.log(
        //   `🚀 ~ chatLoadedByScroll.current:`,
        //   chatLoadedByScroll.current,
        // );
        if (!chatLoadedByScroll.current) {
          /**
           * Cuộn xuống cuối cùng, để xem tin nhắn mới nhất
           */

          // console.log(
          //   `🚀 ~ messageBoxRef.current?.lastElementChild?.scrollIntoView():`,
          // );
          if (messageBoxRef.current) {
            const { scrollHeight } = messageBoxRef.current;
            // console.log(`🚀 ~ scrollHeight:`, scrollHeight);

            messageBoxRef.current.scrollTop = scrollHeight;
          }
          // messageBoxRef.current?.lastElementChild?.scrollIntoView();
        } else {
          if (messageBoxRef.current?.scrollTop === 0) {
            firstMsgBeforeLoaded.current?.scrollIntoView();
            // console.log(`🚀 ~ firstMsgBeforeLoaded.current?.scrollIntoView():`);
          }

          chatLoadedByScroll.current = false;
        }
      }
    },
    // , [room?.messages.length]
  );
  useEffect(() => {
    /**
     * BẮT BUỘC PHẢI CHẠY SAU BƯỚC SCROLL TOP
     * Tự động load message khi vừa vào cuộc trò chuyện đến khi
     * độ dài cuộc trò chuyện đủ dài và có thể cuộn được
     */
    if (!messageBoxRef.current) return;
    const { clientHeight, scrollHeight, scrollTop } = messageBoxRef.current;

    if (
      (clientHeight === scrollHeight || scrollTop <= MIN_SCROLL_TOP) &&
      room?.canFetchMoreMessage &&
      chatLoaded.current
    ) {
      chatLoaded.current = false;

      chatLoadedByScroll.current = false;
      forceLoadChatByCode.current = true;
      loadMoreHistoryChat().then(() => {
        console.log(
          `🚀 ~ loadMoreHistoryChat ~ chatLoaded.current:`,
          chatLoaded.current,
        );
        chatLoaded.current = true;
      });
    }
  });

  return (
    <div className="h-full">
      {!isFetchingMessage ? (
        <Row className="h-full">
          {/* Side bên */}

          <Col className="h-full max-w-xs overflow-y-auto overflow-x-hidden sm:w-full">
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
                    console.log(`loadMoreHistoryChat onClick`);
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

          {/* Message box */}
          <Col flex={"1"} className="h-full max-h-full overflow-hidden">
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
              {room?.room && (
                <div className="p-5">
                  <Space split={<Divider type="vertical" />}>
                    {room.members
                      .filter((e) => e.user !== user?._id)
                      .map((u) => {
                        console.log(`🚀 ~ .map ~ u:`, u);

                        const x = getUser(u.user);

                        return (
                          <Link to={routeUserDetail + "/" + x?._id}>
                            {toStringUserName(x)}
                          </Link>
                        );
                      })}
                  </Space>
                  {/* {toStringUserName(
                    (() => {
                      const u = room.members.find((e) => e.user !== user?._id)
                        ?.user;

                      const x = getUser(u);

                      return x;
                    })(),
                  )} */}
                </div>
              )}
              <Divider className="m-0" />
              {/* Chat messages */}
              <div
                onScroll={(e) => {
                  if (forceLoadChatByCode.current) {
                    forceLoadChatByCode.current = false;
                    return;
                  }

                  if (
                    messageBoxRef.current &&
                    messageBoxRef.current.scrollTop <= MIN_SCROLL_TOP &&
                    room?.canFetchMoreMessage &&
                    chatLoaded.current
                  ) {
                    e.preventDefault();
                    e.stopPropagation();

                    chatLoaded.current = false;

                    console.log(`loadMoreHistoryChat onScroll`);

                    forceLoadChatByCode.current = false;
                    chatLoadedByScroll.current = true;
                    loadMoreHistoryChat().then(() => {
                      chatLoaded.current = true;

                      if (messageBoxRef.current) {
                        firstMsgBeforeLoaded.current =
                          messageBoxRef.current.firstElementChild;
                      }
                    });
                  }
                }}
                className="flex-1 space-y-5 overflow-y-scroll p-2 sm:p-5"
                ref={messageBoxRef}
              >
                {query.get("to") && getUser(query.get("to")) && (
                  <Space
                    className="h-full items-center justify-center"
                    direction="vertical"
                  >
                    <Link
                      to={routeUserDetail + "/" + getUser(query.get("to"))?._id}
                      target="_blank"
                    >
                      <MyAvatar
                        src={getUser(query.get("to"))?.image}
                        addServer
                        size={80}
                      />
                    </Link>
                    <Typography.Title className="!m-0 text-center" level={3}>
                      Bắt đầu cuộc trò chuyện mới với{" "}
                      <Link
                        to={
                          routeUserDetail + "/" + getUser(query.get("to"))?._id
                        }
                        target="_blank"
                      >
                        {toStringUserName(getUser(query.get("to")))}
                      </Link>
                      {/* {toStringUserName(getUser(query.get("to")))} */}
                    </Typography.Title>
                  </Space>
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

              <Row
                gutter={[8, 8]}
                align={"bottom"}
                className="p-2 sm:p-5"
                wrap={false}
              >
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
                      autoSize={{
                        maxRows: 5,
                      }}
                      placeholder="Tin nhan"
                      ref={inputRef}
                      translate="yes"
                      bordered={false}
                      // className="bg-slate-800"
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
                  />
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
