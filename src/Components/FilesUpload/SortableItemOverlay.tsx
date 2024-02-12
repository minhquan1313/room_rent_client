import { SortableItemProps } from "@/Components/FilesUpload/SortableItem";
import MyImage from "@/Components/MyImage";
import { Col } from "antd";
import classNames from "classnames";

type Props = Omit<SortableItemProps, "id" | "onRemove" | "isExternal">;

export function SortableItemOverlay({ src, aspect, avatar }: Props) {
  return (
    <Col span={24} className="cursor-grabbing">
      <MyImage
        className={classNames(
          "object-cover shadow-2xl",
          avatar ? "rounded-full" : "rounded-lg",
          aspect ?? "aspect-square",
        )}
        width={`100%`}
        src={src}
        preview={false}
        addServer
      />
    </Col>
  );
}
