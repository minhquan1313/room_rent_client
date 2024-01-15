import AddRoomType from "@/Components/AdminPages/AddRoomType";
import EditRoomType from "@/Components/AdminPages/EditRoomType";
import MyButton from "@/Components/MyButton";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { RoomTypeService } from "@/services/RoomTypeService";
import { IRoomType } from "@/types/IRoomType";
import getTableColumn from "@/utils/getTableColumn/getTableColumn";
import logger from "@/utils/logger";
import { notificationResponseError } from "@/utils/notificationResponseError";
import { pageTitle } from "@/utils/pageTitle";
import { Popconfirm, Space, Typography, notification } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

interface TDataTable extends IRoomType {}
const RoomTypesDashBoard = () => {
  pageTitle(" Loại phòng - Quản trị");

  const { user } = useContext(UserContext);
  const { roomTypes, mutateRoomTypes } = useContext(GlobalDataContext);

  const [notifyApi, contextHolder] = notification.useNotification();

  const [loadingData, setLoadingData] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [editItem, setEditItem] = useState<TDataTable>();

  const fetchData = useCallback(async () => {
    setLoadingData(true);

    try {
      await mutateRoomTypes();
    } catch (error) {
      //
    }
    setLoadingData(false);
  }, []);

  const columns = useMemo<ColumnsType<TDataTable>>(
    () =>
      !user
        ? []
        : [
            ...getTableColumn.roomTypes(),
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
      !roomTypes
        ? []
        : roomTypes.map((u) => ({
            ...u,
          })),
    [roomTypes],
  );

  const deleteItem = async (id: string) => {
    try {
      await RoomTypeService.delete(id);
      notifyApi.success({
        message: "Thành công",
        description: `Xoá thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });
      await mutateRoomTypes();
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
    mutateRoomTypes();
    setShowAddUser(false);
  }, []);

  const handleEdit = useCallback(() => {
    mutateRoomTypes();
    setEditItem(undefined);
  }, []);

  const handleCancel = useCallback(() => {
    setEditItem(undefined);
    setShowAddUser(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Space direction="vertical" className="h-full w-full py-5">
      {contextHolder}
      <MyButton onClick={() => setShowAddUser(true)} type="primary" block>
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

      <EditRoomType
        item={editItem}
        handleCancel={handleCancel}
        onSaveSuccess={handleEdit}
      />

      <AddRoomType
        handleCancel={handleCancel}
        onSaveSuccess={handleAdd}
        open={showAddUser}
      />
    </Space>
  );
};

export default RoomTypesDashBoard;
