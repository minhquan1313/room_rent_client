import MyButton from "@/Components/MyButton";
import MyImage from "@/Components/MyImage";
import fileImg from "@/assets/file.svg";
import { IRoomImage } from "@/types/IRoomImage";
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
  beforeUpload?: never;
  fileList?: never;
  // multiple?: never;

  imageAspect?: `aspect-${"auto" | "square" | "video" | string}`;
  avatar?: boolean;
  accept?: FileAcceptType;
  initImages?: IRoomImage[];
}
export interface MyFile {
  src: string;
  id: string;
  file?: File;
  deleted?: boolean;
}
export type FilesUploadRef = {
  files: File[];
  keeps: string[];
  order: number[];
};

// eslint-disable-next-line react-refresh/only-export-components
const FilesUpload: ForwardRefRenderFunction<FilesUploadRef, Props> = (
  { accept, initImages, avatar, ...p },
  ref,
) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [files, setFiles] = useState<MyFile[]>(
    initImages
      ? initImages.map((e) => ({
          src: e.image,
          id: e._id,
          deleted: false,
        }))
      : [],
  );

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
    const accept_ = !accept
      ? ""
      : accept.includes("*")
      ? accept.slice(0, -1)
      : accept;

    if (!file.type.includes(accept_)) {
      console.log(`yes`);

      messageApi.open({
        type: "error",
        content: "Kiểu file không hỗ trợ",
      });
      return;
    }

    setFiles((files) => {
      const duplicate = files?.find(
        ({ file: x }) => x && file.name === x.name && file.size === x.size,
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

      if (p.multiple === false) {
        if (files.length !== 0) return [f];
      }

      return files ? [...files, f] : [f];
    });

    return false;
  };

  const removeImage = useCallback<SortableItemProps["onRemove"]>(
    (id, isExternal) => {
      setFiles((files) => {
        if (isExternal) {
          const f = files.find((r) => r.id === id)!;
          f.deleted = !f.deleted;

          return [...files];
        }

        return files?.filter((r) => r.id !== id);
      });
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => {
      const result: FilesUploadRef = {
        files: [],
        order: [],
        keeps: [],
      };

      const orderF: number[] = [];
      const orderK: number[] = [];
      files
        .filter((f) => !f.deleted)
        .forEach((f, i) => {
          if (!f.file) {
            if (!f.deleted) {
              result.keeps.push(f.id);

              orderK.push(i + 1);
              return;
            }
          } else {
            result.files.push(f.file);

            orderF.push(i + 1);
            return;
          }
        });
      result.order = [...orderK, ...orderF];

      // const rest = files.filter((f) => !f.deleted);

      // result.keeps = rest.filter((e) => !e.file).map((e) => e.id);

      // // result.order = Array(result.keeps.length).map((r, i) => i);

      // result.files = rest
      //   .map((r) => r.file)
      //   .filter((e) => e !== undefined) as File[];

      // result.order = rest.map((_e, i) => i + 1);

      return result;
    },
    [files],
  );

  // useEffect(() => {
  //   if (!initSrc) return;
  //   initSrc.forEach((url) => {
  //     setFiles((files) => {
  //       const f: MyFile = {
  //         src: url,
  //         id: url,
  //         file,
  //       };

  //       return files ? [...files, f] : [f];
  //     });
  //   });
  // }, []);

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
                {files.map(({ src, id, file, deleted }) => (
                  <SortableItem
                    key={src}
                    src={src}
                    id={id}
                    deleted={deleted}
                    isExternal={!file}
                    aspect={p.imageAspect}
                    avatar={avatar}
                    spanFull={p.multiple === false}
                    onRemove={removeImage}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeFile && (
                  <SortableItemOverlay
                    src={activeFile.src}
                    avatar={avatar}
                    aspect={p.imageAspect}
                  />
                )}
              </DragOverlay>
            </DndContext>
          </Row>
        </Image.PreviewGroup>
      )}

      <Upload.Dragger fileList={[]} beforeUpload={beforeUpload} multiple {...p}>
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Thả file vô đây</div>
        </div>
      </Upload.Dragger>
    </Space>
  );
};

type SortableItemProps = {
  src: string;
  id: string;
  isExternal: boolean;
  deleted?: boolean;
  spanFull?: boolean;
  aspect?: string;
  avatar?: boolean;
  onRemove(id: string, isExternal: boolean): void;
};
const SortableItem = ({
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
            // danger
          />
        </div>
      </div>
    </Col>
  );
};
function SortableItemOverlay({
  src,
  aspect,
  avatar,
}: Omit<SortableItemProps, "id" | "onRemove" | "isExternal">) {
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

// eslint-disable-next-line react-refresh/only-export-components
export default memo(forwardRef(FilesUpload));
