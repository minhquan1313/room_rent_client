import MyImage from "@/Components/MyImage";
import { Avatar, AvatarProps } from "antd";

interface Props extends AvatarProps {
  addServer?: boolean;
  src?: string | null;
  alt?: string;
  name?: string;
  preview?: boolean;
}

function MyAvatar({ src, addServer, alt, name, preview, ...rest }: Props) {
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
            className="object-cover"
          />
        ) : null
      }
      {...rest}
    >
      {alt
        ? //
          alt
        : name
        ? name[0].toUpperCase()
        : null}
    </Avatar>
  );
}

export default MyAvatar;
