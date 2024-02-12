import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import { DeleteOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Col } from "antd";
import classNames from "classnames";
import { memo } from "react";

export type SortableItemProps = {
  src: string;
  id: string;
  isExternal: boolean;
  deleted?: boolean;
  spanFull?: boolean;
  aspect?: string;
  avatar?: boolean;
  onRemove(id: string, isExternal: boolean): void;
};

export const SortableItem = memo(
  ({
    src,
    id,
    isExternal,
    deleted,
    spanFull,
    aspect,
    avatar,
    onRemove,
  }: SortableItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      // transition,
      isDragging,
      isSorting,
    } = useSortable({ id: id });

    const style = {
      transform: CSS.Transform.toString(transform),
      // transition,
    };

    return (
      <Col
        xs={24}
        sm={spanFull ? 24 : 12}
        md={spanFull ? 24 : 8}
        xl={spanFull ? 24 : 6}
        className={classNames("select-none overflow-visible", {
          "transition-all duration-300": isSorting || isDragging,
          // "opacity-75 grayscale": isSorting && !isDragging,
          "z-10 opacity-50 grayscale": isDragging,
          "opacity-50": deleted,
          // "z-10 scale-125 blur-xl": isDragging || active,
        })}
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <div className="relative">
          <MyImage
            className={classNames(
              "select-none object-cover",
              avatar ? "rounded-full" : "rounded-lg",
              aspect ?? "aspect-square",
              {
                "border-2 border-solid border-pink-400": isExternal,
              },
            )}
            width={`100%`}
            src={src}
            preview={!isDragging && !isSorting}
            addServer
          />
          <div className="absolute right-0 top-0">
            <MyButton
              onClick={() => onRemove && onRemove(id, isExternal)}
              className={classNames({
                "bg-pink-400": isExternal,
                "rounded-br-none rounded-tl-none": !avatar,
              })}
              icon={<DeleteOutlined />}
              type="primary"
              shape="default"
            />
          </div>
        </div>
      </Col>
    );
  },
);
