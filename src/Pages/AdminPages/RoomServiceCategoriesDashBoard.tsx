import AddRoomServiceCate from "@/Components/AdminPages/AddRoomServiceCate";
import EditRoomServiceCate from "@/Components/AdminPages/EditRoomServiceCate";
import MyButton from "@/Components/MyButton";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { RoomSvCateService } from "@/services/RoomSvCateService";
import { IRoomServiceCategory } from "@/types/IRoomServiceCategory";
import getTableColumn from "@/utils/getTableColumn/getTableColumn";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Popconfirm, Space, Typography, notification } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

interface TDataTable extends IRoomServiceCategory {}
const RoomServiceCategoriesDashBoard = () => {
  pageTitle("Loại dịch vụ phòng - Quản trị");

  const { user } = useContext(UserContext);
  const { roomServiceCategories, mutateRoomServiceCategories } =
    useContext(GlobalDataContext);

  const [notifyApi, contextHolder] = notification.useNotification();

  const [loadingData, setLoadingData] = useState(false);

  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState<TDataTable>();
  const [error, setError] = useState<unknown>();

  const fetchData = useCallback(async () => {
    setLoadingData(true);

    await mutateRoomServiceCategories();

    setLoadingData(false);
  }, []);

  const columns = useMemo<ColumnsType<TDataTable>>(
    () =>
      !user
        ? []
        : [
            ...getTableColumn.roomServicesCate(),
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
      !roomServiceCategories
        ? []
        : roomServiceCategories.map((u) => ({
            ...u,
          })),
    [roomServiceCategories],
  );

  const deleteItem = async (id: string) => {
    setError(undefined);
    try {
      await RoomSvCateService.delete(id);
      notifyApi.success({
        message: "Xoá thành công",
        description: `Xoá thành công như sẽ cập nhật sau vài phút (Server có cache) :>`,
        duration: 30,
      });
      fetchData();
    } catch (error) {
      logger(`🚀 ~ deleteItem ~ error:`, error);

      setError((error as any)?.response?.data);

      // notificationResponseError({
      //   error,
      //   notification: notifyApi,
      // });
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
      <ServerErrorResponse errors={error} mode="notification" />

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

      <EditRoomServiceCate
        item={editItem}
        handleCancel={handleCancel}
        onSaveSuccess={handleEdit}
      />

      <AddRoomServiceCate
        handleCancel={handleCancel}
        onSaveSuccess={handleAdd}
        open={showAddItem}
      />
    </Space>
  );
};

export default RoomServiceCategoriesDashBoard;
