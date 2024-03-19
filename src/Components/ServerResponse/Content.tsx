import { TErrorResponse } from "@/types/TErrorResponse";
import { Typography } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export interface ContentProps {
  errorCode: TErrorResponse[number]["code"] | "000000";
}

const Content = memo(function Content(props: ContentProps) {
  const { errorCode } = props;

  const { t: tApi } = useTranslation("api");

  return (
    <div className="text-center">
      <Typography.Text type="danger">
        {tApi(`error code.${errorCode}`)}
      </Typography.Text>
    </div>
  );
});

export default Content;
