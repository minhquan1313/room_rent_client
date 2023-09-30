import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Badge, theme } from "antd";

export function VerifyBadge({ state }: { state?: boolean }) {
  const { token } = theme.useToken();
  return (
    <Badge
      count={
        state === true ? (
          <CheckCircleFilled style={{ color: token.colorSuccess }} />
        ) : (
          <CloseCircleFilled style={{ color: token.colorError }} />
        )
      }
    />
  );
}
