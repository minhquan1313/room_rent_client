import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import fileImg from "@/assets/file.svg";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Col, Image, Row, Space, Upload, message } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { arrayMoveImmutable } from "array-move";
import classNames from "classnames";
import {
  ForwardRefRenderFunction,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

type FileAcceptType =
  | "image/*"
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/svg+xml"
  | "audio/*"
  | "audio/mpeg"
  | "audio/wav"
  | "audio/ogg"
  | "video/*"
  | "video/mp4"
  | "video/webm"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.ms-excel"
  | "application/vnd.ms-powerpoint"
  | ".jpg"
  | ".jpeg"
  | ".png"
  | ".txt"
  | "*/*"; // Wildcard for all file types

interface Props extends UploadProps {
  //
  beforeUpload?: never;
  fileList?: never;
  multiple?: never;
  accept?: FileAcceptType;
}
export interface MyFile {
  src: string;
  id: string;
  file: File;
}

// eslint-disable-next-line react-refresh/only-export-components
const FilesUpload: ForwardRefRenderFunction<File[] | undefined, Props> = (
  p,
  ref,
) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [files, setFiles] = useState<MyFile[]>();
  const [activeFile, setActiveFile] = useState<MyFile>();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 0,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 0,
      },
    }),
    // useSensor(KeyboardSensor),
  );

  const beforeUpload = (file: RcFile) => {
    const accept = !p.accept
      ? ""
      : p.accept.includes("*")
      ? p.accept.slice(0, -1)
      : p.accept;

    if (!file.type.includes(accept)) {
      console.log(`yes`);

      messageApi.open({
        type: "error",
        content: "Kiểu file không hỗ trợ",
      });
      return;
    }

    setFiles((files) => {
      const duplicate = files?.find(
        ({ file: { name, size } }) => file.name === name && file.size === size,
      );
      if (duplicate) return files;

      const url = file.type.includes("image")
        ? URL.createObjectURL(file)
        : fileImg;

      const f: MyFile = {
        src: url,
        id: file.uid,
        file,
      };

      return files ? [...files, f] : [f];
    });

    return false;
  };

  const removeImage = useCallback<SortableItemProps["onRemove"]>((id) => {
    setFiles((files) => files?.filter((r) => r.id !== id));
  }, []);

  useImperativeHandle(ref, () => files?.map((r) => r.file), [files]);

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      {contextHolder}
      {files && (
        <Image.PreviewGroup>
          <Row
            gutter={12}
            wrap={false}
            className="relative overflow-x-auto overflow-y-visible"
          >
            <DndContext
              onDragStart={({ active }) => {
                setActiveFile(files.find((f) => f.id === active.id));
              }}
              onDragEnd={({ active, over }) => {
                if (!over) return;

                const newIndex = files.findIndex((f) => f.id === over.id);
                const oldIndex = files.findIndex((f) => f.id === active.id);
                const newArray = arrayMoveImmutable(files, oldIndex, newIndex);

                setFiles(newArray);
                setActiveFile(undefined);
              }}
              modifiers={[
                // restrictToHorizontalAxis,
                restrictToWindowEdges,
                // restrictToParentElement,
                // restrictToFirstScrollableAncestor,
                // snapCenterToCursor,
              ]}
              sensors={sensors}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={files}
                strategy={horizontalListSortingStrategy}
              >
                {files.map(({ src, id }) => (
                  <SortableItem
                    key={src}
                    src={src}
                    id={id}
                    onRemove={removeImage}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeFile && <SortableItemOverlay src={activeFile.src} />}
              </DragOverlay>
            </DndContext>
          </Row>
        </Image.PreviewGroup>
      )}

      <Upload.Dragger
        {...p}
        // accept=""
        fileList={[]}
        beforeUpload={beforeUpload}
        multiple
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload.Dragger>
    </Space>
  );
};

type SortableItemProps = {
  src: string;
  id: string;
  // active?: boolean;
  onRemove(id: string): void;
};
const SortableItem = ({ src, id, onRemove }: SortableItemProps) => {
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
      span={6}
      className={classNames("select-none overflow-visible", {
        "transition-all duration-300": isSorting || isDragging,
        // "opacity-75 grayscale": isSorting && !isDragging,
        "z-10 opacity-50 grayscale": isDragging,
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
            "aspect-square select-none rounded-lg object-cover",
          )}
          width={`100%`}
          src={src}
          preview={!isDragging && !isSorting}
          // rootClassName={}
        />
        <div className="absolute right-0 top-0">
          <MyButton
            onClick={() => onRemove && onRemove(id)}
            className="rounded-br-none rounded-tl-none"
            icon={<DeleteOutlined />}
            type="primary"
            shape="default"
            danger
          />
        </div>
      </div>
    </Col>
  );
};
function SortableItemOverlay({
  src,
}: Omit<SortableItemProps, "id" | "onRemove">) {
  return (
    <Col span={24} className="cursor-grabbing">
      <Image
        className="aspect-square rounded-lg object-cover shadow-2xl"
        width={`100%`}
        src={src}
        preview={false}
      />
    </Col>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(forwardRef(FilesUpload));
