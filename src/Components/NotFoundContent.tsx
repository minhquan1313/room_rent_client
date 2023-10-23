import { Empty, EmptyProps } from "antd";
import { memo } from "react";

const NotFoundContent = memo((rest: EmptyProps) => {
  return (
    <Empty
      description="Không có dữ liệu nha"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      className="m-2"
      {...rest}
    />
  );
});

export default NotFoundContent;
