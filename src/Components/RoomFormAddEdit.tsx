import FilesUpload, {
  FilesUploadRef,
} from "@/Components/FilesUpload/FilesUpload";
import LocationFormInputs from "@/Components/LocationFormInputs copy";
import SelectCurrency from "@/Components/SelectCurrency";
import SelectMeasure from "@/Components/SelectMeasure";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { IRoom, RoomLocationPayload, RoomPayload } from "@/types/IRoom";
import { numberFormat } from "@/utils/numberFormat";
import { Form, Input, InputNumber, SelectProps, Skeleton } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

interface Props extends SelectProps {
  room?: IRoom;
  files: React.RefObject<FilesUploadRef>;
  location: React.RefObject<RoomLocationPayload>;

  //   onChange?: (value: string[]) => void;
}

const RoomFormAddEdit = ({ room, files, location }: Props) => {
  const { t } = useTranslation();

  const { user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  if (!user) return <>Please sign in</>;

  return (
    <>
      <Form.Item<RoomPayload> noStyle name={"location"}>
        <LocationFormInputs location={room?.location} ref={location} />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Owner ID")}
        name="owner"
        hidden={!isRoleAdmin(user?.role?.title)}
      >
        <Input />
      </Form.Item>

      <Form.Item<RoomPayload>
        rules={[noEmptyRule]}
        label={t("Search page.Room name")}
        name="name"
      >
        <Input maxLength={50} showCount />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Room detail.Basic information")}
        name="sub_name"
      >
        <Input maxLength={50} showCount />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Room detail.Detail information")}
        name="description"
      >
        <Input.TextArea maxLength={1000} showCount autoSize />
      </Form.Item>

      <Form.Item<RoomPayload>
        rules={[noEmptyRule]}
        label={t("Room detail.Room type")}
        name="room_type"
      >
        {!roomTypes ? <Skeleton.Input active block /> : <SelectRoomType />}
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("home page.Room service")}
        name="services"
      >
        {!roomServicesConverted ? (
          <Skeleton.Input active block />
        ) : (
          <SelectService />
        )}
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Room images")}
        tooltip={t("Search page.Room image tooltip")}
      >
        <FilesUpload ref={files} accept="image/*" initImages={room?.images} />
      </Form.Item>

      <Form.Item<RoomPayload>
        rules={[noEmptyRule]}
        label={t("Search page.Cost per month")}
        name="price_per_month"
      >
        <InputNumber
          addonAfter={
            <Form.Item<RoomPayload> name="price_currency_code" noStyle>
              <SelectCurrency />
            </Form.Item>
          }
          formatter={numberFormat}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<RoomPayload>
        rules={[noEmptyRule]}
        label={t("Search page.Usable area")}
        name="usable_area"
      >
        <InputNumber
          addonAfter={
            <Form.Item<RoomPayload> name="usable_area_unit" noStyle>
              {<SelectMeasure />}
            </Form.Item>
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Number of living rooms")}
        name="number_of_living_room"
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Number of bedrooms")}
        name="number_of_bedroom"
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Number of bathrooms")}
        name="number_of_bathroom"
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<RoomPayload>
        label={t("Search page.Number of floors")}
        name="number_of_floor"
      >
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          className="w-full"
        />
      </Form.Item>

      {/* <Form.Item<RoomPayload> noStyle name={"location"}>
        <LocationFormInputs location={room?.location} ref={location} />
      </Form.Item> */}
    </>
  );
};

export default RoomFormAddEdit;
