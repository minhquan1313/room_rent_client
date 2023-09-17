import MyButton from "@/Components/MyButton";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import { formatObject } from "@/utils/objectToPayloadParams";
import { Card, Col, Form, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";

type SearchFields = Partial<RoomPayload> & {
  kw?: string;
};
export const HomeSearch = () => {
  const navigate = useNavigate();

  return (
    <Card bordered={false}>
      <Form
        onFinish={(e: SearchFields) => {
          const query = new URLSearchParams(formatObject(e) as any).toString();
          // const query2 = objectToPayloadParams(formatObject(e)).toString();
          // console.log(`🚀 ~ HomeSearch ~ query2:`, query2);
          console.log(`🚀 ~ HomeSearch ~ query:`, query);

          navigate(`/rooms${query ? `?${query}` : ""}`);
        }}
        size={isMobile() ? "large" : undefined}
      >
        <Row gutter={[8, 8]}>
          <Col xs={24} md={24} xl={10}>
            <Form.Item<SearchFields> name={"kw"} noStyle>
              <Input
                placeholder="Từ khoá"
                bordered={true}
                className="text-ellipsis"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10} xl={6}>
            <Form.Item<SearchFields> name={"room_type"} noStyle>
              <SelectRoomType
                className="w-full text-ellipsis"
                bordered={true}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10} xl={6}>
            <Form.Item<SearchFields> name={"services"} noStyle>
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
        </Row>
      </Form>
    </Card>
  );
};
