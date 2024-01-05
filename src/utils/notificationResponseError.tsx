import { ErrorJsonResponse } from "@/types/ErrorJsonResponse";
import { Typography } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

export const notificationResponseError = ({
  notification,
  error,
  message,
}: {
  notification: NotificationInstance;
  error: any;
  message?: string;
}) =>
  notification.open({
    type: "error",
    duration: 30,
    message: message || "Lỗi",
    description: (error!.response.data as ErrorJsonResponse).error.map(
      ({ msg }) => (
        <div key={msg}>
          <Typography.Text>{msg}</Typography.Text>
        </div>
      ),
    ),
  });
