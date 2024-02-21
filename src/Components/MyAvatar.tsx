import MyImage from "@/Components/MyImage";
import { Avatar, AvatarProps } from "antd";
import { memo } from "react";

export interface MyAvatarProps extends AvatarProps {
  addServer?: boolean;
  src?: string | null;
  name?: string;
  preview?: boolean;
}

const MyAvatar = memo(function MyAvatar(props: MyAvatarProps) {
  const {
    //
    src,
    addServer,
    name,
    preview,
    children,
    ..._props
  } = props;

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
      {..._props}
    >
      {name ? name[0].toUpperCase() : children}
    </Avatar>
  );
});

export default MyAvatar;
