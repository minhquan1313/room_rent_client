import MyAvatar from "@/Components/MyAvatar";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import { QuickChatBtn } from "@/Components/QuickChatBtn";
import { GoogleMapContext } from "@/Contexts/GoogleMapProvider";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { routeRoomEdit, routeUserDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import { getDescriptionsRoom } from "@/utils/getDescriptionsRoom";
import { pageTitle } from "@/utils/pageTitle";
import { roomServiceIcon } from "@/utils/roomServiceIcon";
import { toStringUserName } from "@/utils/toString";
import { GoogleOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Descriptions,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import Meta from "antd/es/card/Meta";
import { Coords } from "google-map-react";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

const imageGutter: [number, number] = [8, 8];

const RoomDetail = () => {
  // const navigate = useNavigate();
  const location = useLocation();

  const { addUser, getUser } = useContext(InteractedUserProviderContext);
  const { loadMapTo, addMarker, addUserMarker } = useContext(GoogleMapContext);
  const { user } = useContext(UserContext);
  const { locationDenied, coords } = useContext(UserLocationContext);

  const { id } = useParams();
  const { data: room_ } = useSWR<IRoom>(
    `/rooms/${id}`,
    // currentRoom ? undefined : `/rooms/${id}`,
    fetcher,
  );
  const room = room_ || (location.state.room as IRoom | undefined);
  pageTitle(room?.name || "Đang tải");

  const mapRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [map, setMap] = useState<google.maps.Map>();
  const marker = useRef<google.maps.Marker>();
  const [owner, setOwner] = useState<IUser | null>(getUser(room?.owner));

  function centerMarker(map?: google.maps.Map, marker?: google.maps.Marker) {
    if (!marker || !map) return;

    const p = marker.getPosition();
    if (!p) return;

    map.setCenter(p);
    map.setZoom(15);
  }

  // useEffect(() => {
  // console.log(`🚀 ~ useEffect ~ currentRoom:`, currentRoom);
  // console.log(`🚀 ~ useEffect ~ room_:`, room_);
  // console.log(`🚀 ~ useEffect ~ room:`, room);
  // console.log(`🚀 ~ useEffect ~ id:`, id);
  // console.log(`🚀 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
  // });
  useLayoutEffect(() => {
    /**
     * Kiểm tra nhà có disable không
     */
    if (!room) return;
    console.log(`🚀 ~ useLayoutEffect ~ room:`, room);

    // if (room.disabled || !room.is_visible || !room.verified) {

    //   navigate(`/`);
    // }
  }, [room]);

  useEffect(() => {
    if (!mapRef.current || loaded.current) return;

    (async () => {
      if (!mapRef.current) return;

      // const coords = await getUserCoords();
      const { map } = await loadMapTo({
        ref: mapRef.current,
      });
      setMap(() => map);
    })();
    loaded.current = true;
  }, [loadMapTo, room]);

  useEffect(() => {
    (async () => {
      if (!map || marker.current || !room || !room.location) return;

      const [lng, lat] = room.location.lat_long.coordinates;
      const coord: Coords = {
        lat,
        lng,
      };

      const mk = addMarker(map, coord);
      if (!mk) return;

      marker.current = mk;

      const infowindow = new google.maps.InfoWindow({
        content: `<a style="color:#000000" href="https://www.google.com/maps/place/${coord.lat},${coord.lng}" target="_blank" rel="noopener noreferrer">Mở Google map</a>`,
      });

      // infowindow.open(map, mk);

      mk.addListener("click", function () {
        // Open a new tab or window with a specific URL when the marker is clicked
        // window.open(
        //   `https://www.google.com/maps/place/${coord.lat},${coord.lng}`,
        //   "_blank",
        // );
        infowindow.open(map, mk);
      });

      centerMarker(map, mk);

      if (locationDenied || !coords) return;

      addUserMarker(map, coords);

      // (async () => {
      //   const c = coords || (await refreshCoords());

      //   c && addUserMarker(map, c);
      // })();

      // map.addListener("click", (env: GoogleClickEvent) => {
      //   setCoords({
      //     lat: env.latLng.lat(),
      //     lng: env.latLng.lng(),
      //   });
      // });
    })();
  }, [addMarker, map, room]);

  // useEffect(() => {
  //   if (!currentRoom || currentRoom._id === id) return;

  //   setCurrentRoom(undefined);
  // }, [currentRoom, id, setCurrentRoom]);

  useEffect(() => {
    if (!room_) return;

    // setCurrentRoom(room_);
    // addUser(room_.owner);
    setOwner(getUser(room_.owner));
  }, [getUser, room_]);

  // const items: DescriptionsProps["items"] = getDescriptionsRoom(room);
  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div>
      <MyContainer className="my-10">
        {room && (
          <div className="space-y-10">
            <Space.Compact block direction="vertical">
              <Typography.Title>
                {room.name}

                {user?._id === room.owner && (
                  <MyButton to={routeRoomEdit + "/" + room._id}>Sửa</MyButton>
                )}
              </Typography.Title>

              <Typography.Paragraph className="text-right">
                Ngày đăng: {dateFormat(room.createdAt).format("LLL")}
              </Typography.Paragraph>

              {!!dateFormat(room.createdAt).diff(room.updatedAt, "s") && (
                <Typography.Paragraph className="text-right">
                  Sửa đổi: {dateFormat(room.updatedAt).format("LLL")}
                </Typography.Paragraph>
              )}
            </Space.Compact>
            <Image.PreviewGroup>
              <Row gutter={imageGutter}>
                {room.images.length ? (
                  <>
                    {/* With images */}
                    <Col xs={12}>
                      <_Image src={room.images[0].image} />
                    </Col>

                    <Col xs={12}>
                      <Row gutter={imageGutter}>
                        {room.images.slice(1).map(({ image }, i) => (
                          <Col xs={12} key={image} hidden={i >= 4}>
                            <Badge
                              count={i === 3 ? room.images.length - 5 : 0}
                              size="default"
                              className="block w-full"
                              title={`${room.images.length - 5} ảnh nữa`}
                            >
                              <_Image src={image} />
                            </Badge>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </>
                ) : (
                  <Col xs={24}>
                    {/* No Images */}
                    <MyImage
                      width={"100%"}
                      className={"aspect-[8/3]"}
                      preview={false}
                    />
                  </Col>
                )}
              </Row>
            </Image.PreviewGroup>

            <Space size={"large"}>
              {room.services.map((e, i) => (
                <Typography.Text key={i}>
                  <Space size={"small"}>
                    {roomServiceIcon(e.title)} {e.display_name}
                  </Space>
                </Typography.Text>
              ))}
            </Space>

            <Descriptions
              bordered
              title="Thông tin cơ bản"
              items={getDescriptionsRoom(room)}
            />

            {/* <Card title="Dịch vụ">
              <Space size={"large"}>
                {room.services.map((e, i) => (
                  <Typography.Paragraph key={i}>
                    <Space size={"small"}>
                      {roomServiceIcon(e.title)} {e.display_name}
                    </Space>
                  </Typography.Paragraph>
                ))}
              </Space>
            </Card> */}

            <Card title="Thông tin chi tiết">
              {room.description
                ?.split(/\n+/)
                .map((e, i) => (
                  <Typography.Paragraph key={i}>{e}</Typography.Paragraph>
                ))}
            </Card>

            <Card
              title="Liên hệ"
              extra={
                <Space>
                  {user && room.owner !== user._id && (
                    <QuickChatBtn toUserId={room.owner} fromUserId={user._id} />
                  )}
                  <MyButton
                    type="primary"
                    loading={!owner}
                    to={!owner ? undefined : `tel:${owner.phone?.e164_format}`}
                  >
                    Gọi
                  </MyButton>
                </Space>
              }
              loading={!owner}
            >
              {owner && (
                <Meta
                  avatar={
                    <Link
                      to={`${routeUserDetail}/${room.owner}`}
                      state={{
                        user: owner,
                      }}
                    >
                      <MyAvatar
                        src={owner.image}
                        addServer
                        alt={owner.first_name[0]}
                        size={"large"}
                      />
                    </Link>
                  }
                  title={
                    <Link
                      to={`${routeUserDetail}/${owner._id}`}
                      state={{
                        user: owner,
                      }}
                    >
                      <Space>
                        {toStringUserName(owner)}

                        {isRoleAdmin(owner.role.title) ? (
                          <Badge
                            title={owner.role.display_name ?? ""}
                            color="gold"
                            count={owner.role.display_name}
                          />
                        ) : (
                          ""
                        )}
                      </Space>
                    </Link>
                  }
                  description={
                    <Typography.Text copyable>
                      {owner.phone?.e164_format}
                    </Typography.Text>
                  }
                />
              )}
            </Card>

            <Card
              title="Vị trí"
              extra={
                <Space>
                  <MyButton
                    type="dashed"
                    onClick={() => {
                      centerMarker(map, marker.current);
                    }}
                  >
                    Về giữa
                  </MyButton>
                  <MyButton
                    to={`https://www.google.com/maps/dir/?api=1&destination=${room.location?.lat_long.coordinates[1]},${room.location?.lat_long.coordinates[0]}`}
                    icon={<GoogleOutlined />}
                  >
                    Chỉ đường
                  </MyButton>
                </Space>
              }
            >
              <div
                ref={mapRef}
                className="aspect-square w-full rounded-lg lg:aspect-[21/9]"
              />
            </Card>
          </div>
        )}
      </MyContainer>
    </div>
  );
};

const _Image = ({ src }: { src?: string }) => {
  return (
    <MyImage
      className="aspect-[4/3] select-none object-cover"
      width={`100%`}
      height={"100%"}
      src={src}
      rootClassName="overflow-hidden rounded-lg block"
      addServer
    />
  );
};

export default RoomDetail;
