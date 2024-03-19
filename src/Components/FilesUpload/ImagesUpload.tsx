import fileImg from "@/assets/file.svg";
import { IRoomImage } from "@/types/IRoomImage";
import logger from "@/utils/logger";
import { PlusOutlined } from "@ant-design/icons";
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
} from "@dnd-kit/sortable";
import { Image, Row, Space, Upload, message } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { arrayMoveImmutable } from "array-move";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { SortableItem, SortableItemProps } from "./SortableItem";
import { SortableItemOverlay } from "./SortableItemOverlay";

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

export interface MyFile {
  src: string;
  id: string;
  file?: File;
  deleted?: boolean;
}

export interface ImagesUploadProps
  extends Omit<UploadProps, "beforeUpload" | "fileList"> {
  imageAspect?: `aspect-${"auto" | "square" | "video" | string}`;
  avatar?: boolean;
  accept?: FileAcceptType;
  initImages?: IRoomImage[];
}

export interface ImagesUploadRef {
  files: File[];
  keeps: string[];
  order: number[];
}

const ImagesUpload = memo(
  forwardRef<ImagesUploadRef, ImagesUploadProps>(
    function ImagesUpload(props, ref) {
      const {
        //
        accept,
        initImages,
        avatar,
        imageAspect,
        ..._props
      } = props;

      const { t } = useTranslation();

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
          logger(`yes`);

          messageApi.open({
            type: "error",
            content: t("Extra.Not supported file type"),
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

          if (_props.multiple === false) {
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
          const result: ImagesUploadRef = {
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

          return result;
        },
        [files],
      );

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
                    const newArray = arrayMoveImmutable(
                      files,
                      oldIndex,
                      newIndex,
                    );

                    setFiles(newArray);
                    setActiveFile(undefined);
                  }}
                  modifiers={[restrictToWindowEdges]}
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
                        aspect={imageAspect}
                        avatar={avatar}
                        spanFull={_props.multiple === false}
                        onRemove={removeImage}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay>
                    {activeFile && (
                      <SortableItemOverlay
                        src={activeFile.src}
                        avatar={avatar}
                        aspect={imageAspect}
                      />
                    )}
                  </DragOverlay>
                </DndContext>
              </Row>
            </Image.PreviewGroup>
          )}

          <Upload.Dragger
            fileList={[]}
            beforeUpload={beforeUpload}
            multiple
            {..._props}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t("Extra.Drop file here")}</div>
            </div>
          </Upload.Dragger>
        </Space>
      );
    },
  ),
);

export default ImagesUpload;

// const ImagesUpload: ForwardRefRenderFunction<ImagesUploadRef, Props> = (
//   { accept, initImages, avatar, ...p },
//   ref,
// ) => {

// };

// // eslint-disable-next-line react-refresh/only-export-components
// export default memo(forwardRef(ImagesUpload));
