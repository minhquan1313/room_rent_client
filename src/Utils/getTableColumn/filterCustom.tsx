import MyButton from "@/Components/MyButton";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space } from "antd";
import { ColumnType } from "antd/es/table";

export function filterCustom<T>(data: { placeholder: string }): ColumnType<T> {
  return {
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Space
        direction="vertical"
        className="p-2"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          className="block"
          placeholder={data.placeholder}
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
        <Row gutter={[8, 8]}>
          <Col flex={"auto"}>
            <MyButton
              type="primary"
              onClick={() => {
                confirm({
                  closeDropdown: true,
                });
              }}
              icon={<SearchOutlined />}
              size="small"
              block
            >
              Tìm
            </MyButton>
          </Col>
          <Col flex={"auto"}>
            <MyButton
              onClick={() => {
                clearFilters && clearFilters();
                setSelectedKeys([]);
                confirm({
                  closeDropdown: true,
                });
              }}
              size="small"
              block
            >
              Huỷ
            </MyButton>
          </Col>
        </Row>
      </Space>
    ),
  };
}
