import MyImage from "@/Components/MyImage";
import { Avatar, AvatarProps } from "antd";

interface Props extends AvatarProps {
  addServer?: boolean;
  src?: string | null;
  alt?: string;
  preview?: boolean;
}

function MyAvatar({ src, addServer, alt, preview, ...rest }: Props) {
  return (
    <Avatar
      src={
        src ? (
          <MyImage
            src={src}
            addServer={addServer}
            preview={preview ?? false}
            width={`100%`}
            height={`100%`}
          />
        ) : null
      }
      {...rest}
    >
      {alt}
    </Avatar>
  );
}

export default MyAvatar;
