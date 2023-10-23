import MyButton from "@/Components/MyButton";
import { pageTitle } from "@/utils/pageTitle";
import { Result } from "antd";

function NotFound() {
  pageTitle("404");

  return (
    <div className="mx-auto my-auto h-full">
      <div>
        <Result
          status="404"
          title="404"
          subTitle="Không tồn tại trang này"
          extra={
            <MyButton type="primary" to="/">
              Quay về trang chủ
            </MyButton>
          }
        />
        {/* <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="404"
        /> */}
        {/* <MyButton
          type="dashed"
          to="/">
          Quay về trang chủ
        </MyButton> */}
      </div>
    </div>
  );
}

export default NotFound;
