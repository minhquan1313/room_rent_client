import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import { pageTitle } from "@/utils/pageTitle";
import { Space, Typography } from "antd";

function Home() {
  pageTitle("");

  return (
    <MyContainer>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", paddingTop: 20 }}
      >
        Chào mừng bạn
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center" }}>
        Tìm và đặt chuyến ngay thoi!
      </Typography.Paragraph>

      {/* <Test /> */}

      <Space>
        <MyButton to="/rooms/add">Thêm phòng</MyButton>
      </Space>
    </MyContainer>
  );
}

export default Home;
