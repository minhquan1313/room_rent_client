import AddUser from "@/Components/AdminPages/AddUser";
import EditUser from "@/Components/AdminPages/EditUser";
import MyButton from "@/Components/MyButton";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleOwner, isRoleTopAdmin, roleOrder } from "@/constants/roleType";
import { UserService } from "@/services/UserService";
import { fetcher } from "@/services/fetcher";
import { IDataWithCount } from "@/types/IRoom";
import { IUser } from "@/types/IUser";
import { TCommonQuery } from "@/types/TCommonQuery";
import getTableColumn from "@/utils/getTableColumn/getTableColumn";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Popconfirm, Space, Typography } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import QueryString from "qs";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

type DataType = IUser;
// type DataType = {
//   [k in keyof IUser]?: any;
// } & {
//   key: React.Key;
// };

const UserDashBoard = () => {
  pageTitle("Người dùng - Quản trị");
  const { user } = useContext(UserContext);
  const { genders, roles } = useContext(GlobalDataContext);

  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<IUser>();
  const [total, setTotal] = useState(0);
  const [disablingUser, setDisablingUser] = useState<IUser>();
  const [queries, setQueries] = useState<TCommonQuery>({
    page: 1,
    limit: 5,
  });
  // const keywordRef = useRef<InputRef>(null);

  // const tableWrapperRef = useRef<HTMLDivElement>(null);
  // const [tableWrapperHeight, setTableWrapperHeight] = useState(0);
  const columns = useMemo<ColumnsType<DataType>>(
    () =>
      !user
        ? []
        : [
            ...getTableColumn.user(
              roles,
              genders,
              disablingUser,
              setDisablingUser,
              disableUser,
              user,
            ),
            {
              title: "Hành động",
              key: "action",
              width: 200,
              fixed: "right",
              render: (_, record) => {
                const allowed =
                  isRoleTopAdmin(user.role?.title) ||
                  record._id === user?._id ||
                  roleOrder(user?.role?.title) > roleOrder(record.role?.title);

                if (!allowed) return null;

                const popDeleteTitle = isRoleOwner(record.role?.title) ? (
                  <>
                    <div>
                      Đây là tài khoản{" "}
                      <Typography.Text type="warning">
                        chủ phòng
                      </Typography.Text>
                    </div>
                    <div>
                      Xoá sẽ{" "}
                      <Typography.Text type="danger">
                        xoá luôn các phòng
                      </Typography.Text>{" "}
                      mà người này đăng
                    </div>
                    <div>Bạn có chắc muốn xoá?</div>
                  </>
                ) : (
                  "Bạn có chắc chắn xoá?"
                );
                return (
                  <Space size="middle">
                    <MyButton onClick={() => setEditUser(record)}>Sửa</MyButton>
                    <Popconfirm
                      title={popDeleteTitle}
                      onConfirm={() => deleteUser(record._id)}
                      okText="Xoá"
                      okType="danger"
                    >
                      <MyButton
                        danger
                        disabled={!isRoleTopAdmin(user.role?.title)}
                      >
                        Xoá
                      </MyButton>
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ],
    [disablingUser, genders, roles, user, disableUser],
  );
  const data = useMemo<DataType[]>(
    () =>
      !allUsers
        ? []
        : allUsers.map((u) => ({
            key: u._id,
            ...u,
          })),
    [allUsers],
  );

  async function disableUser(id: string, disabled: boolean) {
    //
    try {
      await UserService.update(id, {
        disabled,
      });
      await fetchData();
    } catch (error) {
      logger(`🚀 ~ disableUser ~ error:`, error);
    }
    setDisablingUser(undefined);
  }
  const deleteUser = async (id: string) => {
    try {
      await UserService.delete(id);
      await fetchData();
    } catch (error) {
      logger(`🚀 ~ deleteUser ~ error:`, error);
    }
  };

  const fetchData = useCallback(async () => {
    const queryPayload = QueryString.stringify(queries);
    logger(`🚀 ~ fetchData ~ queries:`, queries);
    logger(`🚀 ~ fetchData ~ queryPayload:`, queryPayload);

    setLoading(true);

    try {
      const d: IDataWithCount<IUser> = await fetcher(
        `/users?${queryPayload}&count`,
      );

      //   setData(results);
      logger(`🚀 ~ fetchData ~ d:`, d);

      setAllUsers(d.data);
      setTotal(d.count);
    } catch (error) {
      //
    }
    setLoading(false);
  }, [JSON.stringify(queries)]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
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

      if (["phone", "_id"].includes(key)) {
        newQ[key] = v[0];
      }
    });

    setQueries(newQ);

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== queries.limit) {
      setAllUsers([]);
    }
  };
  const handleAddUser = useCallback(() => {
    fetchData();
    setShowAddUser(false);
  }, [fetchData]);

  const handleEditUser = useCallback(() => {
    fetchData();
    setEditUser(undefined);
  }, [fetchData]);

  const handleCancel = useCallback(() => {
    setEditUser(undefined);
    setShowAddUser(false);
  }, []);
  // const searchKeyword = useCallback((value: string) => {
  //   if (value) {
  //     setQueries((q) => ({
  //       ...q,
  //       kw: value,
  //     }));
  //   } else {
  //     setQueries((q) => {
  //       delete q.kw;
  //       return {
  //         ...q,
  //       };
  //     });
  //   }
  //   setQueries((q) =>
  //     value
  //       ? {
  //           ...q,
  //           kw: value,
  //         }
  //       : q,
  //   );
  // }, []);

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(queries)]);

  return (
    <Space direction="vertical" className="h-full w-full py-5">
      <MyButton onClick={() => setShowAddUser(true)} type="primary" block>
        Thêm user
      </MyButton>
      <div className="max-h-full w-full">
        <Table
          expandable={{
            expandedRowRender: (record) => (
              <Typography.Paragraph style={{ margin: 0 }}>
                <Space direction="vertical">
                  <div>
                    ID: <Typography.Text copyable>{record._id}</Typography.Text>
                  </div>
                  <div>
                    PASS:{" "}
                    <Typography.Text copyable>
                      {record.password}
                    </Typography.Text>
                  </div>
                </Space>
              </Typography.Paragraph>
            ),
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
          dataSource={data}
          scroll={{
            x: "100%",
            y: (() => {
              const value = window.innerHeight - 300;
              return value < 500 ? 500 : value;
            })(),
          }}
          rowKey={(record) => record._id}
          loading={loading}
          className="h-full"
        />
      </div>

      <EditUser
        user={editUser}
        handleCancel={handleCancel}
        onSaveSuccess={handleEditUser}
      />
      <AddUser
        handleCancel={handleCancel}
        onSaveSuccess={handleAddUser}
        show={showAddUser}
      />
    </Space>
  );
};

export default UserDashBoard;
