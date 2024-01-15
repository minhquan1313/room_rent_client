import MyButton from "@/Components/MyButton";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { RoomSearchQuery } from "@/types/IRoom";
import { Col, Form, Input, Row, RowProps } from "antd";
import { useTranslation } from "react-i18next";

interface Props extends RowProps {
  hasSubmitBtn?: boolean;
}

const RoomSearchShort = ({ hasSubmitBtn, ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <Row {...rest} gutter={[8, 8]}>
      <Col xs={24} md={24} xl={hasSubmitBtn ? 10 : 12}>
        <Form.Item<RoomSearchQuery> name="kw" noStyle>
          <Input
            placeholder={t("home page.Keyword")}
            className="text-ellipsis"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={hasSubmitBtn ? 10 : 12} xl={6}>
        <Form.Item<RoomSearchQuery> name="room_type" noStyle>
          <SelectRoomType className="w-full text-ellipsis" allowClear />
        </Form.Item>
      </Col>

      <Col xs={24} md={hasSubmitBtn ? 10 : 12} xl={6}>
        <Form.Item<RoomSearchQuery> name="services" noStyle>
          <SelectService
            className="w-full text-ellipsis"
            allowClear
            maxTagCount={0}
            maxTagPlaceholder={(e) => {
              return `${e.length} ${t("home page.Criteria").toLowerCase()}`;
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
            {t("home page.Find")}
          </MyButton>
        </Col>
      )}
    </Row>
  );
};

export default RoomSearchShort;
