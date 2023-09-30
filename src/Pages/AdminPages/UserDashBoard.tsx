import EditUser from "@/Components/AdminPages/EditUser";
import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import { VerifyBadge } from "@/Components/VerifyBadge";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { bannerAspect } from "@/constants/bannerAspect";
import { isRoleOwner, isRoleTopAdmin, roleOrder } from "@/constants/roleType";
import { UserService } from "@/services/UserService";
import { fetcher } from "@/services/fetcher";
import { IDataWithCount } from "@/types/IRoom";
import { IUser } from "@/types/IUser";
import { TCommonQuery } from "@/types/TCommonQuery";
import { dateFormat } from "@/utils/dateFormat";
import { pageTitle } from "@/utils/pageTitle";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Switch, Typography } from "antd";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import QueryString from "qs";
import { useContext, useEffect, useMemo, useState } from "react";

type DataType = IUser & {
  key: React.Key;
};
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

  const [editUser, setEditUser] = useState<IUser>();
  const [total, setTotal] = useState(0);
  const [disablingUser, setDisablingUser] = useState<IUser>();
  const [queries, setQueries] = useState<TCommonQuery>({
    page: 1,
    limit: 3,
  });

  // const tableWrapperRef = useRef<HTMLDivElement>(null);
  // const [tableWrapperHeight, setTableWrapperHeight] = useState(0);
  const columns = useMemo<ColumnsType<DataType>>(
    () => [
      {
        title: "Username",
        dataIndex: "username",
        width: 200,
        sorter: true,
      },
      Table.EXPAND_COLUMN,
      {
        title: "ID",
        dataIndex: "_id",
        width: 250,
        // sorter: true,
      },
      {
        title: "Tên",
        dataIndex: "first_name",
        width: 200,
        sorter: true,
      },
      {
        title: "Họ",
        dataIndex: "last_name",
        width: 200,
        sorter: true,
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        width: 200,
        sorter: true,
        filters: roles?.map((g) => ({
          text: g.display_name,
          value: g.title,
        })),
        render(value, record, index) {
          return value.display_name;
        },
      },
      {
        title: "Giới tính",
        dataIndex: "gender",
        width: 200,
        sorter: true,
        filters: genders?.map((g) => ({
          text: g.display_name,
          value: g.title,
        })),
        render(value, record, index) {
          return value.display_name;
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        width: 250,
        render(value: IUser["email"], record, index) {
          return (
            <Space>
              {value?.email}
              <VerifyBadge state={value?.verified} />
            </Space>
          );
        },
      },
      {
        title: "Điện thoại",
        dataIndex: "phone",
        width: 200,
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              placeholder={`Tìm số điện thoại`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                confirm({
                  closeDropdown: true,
                });
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <MyButton
                type="primary"
                onClick={() => {
                  confirm({
                    closeDropdown: true,
                  });
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Tìm
              </MyButton>
              <MyButton
                onClick={() => {
                  clearFilters && clearFilters();
                  setSelectedKeys([]);
                  confirm({
                    closeDropdown: false,
                  });
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </MyButton>
            </Space>
          </div>
        ),
        render(value: IUser["phone"], record, index) {
          return (
            <Space>
              {value?.e164_format}
              <VerifyBadge state={value?.verified} />
            </Space>
          );
        },
      },
      {
        title: "Avatar",
        dataIndex: "image",
        width: 200,
        render(value, record, index) {
          return value ? (
            <MyImage
              src={value}
              addServer
              width={100}
              height={100}
              className="aspect-square object-contain"
            />
          ) : (
            <div style={{ height: 100 }} />
          );
        },
      },
      {
        title: "Bìa chủ phòng",
        dataIndex: "owner_banner",
        width: 200,
        render(value, record, index) {
          return isRoleOwner(record.role.title) && value ? (
            <MyImage
              src={value}
              addServer
              width={100}
              // height={100}
              className={`object-cover ${bannerAspect}`}
            />
          ) : null;
        },
      },
      {
        title: "Tạo lúc",
        dataIndex: "createdAt",
        width: 200,
        sorter: true,
        render: (value) => dateFormat(value).format("LLL"),
      },
      {
        title: "Cập nhật",
        dataIndex: "updatedAt",
        width: 200,
        sorter: true,
        render: (value) => dateFormat(value).format("LLL"),
      },
      {
        title: "Hoạt động",
        dataIndex: "disabled",
        width: 200,
        filters: [
          {
            text: "Cho phép",
            value: false,
          },
          {
            text: "Cấm",
            value: true,
          },
        ],

        render: (value, record) => {
          return (
            <Switch
              checked={!value}
              loading={disablingUser?._id === record._id}
              onChange={async (e) => {
                setDisablingUser(record);
                console.log(e, record._id);
                await disableUser(record._id, !e);
              }}
            />
          );
        },
      },
      {
        title: "...",
        key: "action",
        width: 200,
        fixed: "right",
        render: (_, record) => {
          const disabled =
            isRoleTopAdmin(record.role.title) ||
            record._id === user?._id ||
            roleOrder(record.role.title) >= roleOrder(user?.role.title);

          if (disabled) return null;

          return (
            <Space size="middle">
              <MyButton onClick={() => setEditUser(record)}>Sửa</MyButton>
              <MyButton onClick={() => deleteUser(record._id)} danger>
                Xoá
              </MyButton>
            </Space>
          );
        },
      },
    ],
    [disablingUser?._id, genders, roles],
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

  const disableUser = async (id: string, disabled: boolean) => {
    //
    try {
      await UserService.update(id, {
        disabled,
      });
      await fetchData();
    } catch (error) {
      console.log(`🚀 ~ disableUser ~ error:`, error);

      //
    }
    setDisablingUser(undefined);
  };
  const deleteUser = (id: string) => {
    console.log(`🚀 ~ deleteUser ~ id:`, id);

    //
  };

  const fetchData = async () => {
    const queryPayload = QueryString.stringify(queries);
    console.log(`🚀 ~ fetchData ~ queries:`, queries);
    console.log(`🚀 ~ fetchData ~ queryPayload:`, queryPayload);

    setLoading(true);

    try {
      const d: IDataWithCount<IUser> = await fetcher(
        `/users?${queryPayload}&count`,
      );

      //   setData(results);
      console.log(`🚀 ~ fetchData ~ d:`, d);

      setAllUsers(d.data);
      setTotal(d.count);

      // setQueries({
      //   ...queries,
      // });
      //   setLoading(false);
      //   setTableParams({
      //     ...tableParams,
      //     pagination: {
      //       ...tableParams.pagination,
      //       total: 200,
      //       // 200 is mock data, you should read it from server
      //       // total: data.totalCount,
      //     },
      //   });
      // });
    } catch (error) {
      //
    }
    setLoading(false);
  };

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    console.log(`🚀 ~ Object.keys ~ filters:`, { pagination, filters, sorter });

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

      if (key === "phone") newQ[key] = v[0];
    });

    setQueries(newQ);

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== queries.limit) {
      setAllUsers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(queries)]);

  // useEffect(() => {
  //   const f = () => {
  //     setTableWrapperHeight(tableWrapperRef.current?.clientHeight || 0);
  //   };
  //   window.addEventListener("resize", f);

  //   return () => {
  //     window.removeEventListener("resize", f);
  //   };
  // }, []);

  return (
    <div className="h-full">
      {/* Filter */}
      <div className="">
        {/* Search */}
        <div className="">Search</div>
      </div>
      {/* Data */}
      <div
        className="max-h-full w-full"
        // ref={tableWrapperRef}
      >
        <Table
          expandable={{
            expandedRowRender: (record) => (
              <Typography.Paragraph style={{ margin: 0 }}>
                <Space direction="vertical">
                  <div> ID: {record._id}</div>
                  <div> PASS: {record.password}</div>
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
          // locale={{
          //   emptyText: <NotFoundContent />,
          // }}
          dataSource={data}
          scroll={{
            x: "100%",
            y: window.innerHeight - 250 < 500 ? 500 : window.innerHeight - 250,
            // y: tableWrapperHeight - 150,
          }}
          rowKey={(record) => record._id}
          loading={loading}
          className="h-full"
        />
      </div>
      <EditUser
        user={editUser}
        handleCancel={() => setEditUser(undefined)}
        onSaveSuccess={() => {
          fetchData();
          setEditUser(undefined);
        }}
      />
    </div>
  );
};

export default UserDashBoard;
