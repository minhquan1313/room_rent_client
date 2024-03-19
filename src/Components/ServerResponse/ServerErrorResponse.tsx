import Content from "@/Components/ServerResponse/Content";
import { TErrorResponse } from "@/types/TErrorResponse";
import logger from "@/utils/logger";
import { Alert, message, notification } from "antd";
import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface ErrorResponseProps {
  errors?: TErrorResponse | unknown;
  duration?: number;
  mode?: "component" | "notification" | "message";
}

const defaultDuration = 30;

const ServerErrorResponse = memo(function ServerErrorResponse(props: ErrorResponseProps) {
  const {
    mode = "component",
    duration = defaultDuration,

    errors,
  } = props;

  const { t } = useTranslation();
  const [notifyApi, notifyHolder] = notification.useNotification();
  const [messageApi, messageHolder] = message.useMessage();

  function isTErrorResp(err: unknown) {
    return Array.isArray(err) && err[0]?.code && err[0]?.error;
  }

  useEffect(() => {
    logger(`🚀 ~ file: ErrorResponse.tsx:56 ~ useEffect ~ errors:`, errors);

    if (mode === "component" || !errors) return;

    let content: JSX.Element[];
    if (isTErrorResp(errors)) {
      content = (errors as TErrorResponse).map(({ code }) => <Content key={code} errorCode={code} />);
    } else {
      content = [<Content errorCode={"000000"} />];
    }

    switch (mode) {
      case "message":
        messageApi.open({
          type: "error",
          duration: duration,
          content: content,
        });
        break;

      case "notification":
        notifyApi.open({
          type: "error",
          duration: duration,
          message: t("Extra.Error occurred!"),
          description: content,
        });
        break;
    }
  }, [JSON.stringify(errors), mode]);

  if (!errors) return null;

  return (
    <>
      {messageHolder}
      {notifyHolder}
      {mode === "component" && (
        <Alert
          type="error"
          message={
            isTErrorResp(errors) ? (
              (errors as TErrorResponse).map(({ code }, i) => <Content key={i} errorCode={code} />)
            ) : (
              <Content errorCode={"000000"} />
            )
          }
        />
      )}
    </>
  );
});

// function Content({ errors }: ErrorResponseProps) {
//   //
//   return;
// }

export default ServerErrorResponse;
