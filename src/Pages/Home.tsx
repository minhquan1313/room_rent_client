import { Typography } from "antd";

function Home() {
  // pageTitle("Trang chủ");

  return (
    <div>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", paddingTop: 20 }}>
        Chào mừng bạn
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center" }}>Tìm và đặt chuyến ngay thoi!</Typography.Paragraph>
    </div>
  );
}

export default Home;
