import MyButton from "@/Components/MyButton";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { RoomSearchQuery } from "@/types/IRoom";
import { Col, Form, Input, Row, RowProps } from "antd";

interface Props extends RowProps {
  hasSubmitBtn?: boolean;
}

const RoomSearchShort = ({ hasSubmitBtn, ...rest }: Props) => {
  return (
    <Row {...rest} gutter={[8, 8]}>
      <Col xs={24} md={24} xl={hasSubmitBtn ? 10 : 12}>
        <Form.Item<RoomSearchQuery> name="kw" noStyle>
          <Input
            placeholder="Từ khoá"
            bordered={true}
            className="text-ellipsis"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={hasSubmitBtn ? 10 : 12} xl={6}>
        <Form.Item<RoomSearchQuery> name="room_type" noStyle>
          <SelectRoomType
            className="w-full text-ellipsis"
            bordered={true}
            allowClear
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={hasSubmitBtn ? 10 : 12} xl={6}>
        <Form.Item<RoomSearchQuery> name="services" noStyle>
          <SelectService
            className="w-full text-ellipsis"
            bordered={true}
            allowClear
            maxTagCount={0}
            maxTagPlaceholder={(e) => {
              // if (e.length === 1) return e[0].label;
              return `${e.length} tiêu chí`;
            }}
          />
        </Form.Item>
      </Col>

      {hasSubmitBtn && (
        <Col xs={24} md={4} xl={2}>
          <MyButton
            htmlType="submit"
            type="primary"
            className="min-w-[6rem]"
            block
          >
            Tìm
          </MyButton>
        </Col>
      )}
    </Row>
  );
};

export default RoomSearchShort;
