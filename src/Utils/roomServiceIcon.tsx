import { TRoomService } from "@/types/IRoomService";
import { QuestionOutlined, WifiOutlined } from "@ant-design/icons";

export function roomServiceIcon(service: string) {
  switch (service as TRoomService) {
    case "wifi":
      return <WifiOutlined />;
    case "mt":
      return <WifiOutlined />;
    case "anc":
      return <WifiOutlined />;
    case "bct":
      return <WifiOutlined />;
    case "bdxr":
      return <WifiOutlined />;
    case "bnl":
      return <WifiOutlined />;
    case "bv":
      return <WifiOutlined />;
    case "bxb":
      return <WifiOutlined />;
    case "c":
      return <WifiOutlined />;
    case "can":
      return <WifiOutlined />;
    case "cv":
      return <WifiOutlined />;
    case "dh":
      return <WifiOutlined />;
    case "gl":
      return <WifiOutlined />;
    case "gn":
      return <WifiOutlined />;
    case "hb":
      return <WifiOutlined />;
    case "hgx":
      return <WifiOutlined />;
    case "kb":
      return <WifiOutlined />;
    case "mg":
      return <WifiOutlined />;
    case "nth":
      return <WifiOutlined />;
    case "og":
      return <WifiOutlined />;
    case "st":
      return <WifiOutlined />;
    case "sv":
      return <WifiOutlined />;
    case "taq":
      return <WifiOutlined />;
    case "th":
      return <WifiOutlined />;
    case "tl":
      return <WifiOutlined />;
    case "tttdtt":
      return <WifiOutlined />;
    case "tttp":
      return <WifiOutlined />;

    default:
      return <QuestionOutlined />;
  }
}
