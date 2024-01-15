import RoomSearchShort from "@/Components/RoomShortFormInputs";
import { routeRoomSearch } from "@/constants/route";
import { RoomPayload } from "@/types/IRoom";
import { isMobile } from "@/utils/isMobile";
import logger from "@/utils/logger";
import { formatObject } from "@/utils/objectToPayloadParams";
import { Card, Form } from "antd";
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

          logger(`🚀 ~ HomeSearch ~ query:`, query);

          navigate(`${routeRoomSearch}${query ? `?${query}` : ""}`);
        }}
        size={isMobile() ? "large" : undefined}
      >
        <RoomSearchShort hasSubmitBtn />
      </Form>
    </Card>
  );
};
