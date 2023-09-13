import fileImg from "@/assets/file.svg";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Col, Image, Row, Space, Upload } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { arrayMoveImmutable } from "array-move";
import classNames from "classnames";
import {
  ForwardRefRenderFunction,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from "react";

interface Props extends UploadProps {
  //
  beforeUpload?: never;
  fileList?: never;
  multiple?: never;
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

  useImperativeHandle(ref, () => files?.map((r) => r.file), [files]);

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
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
                {files.map(({ src, id }, i) => (
                  <SortableItem key={src} src={src} id={id} active={i == 1} />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeFile && <SortableItemOverlay src={activeFile.src} />}
              </DragOverlay>
            </DndContext>
          </Row>
        </Image.PreviewGroup>
      )}

      <Upload.Dragger {...p} fileList={[]} beforeUpload={beforeUpload} multiple>
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload.Dragger>
    </Space>
  );
};

type T = {
  src: string;
  id: string;
  active?: boolean;
};
function SortableItem({ src, id, active }: T) {
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
      <Image
        className={classNames(
          "aspect-square select-none rounded-lg object-cover",
        )}
        // rootClassName={}
        width={`100%`}
        src={src}
        previewPrefixCls=""
        preview={!isDragging && !isSorting}
      />
    </Col>
  );
}
function SortableItemOverlay({ src }: Omit<T, "id">) {
  return (
    <Col span={24} className="z-10 cursor-grabbing">
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
