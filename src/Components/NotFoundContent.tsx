import { Empty, EmptyProps } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const NotFoundContent = memo(function NotFoundContent(props: EmptyProps) {
  const { t } = useTranslation();

  return <Empty description={t("Extra.No content")} image={Empty.PRESENTED_IMAGE_SIMPLE} className="m-2" {...props} />;
});

export default NotFoundContent;
