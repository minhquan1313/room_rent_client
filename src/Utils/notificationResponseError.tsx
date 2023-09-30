import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { Typography } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { AxiosError } from "axios";

export const notificationResponseError = ({
  notification,
  error,
  message,
}: {
  notification: NotificationInstance;
  error: any;
  message: string;
}) =>
  notification.open({
    type: "error",
    duration: 0,
    message,
    description: (error!.response.data as ErrorJsonResponse).error.map(
      ({ msg }) => (
        <div key={msg}>
          <Typography.Text>{msg}</Typography.Text>
        </div>
      ),
    ),
  });
