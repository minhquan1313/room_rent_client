import MyGoogleMap from "@/Components/GoogleMap/MyGoogleMap";
import GoogleMapIcon from "@/Components/Icons/GoogleMapIcon";
import MyAvatar from "@/Components/MyAvatar";
import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import MyImage from "@/Components/MyImage";
import { QuickChatBtn } from "@/Components/QuickChatBtn";
import DescriptionsRoom from "@/Components/RoomDetail/DescriptionsRoom";
import { InteractedUserProviderContext } from "@/Contexts/InteractedUserProvider";
import { UserLocationContext } from "@/Contexts/UserLocationProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { ggMapZoomMarker } from "@/constants/googleMapConstants";
import { isRoleAdmin } from "@/constants/roleType";
import { routeRoomEdit, routeUserDetail } from "@/constants/route";
import { fetcher } from "@/services/fetcher";
import { IRoom } from "@/types/IRoom";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import roomLocToCoord from "@/utils/roomLocToCoord";
import { roomServiceIcon } from "@/utils/roomServiceIcon";
import { toStringUserName } from "@/utils/toString";
import { Badge, Card, Col, Image, Row, Space, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { Coords } from "google-map-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import useSWR from "swr";

const imageGutter: [number, number] = [8, 8];

const RoomDetail = () => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  const location = useLocation();

  // const { loadMapTo, addMarker, addUserMarker } = useContext(GoogleMapContext);
  const { getUser } = useContext(InteractedUserProviderContext);
  const { user } = useContext(UserContext);
  const { coords: userCoord } = useContext(UserLocationContext);

  const { id } = useParams();
  const { data: room_, isLoading } = useSWR<IRoom>(
    `/rooms/${id}`,
    // currentRoom ? undefined : `/rooms/${id}`,
    fetcher,
  );
  const room = room_ || (location.state?.room as IRoom | undefined);
  pageTitle(room?.name || t("State.Loading"));

  // const mapRef = useRef<HTMLDivElement>(null);
  // const loaded = useRef(false);
  // const [map, setMap] = useState<google.maps.Map>();
  // const marker = useRef<google.maps.Marker>();
  const [owner, setOwner] = useState<IUser | null>(getUser(room?.owner));
  const [coord, setCoord] = useState<Coords>();
  const [map, setMap] = useState<google.maps.Map>();

  // function makeCoord() {
  //   const c: Coords[] = [];
  //   if (!locationDenied && userCoord) {
  //     c.push(userCoord);
  //   }

  //   if (room?.location) c.push(roomLocToCoord(room.location));
  // }
  function centerMarker() {
    if (!coord || !map) return;
    logger(`~🤖 RoomDetail 🤖~ centerMarker()`);
    const zoom = ggMapZoomMarker;

    (map.getZoom() || zoom) <= zoom && map.setZoom(zoom);

    map.panTo(coord);
  }
  // function centerMarker(map?: google.maps.Map, marker?: google.maps.Marker) {
  //   if (!marker || !map) return;

  //   const p = marker.getPosition();
  //   if (!p) return;

  //   map.setCenter(p);
  //   map.setZoom(15);
  // }

  useLayoutEffect(() => {
    /**
     * Kiểm tra nhà có disable không
     */
    if (!room) return;
    logger(`🚀 ~ useLayoutEffect ~ room:`, room);
  }, [room]);

  // useEffect(() => {
  //   if (!mapRef.current || loaded.current) return;

  //   (async () => {
  //     if (!mapRef.current) return;

  //     const { map } = await loadMapTo({
  //       ref: mapRef.current,
  //     });
  //     setMap(() => map);
  //   })();
  //   loaded.current = true;
  // }, [loadMapTo, room]);

  // useEffect(() => {
  //   (async () => {
  //     if (!map || marker.current || !room || !room.location) return;

  //     const [lng, lat] = room.location.lat_long.coordinates;
  //     const coord: Coords = {
  //       lat,
  //       lng,
  //     };

  //     const mk = addMarker(map, coord);
  //     if (!mk) return;

  //     marker.current = mk;

  //     const infowindow = new google.maps.InfoWindow({
  //       content: `<a style="color:#000000" href="https://www.google.com/maps/place/${coord.lat},${coord.lng}" target="_blank" rel="noopener noreferrer">Mở Google map</a>`,
  //     });

  //     mk.addListener("click", function () {
  //       // Open a new tab or window with a specific URL when the marker is clicked
  //       // window.open(
  //       //   `https://www.google.com/maps/place/${coord.lat},${coord.lng}`,
  //       //   "_blank",
  //       // );
  //       infowindow.open(map, mk);
  //     });

  //     centerMarker(map, mk);

  //     if (locationDenied || !coords) return;

  //     addUserMarker(map, coords);
  //   })();
  // }, [addMarker, map, room]);

  useEffect(() => {
    if (!room) return;

    const { owner, location } = room;
    setOwner(getUser(owner));

    setCoord(roomLocToCoord(location));
  }, [getUser, room]);

  useEffect(() => {
    if (!coord) return;

    centerMarker();
  }, [coord, map]);

  // useEffect(() => {
  //   document.documentElement.scrollTop = 0;
  // }, []);

  return (
    <MyContainer className="my-10">
      {room ? (
        <div className="space-y-10">
          <Space.Compact block direction="vertical">
            <Typography.Title>
              {room.name}

              {(user?._id === room.owner || isRoleAdmin(user?.role?.title)) && (
                <MyButton to={routeRoomEdit + "/" + room._id}>{t("Extra.Update")}</MyButton>
              )}
            </Typography.Title>

            <Typography.Paragraph className="text-right">
              {t("Room detail.Post date")}: {dateFormat(room.createdAt).format("LLL")}
            </Typography.Paragraph>

            {!!dateFormat(room.createdAt).diff(room.updatedAt, "s") && (
              <Typography.Paragraph className="text-right">
                {t("Room detail.Update date")}: {dateFormat(room.updatedAt).format("LLL")}
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
                  <MyImage width={"100%"} className={"aspect-[8/3]"} preview={false} />
                </Col>
              )}
            </Row>
          </Image.PreviewGroup>

          <Space size={"large"}>
            {room.services.map(({ title }, i) => (
              <Typography.Text key={i}>
                <Space size={"small"}>
                  {roomServiceIcon(title)} {tApi(`data code.room service.${title}`)}
                </Space>
              </Typography.Text>
            ))}
          </Space>

          <DescriptionsRoom room={room} />

          <Card title={t("Room detail.Detail information")}>
            {room.description?.split(/\n+/).map((e, i) => <Typography.Paragraph key={i}>{e}</Typography.Paragraph>)}
          </Card>

          <Card
            title={t("Room detail.Contact")}
            extra={
              <Space>
                {user && room.owner !== user._id && <QuickChatBtn toUserId={room.owner} fromUserId={user._id} />}
                <MyButton type="primary" loading={!owner} to={!owner ? undefined : `tel:${owner.phone?.e164_format}`}>
                  {t("Room detail.Call")}
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
                    <MyAvatar src={owner.image} addServer name={owner.first_name} size={"large"} />
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

                      {isRoleAdmin(owner.role?.title) ? (
                        <Badge title={owner.role?.display_name ?? ""} color="gold" count={owner.role?.display_name} />
                      ) : (
                        ""
                      )}
                    </Space>
                  </Link>
                }
                description={<Typography.Text copyable>{owner.phone?.e164_format}</Typography.Text>}
              />
            )}
          </Card>

          <Card
            title={t("Search page.Location")}
            extra={
              <Space>
                <MyButton
                  type="dashed"
                  onClick={() => {
                    centerMarker();
                    // centerMarker(map, marker.current);
                  }}
                >
                  {t("Room detail.Center")}
                </MyButton>
                <MyButton to={`https://www.google.com/maps/dir/?api=1&destination=${coord?.lat},${coord?.lng}`} icon={<GoogleMapIcon />}>
                  {t("Room detail.Navigation")}
                </MyButton>
              </Space>
            }
            loading={!coord}
            // cover={

            // }
            styles={{
              body: {
                padding: 0,
                overflow: "hidden",
              },
            }}
          >
            <div className="aspect-square w-full overflow-hidden outline-none md:aspect-[21/9]">
              <MyGoogleMap
                icon={
                  <MyButton
                    onClick={() => {
                      logger("hihi");
                    }}
                    className="bg-cyan-800"
                    shape="round"
                  >
                    hihi
                  </MyButton>
                }
                pins={[coord, userCoord].filter((v) => v) as Coords[]}
                onGoogleApiLoaded={({ map }) => setMap(map)}
              />
            </div>
          </Card>
        </div>
      ) : isLoading ? (
        t("State.Loading")
      ) : (
        t("Extra.Error occurred!")
      )}
    </MyContainer>
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
