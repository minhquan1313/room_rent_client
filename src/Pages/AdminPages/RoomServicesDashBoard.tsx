import AddRoomService from "@/Components/AdminPages/AddRoomService";
import EditRoomService from "@/Components/AdminPages/EditRoomService";
import MyButton from "@/Components/MyButton";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { RoomSvService } from "@/services/RoomSvService";
import { IRoomService } from "@/types/IRoomService";
import getTableColumn from "@/utils/getTableColumn/getTableColumn";
import logger from "@/utils/logger";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { pageTitle } from "@/utils/pageTitle";
import { Popconfirm, Space, Typography, notification } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

interface TDataTable extends IRoomService {}
const RoomServicesDashBoard = () => {
  pageTitle("Dịch vụ phòng - Quản trị");

  const { user } = useContext(UserContext);
  const { roomServices, mutateRoomServices, mutateRoomServiceCategories } =
    useContext(GlobalDataContext);

  const [notifyApi, contextHolder] = notification.useNotification();

  const [loadingData, setLoadingData] = useState(false);

  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState<TDataTable>();

  const fetchData = useCallback(async () => {
    setLoadingData(true);

    try {
      await mutateRoomServices();
      await mutateRoomServiceCategories();
    } catch (error) {
      //
      notificationResponseError({
        error,
        notification: notifyApi,
      });
    }
    setLoadingData(false);
  }, []);

  const update = async (item: IRoomService, payload: any) => {
    try {
      //
      await RoomSvService.update(item._id, payload);
      notifyApi.success({
        message: "Lưu thành công",
        description: `Lưu thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });
      await fetchData();
    } catch (error) {
      logger(`🚀 ~ update ~ error:`, error);
      notificationResponseError({
        error,
        notification: notifyApi,
      });
    }
  };

  const columns = useMemo<ColumnsType<TDataTable>>(
    () =>
      !user
        ? []
        : [
            ...getTableColumn.roomServices({
              update,
            }),
            {
              title: "Hành động",
              key: "action",
              width: 200,
              fixed: "right",
              render: (_, record) => {
                const disabled = false;

                if (disabled) return null;

                const popDeleteTitle = (
                  <>
                    Xoá sẽ{" "}
                    <Typography.Text type="danger">
                      xoá luôn các phòng
                    </Typography.Text>{" "}
                    thuộc loại {record.display_name}?
                    <br />
                    Bạn có chắc muốn xoá?
                  </>
                );

                return (
                  <Space size="middle">
                    <MyButton onClick={() => setEditItem(record)}>Sửa</MyButton>
                    <Popconfirm
                      title={popDeleteTitle}
                      onConfirm={() => deleteItem(record._id)}
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
    [user],
  );

  const dataIndex = useMemo<TDataTable[]>(
    () =>
      !roomServices
        ? []
        : roomServices.map((u) => ({
            ...u,
          })),
    [roomServices],
  );

  const deleteItem = async (id: string) => {
    try {
      await RoomSvService.delete(id);
      notifyApi.success({
        message: "Xoá thành công",
        description: `Xoá thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });
      await fetchData();
    } catch (error) {
      logger(`🚀 ~ deleteItem ~ error:`, error);
      notificationResponseError({
        error,
        notification: notifyApi,
      });
    }
  };

  const handleTableChange: TableProps<TDataTable>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    logger(`🚀 ~ Object.keys ~ filters:`, { pagination, filters, sorter });
  };

  const handleAdd = useCallback(() => {
    fetchData();

    setShowAddItem(false);
  }, []);

  const handleEdit = useCallback(() => {
    fetchData();
    setEditItem(undefined);
  }, []);

  const handleCancel = useCallback(() => {
    setEditItem(undefined);
    setShowAddItem(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Space direction="vertical" className="h-full w-full py-5">
      {contextHolder}
      <MyButton onClick={() => setShowAddItem(true)} type="primary" block>
        Thêm
      </MyButton>
      <div className="max-h-full w-full">
        <Table
          pagination={{
            position: ["topRight"],
            showSizeChanger: true,
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

      <EditRoomService
        item={editItem}
        handleCancel={handleCancel}
        onSaveSuccess={handleEdit}
      />

      <AddRoomService
        handleCancel={handleCancel}
        onSaveSuccess={handleAdd}
        open={showAddItem}
      />
    </Space>
  );
};

export default RoomServicesDashBoard;
