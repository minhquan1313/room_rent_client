import AddRoomDashboard from "@/Components/AdminPages/AddRoomDashboard";
import EditRoomDashboard from "@/Components/AdminPages/EditRoomDashboard";
import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { RoomService } from "@/services/RoomService";
import { fetcher } from "@/services/fetcher";
import { IDataWithCount, IRoom } from "@/types/IRoom";
import { TCommonQuery } from "@/types/TCommonQuery";
import getTableColumn from "@/utils/getTableColumn/getTableColumn";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Divider, Image, Popconfirm, Space, Typography } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import QueryString from "qs";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

type TDataTable = IRoom;
const AllRoomDashBoard = () => {
  pageTitle("Tất cả phòng - Quản trị");
  const { user } = useContext(UserContext);
  const {
    roomServicesConverted,
    districtsAvailable,
    roomTypes,
    provincesAvailable,
  } = useContext(GlobalDataContext);

  const [data, setData] = useState<TDataTable[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [total, setTotal] = useState(0);

  const [showAddUser, setShowAddUser] = useState(false);
  const [editItem, setEditItem] = useState<TDataTable>();

  const [visibleLoading, setVisibleLoading] = useState<TDataTable>();
  const [disabledLoading, setDisabledLoading] = useState<TDataTable>();
  const [verifiedRealLoading, setVerifiedRealLoading] = useState<TDataTable>();
  const [verifiedLoading, setVerifiedLoading] = useState<TDataTable>();

  const [queries, setQueries] = useState<TCommonQuery>({
    page: 1,
    limit: 5,
  });

  const fetchData = useCallback(async () => {
    const queryPayload = QueryString.stringify(queries);
    logger(`🚀 ~ fetchData ~ queries:`, queries);
    logger(`🚀 ~ fetchData ~ queryPayload:`, queryPayload);

    setLoadingData(true);

    try {
      const d: IDataWithCount<TDataTable> = await fetcher(
        `/rooms?${queryPayload}&count`,
      );

      logger(`🚀 ~ fetchData ~ d:`, d);

      setData(d.data);
      setTotal(d.count);
    } catch (error) {
      //
    }
    setLoadingData(false);
  }, [JSON.stringify(queries)]);

  const columns = useMemo<ColumnsType<TDataTable>>(
    () =>
      !user
        ? []
        : [
            ...getTableColumn.room({
              roomServicesConverted,
              roomTypes,
              provincesAvailable,
              districtsAvailable,

              visibleLoading,
              disabledLoading,
              verifiedRealLoading,
              verifiedLoading,

              onVisibleChange: async function (
                room: IRoom,
                is_visible: boolean,
              ): Promise<void> {
                setVisibleLoading(room);

                try {
                  await RoomService.update(room._id, {
                    is_visible,
                  });
                  await fetchData();
                } catch (error) {
                  logger(`🚀 ~ AllRoomDashBoard ~ error:`, error);
                }

                setVisibleLoading(undefined);
              },
              onDisabledChange: async function (
                room: IRoom,
                disabled: boolean,
              ): Promise<void> {
                setDisabledLoading(room);

                try {
                  await RoomService.update(room._id, {
                    disabled,
                  });
                  await fetchData();
                } catch (error) {
                  logger(`🚀 ~ AllRoomDashBoard ~ error:`, error);
                }

                setDisabledLoading(undefined);
              },
              onVerifiedRealChange: async function (
                room: IRoom,
                verified_real: boolean,
              ): Promise<void> {
                setVerifiedRealLoading(room);

                try {
                  await RoomService.update(room._id, {
                    verified_real,
                  });
                  await fetchData();
                } catch (error) {
                  logger(`🚀 ~ AllRoomDashBoard ~ error:`, error);
                }

                setVerifiedRealLoading(undefined);
              },
              onVerifiedChange: async function (
                room: IRoom,
                verified: boolean,
              ): Promise<void> {
                setVerifiedLoading(room);

                try {
                  await RoomService.update(room._id, {
                    verified,
                  });
                  await fetchData();
                } catch (error) {
                  logger(`🚀 ~ AllRoomDashBoard ~ error:`, error);
                }

                setVerifiedLoading(undefined);
              },
            }),
            {
              title: "Hành động",
              key: "action",
              width: 200,
              fixed: "right",
              render: (_, record) => {
                const disabled = false;

                if (disabled) return null;

                const popDeleteTitle = "Bạn có chắc chắn xoá?";

                return (
                  <Space size="middle">
                    <MyButton onClick={() => setEditItem(record)}>Sửa</MyButton>
                    <Popconfirm
                      title={popDeleteTitle}
                      onConfirm={() => deleteRoom(record._id)}
                      okText="Xoá"
                      okType="danger"
                    >
                      <MyButton danger>Xoá</MyButton>
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ],
    [
      disabledLoading,
      districtsAvailable,
      provincesAvailable,
      roomServicesConverted,
      roomTypes,
      user,
      fetchData,
      verifiedLoading,
      verifiedRealLoading,
      visibleLoading,
    ],
  );
  const dataIndex = useMemo<TDataTable[]>(
    () =>
      !data
        ? []
        : data.map((u) => ({
            ...u.location,
            ...u,
          })),
    [data],
  );

  const deleteRoom = async (id: string) => {
    try {
      await RoomService.delete(id);
      await fetchData();
    } catch (error) {
      logger(`🚀 ~ deleteUser ~ error:`, error);
    }
  };

  const handleTableChange: TableProps<TDataTable>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    logger(`🚀 ~ Object.keys ~ filters:`, { pagination, filters, sorter });

    const newQ: TCommonQuery = {
      page: pagination.current,
      limit: pagination.pageSize,
    };

    if (!Array.isArray(sorter) && sorter.order) {
      newQ.sort_field = sorter.field as string;
      newQ.sort = sorter.order === "ascend" ? 1 : -1;
    }

    Object.keys(filters).forEach((key) => {
      const v = filters[key];
      if (!v) return;

      newQ[key] = v;

      const singleFilter: (keyof IRoom)[] = [
        "_id",
        "disabled",
        "is_visible",
        "verified",
        "verified_real",
        "name",
        "owner",
      ];
      if (singleFilter.includes(key as any)) {
        newQ[key] = typeof v[0] === "string" ? v[0].trim() : v[0];
      }
    });

    setQueries(newQ);

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== queries.limit) {
      setData([]);
    }
  };

  const handleAdd = useCallback(() => {
    fetchData();
    setShowAddUser(false);
  }, [fetchData]);

  const handleEdit = useCallback(() => {
    fetchData();
    setEditItem(undefined);
  }, [fetchData]);

  const handleCancel = useCallback(() => {
    setEditItem(undefined);
    setShowAddUser(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(queries)]);

  return (
    <Space direction="vertical" className="h-full w-full py-5">
      <MyButton onClick={() => setShowAddUser(true)} type="primary" block>
        Thêm phòng
      </MyButton>
      {/* Data */}
      <div className="max-h-full w-full">
        <Table
          expandable={{
            expandedRowRender: (record) => {
              logger(`🚀 ~ AllRoomDashBoard ~ record:`, record);

              return (
                <Typography.Paragraph style={{ margin: 0 }}>
                  <Space direction="vertical">
                    <div>
                      ID:{" "}
                      <Typography.Text copyable>{record._id}</Typography.Text>
                    </div>

                    {record.images[0] && (
                      <div>
                        Ảnh:{" "}
                        <div>
                          <Image.PreviewGroup>
                            <Space split={<Divider type="vertical" />}>
                              {record.images.map((img) => (
                                <MyImage
                                  src={img.image}
                                  height={100}
                                  className="object-contain"
                                  addServer
                                />
                              ))}
                            </Space>
                          </Image.PreviewGroup>
                        </div>
                      </div>
                    )}
                  </Space>
                </Typography.Paragraph>
              );
            },
          }}
          pagination={{
            position: ["topRight"],
            current: queries.page,
            pageSize: queries.limit,
            showSizeChanger: true,
            // pageSizeOptions: [1, 2, 3, 4, 5],
            total: total,
          }}
          onChange={handleTableChange}
          columns={columns}
          dataSource={dataIndex}
          scroll={{
            x: "100%",
            y: (() => {
              const value = window.innerHeight - 300;
              return value < 500 ? 500 : value;
            })(),
          }}
          rowKey={(record) => record._id}
          loading={loadingData}
          className="h-full"
        />
      </div>

      <EditRoomDashboard
        room={editItem}
        handleCancel={handleCancel}
        onSaveSuccess={handleEdit}
      />

      <AddRoomDashboard
        handleCancel={handleCancel}
        onSaveSuccess={handleAdd}
        open={showAddUser}
      />
    </Space>
  );
};

export default AllRoomDashBoard;
