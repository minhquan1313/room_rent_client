import MyImage from "@/Components/MyImage";
import { VerifyBadge } from "@/Components/VerifyBadge";
import { isRoleOwner } from "@/constants/roleType";
import { routeUserDetail } from "@/constants/route";
import { IGender } from "@/types/IGender";
import { IRole } from "@/types/IRole";
import { IUser } from "@/types/IUser";
import { dateFormat } from "@/utils/dateFormat";
import { actionAllowance } from "@/utils/getTableColumn/actionAllowance";
import { filterCustom } from "@/utils/getTableColumn/filterCustom";
import { Space, Switch, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import logger from "../logger";

export function user(
  roles: IRole[] | undefined,
  genders: IGender[] | undefined,
  disablingUser: IUser | undefined,
  setDisablingUser: (u?: IUser) => void,
  disableUser: (id: string, disabled: boolean) => Promise<void>,
  user: IUser,
): ColumnsType<IUser> {
  return [
    {
      title: "Username",
      dataIndex: "username",
      width: 150,
      sorter: true,
      fixed: "left",
      render(value, record) {
        return <Link to={`${routeUserDetail}/${record._id}`}>{value}</Link>;
      },
    },
    Table.EXPAND_COLUMN,
    {
      title: "ID",
      dataIndex: "_id",
      width: 150,
      ...filterCustom({ placeholder: "Tìm ID" }),
      render(value) {
        return <Typography.Text copyable>{value}</Typography.Text>;
      },
    },
    {
      title: "Họ",
      dataIndex: "last_name",
      width: 200,
      sorter: true,
    },
    {
      title: "Tên",
      dataIndex: "first_name",
      width: 200,
      sorter: true,
    },
    {
      title: "Avatar",
      dataIndex: "image",
      width: 200,
      render(value) {
        return value ? (
          <MyImage
            src={value}
            addServer
            width={100}
            height={100}
            className="object-contain"
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
      render(value, record) {
        return isRoleOwner(record.role?.title) && value ? (
          <MyImage
            src={value}
            addServer
            width={100}
            height={100}
            className="object-contain"
            // className={`object-cover ${bannerAspect}`}
          />
        ) : null;
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: 200,
      sorter: true,
      filters: roles?.map((g: { display_name: any; title: any }) => ({
        text: g.display_name,
        value: g.title,
      })),
      render(value: IRole) {
        return value?.display_name;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: 200,
      sorter: true,
      filters: genders?.map((g: { display_name: any; title: any }) => ({
        text: g.display_name,
        value: g.title,
      })),
      render(value: IGender) {
        return value?.display_name;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
      ...filterCustom({ placeholder: "Tìm email" }),
      render(value: IUser["email"]) {
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
      ...filterCustom({ placeholder: "Tìm số điện thoại" }),
      render(value: IUser["phone"]) {
        return (
          <Space>
            {value?.e164_format}
            <VerifyBadge state={value?.verified} />
          </Space>
        );
      },
    },
    {
      title: "Hoạt động",
      dataIndex: "disabled",
      width: 100,
      sorter: true,
      filterMultiple: false,
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
        const allowed =
          actionAllowance(user.role, record.role) || record._id === user?._id;

        if (!allowed) return null;

        return (
          <Switch
            checked={!value}
            loading={disablingUser?._id === record._id}
            onChange={async (e) => {
              setDisablingUser(record);
              logger(e, record._id);
              await disableUser(record._id, !e);
            }}
          />
        );
      },
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      width: 200,
      sorter: true,
      render: (value) => dateFormat(value).format("LLL"),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (value) => dateFormat(value).format("LLL"),
    },
  ];
}
