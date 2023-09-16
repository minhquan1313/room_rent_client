import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import RoomTypeSelect from "@/Components/RoomTypeSelect";
import ServiceSelect from "@/Components/ServiceSelect";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { UserContext } from "@/Contexts/UserProvider";
import banner from "@/assets/images/pexels-pixabay-277787.jpg";
import { fetcher } from "@/services/fetcher";
import { IRoom, RoomPayload } from "@/types/IRoom";
import { dateFormat } from "@/utils/dateFormat";
import { isMobile } from "@/utils/isMobile";
import { formatObject } from "@/utils/objectToPayloadParams";
import { pageTitle } from "@/utils/pageTitle";
import { locationToString } from "@/utils/toString";
import { EditOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import classNames from "classnames";
import Flickity from "flickity";
import { ReactNode, useContext, useEffect, useRef } from "react";
import useSWR from "swr";

function Home() {
  pageTitle("Trang chủ");

  const { myTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="relative">
        <div className="relative">
          <MyImage
            // src={
            // "https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            // }
            src={banner}
            className="max-h-[40rem] object-cover"
            width={"100%"}
            height={"40rem"}
            preview={false}
          />
          <div
            className={classNames("absolute inset-0 block bg-gradient-to-b", {
              "from-black/50": myTheme === "dark",
              "from-black/25": myTheme === "light",
            })}
          />
        </div>

        <MyContainer
          className="absolute inset-0 flex items-center justify-center"
          noBg
        >
          <Typography.Title
            level={1}
            style={{ textAlign: "center", paddingTop: 20 }}
            className="!text-white"
          >
            TRỌ MỚI TOÀN QUỐC
          </Typography.Title>
          {/* <HomeSearch /> */}
        </MyContainer>

        <MyContainer noBg className="absolute bottom-5">
          <HomeSearch />
        </MyContainer>
      </div>

      <MyContainer className="mt-5">
        <Divider orientation="left">
          <Typography.Title level={3}>Đăng gần đây</Typography.Title>
        </Divider>
        <RecentRooms />
      </MyContainer>
      <MyContainer className="mt-5">
        <Space>
          <MyButton to="/rooms/add">Thêm phòng</MyButton>
        </Space>
      </MyContainer>
    </>
  );
}

type SearchFields = Partial<RoomPayload> & {
  kw?: string;
};
const HomeSearch = () => {
  return (
    <Card bordered={false}>
      <Form
        onFinish={(e: SearchFields) => {
          const query = new URLSearchParams(formatObject(e) as any).toString();
          // const query2 = objectToPayloadParams(formatObject(e)).toString();
          // console.log(`🚀 ~ HomeSearch ~ query2:`, query2);

          console.log(`🚀 ~ HomeSearch ~ query:`, query);
        }}
        size={isMobile() ? "large" : undefined}
      >
        <Row gutter={[8, 8]}>
          <Col xs={24} md={24} xl={10}>
            <Form.Item<SearchFields> name={"kw"} noStyle>
              <Input
                placeholder="Từ khoá"
                bordered={true}
                className="text-ellipsis"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10} xl={6}>
            <Form.Item<SearchFields> name={"room_type"} noStyle>
              <RoomTypeSelect
                className="w-full text-ellipsis"
                bordered={true}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10} xl={6}>
            <Form.Item<SearchFields> name={"services"} noStyle>
              <ServiceSelect
                className="w-full text-ellipsis"
                bordered={true}
                allowClear
                maxTagCount={0}
                maxTagPlaceholder={(e) => {
                  // if (e.length === 1) return e[0].label;

                  return `${e.length} tiêu chí`;
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={4} xl={2}>
            <MyButton
              htmlType="submit"
              type="primary"
              className="min-w-[6rem]"
              block
            >
              Tìm
            </MyButton>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

const RecentRooms = () => {
  const { data: roomsRecent } = useSWR<IRoom[]>(
    "/rooms?sort_field=createdAt&sort=-1&limit=4&disabled=false",
    fetcher,
  );
  const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   roomsRecent;
  //   console.log(`🚀 ~ useEffect ~ roomsRecent:`, roomsRecent);
  // }, [roomsRecent]);
  useEffect(() => {
    if (!ref.current || !roomsRecent) return;

    const f = new Flickity(ref.current, {
      imagesLoaded: true,
      contain: true,
      cellAlign: "left",
      prevNextButtons: false,
      draggable: true,
      groupCells: true,
    });

    return () => f.destroy();
  }, [roomsRecent]);

  return (
    <div ref={ref} className="-mx-2 ">
      {roomsRecent ? (
        roomsRecent.map((room, i) => (
          <div
            className="carousel-cell w-full sm:w-1/2 lg:w-1/3 2xl:w-1/4"
            key={i}
          >
            <div className="px-2">
              <RoomCard
                room={room}
                // name={name}
                // subName={sub_name}
                // srcRoom={images[0]?.image}
              />
            </div>
          </div>
        ))
      ) : (
        <div>no data</div>
      )}
    </div>
  );
};

interface RoomCardProps {
  room: IRoom;
  saved?: boolean;
  actions?: ReactNode[];
  onSave?(saved: boolean): void;
}
const RoomCard = ({
  room: { images, name, location, createdAt, owner },
  saved,
  onSave,
}: RoomCardProps) => {
  const { user } = useContext(UserContext);
  const SavedComponent = saved ? HeartFilled : HeartOutlined;

  const actions: ReactNode[] = [
    <SavedComponent key="save" onClick={() => onSave && onSave(!!saved)} />,
  ];
  user?._id === owner._id &&
    actions.push(
      ...[
        //
        <Tooltip title="Sửa thông tin">
          <EditOutlined key="edit" />
        </Tooltip>,
      ],
    );

  return (
    <Card
      cover={
        <MyImage
          src={images[0]?.image}
          addServer
          width={"100%"}
          className="aspect-video object-cover"
          preview={false}
        />
      }
      // className="transition hover:shadow-lg"
      actions={actions}
      size="small"
      // bodyStyle={{
      //   flex: 1,
      //   display: "flex",
      //   flexDirection: "column",
      // }}
    >
      {/* <div className="flex flex-1 flex-col"> */}
      <div className="flex items-center justify-between">
        <Typography.Paragraph ellipsis={{ rows: 1 }} className="!m-0">
          {location?.province ?? " "}
        </Typography.Paragraph>

        <Typography.Text className="whitespace-nowrap">
          {dateFormat(createdAt).fromNow()}
        </Typography.Text>
      </div>

      <Typography.Title level={5} ellipsis={{ rows: 2 }} className="h-12">
        {name}
      </Typography.Title>

      <Typography.Paragraph
        ellipsis={{ rows: 2 }}
        className="!mb-0 !mt-auto h-12"
      >
        {location ? locationToString(location, false) : "..."}
      </Typography.Paragraph>
      {/* </div> */}
    </Card>
  );
};

export default Home;
