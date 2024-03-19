import FilesUpload, { ImagesUploadRef } from "@/Components/FilesUpload/ImagesUpload";
import LocationFormInputs from "@/Components/LocationFormInputs";
import SelectCurrency from "@/Components/SelectCurrency";
import SelectMeasure from "@/Components/SelectMeasure";
import SelectRoomType from "@/Components/SelectRoomType";
import SelectService from "@/Components/SelectService";
import { GlobalDataContext } from "@/Contexts/GlobalDataProvider";
import { UserContext } from "@/Contexts/UserProvider";
import { isRoleAdmin } from "@/constants/roleType";
import { noEmptyRule } from "@/rules/noEmptyRule";
import { IRoom, RoomPayload } from "@/types/IRoom";
import { moneyParser, numberFormat, numberParser } from "@/utils/numberFormat";
import { Form, Input, InputNumber, SelectProps, Skeleton, Space, Switch } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

type TField = RoomPayload;
interface Props extends SelectProps {
  room?: IRoom;
  files: React.RefObject<ImagesUploadRef>;
  // location: React.RefObject<TField["location"]>;

  //   onChange?: (value: string[]) => void;
}

const maxRoom = 1000;
const minRoom = 0;
const minPrice = 1000;

const RoomFormAddEdit = ({ room, files }: Props) => {
  const { t } = useTranslation();
  const { t: tApi } = useTranslation("api");

  const { user } = useContext(UserContext);
  const { roomServicesConverted, roomTypes } = useContext(GlobalDataContext);

  if (!user) return <>Please sign in</>;

  return (
    <>
      <Space wrap>
        <Form.Item<TField> name={"is_visible"} valuePropName="checked" label={tApi("data code.room.is_visible")}>
          <Switch />
        </Form.Item>

        {isRoleAdmin(user.role?.title) && (
          <>
            <Form.Item<TField>
              name={"disabled"}
              valuePropName="checked"
              label={tApi("data code.room.disabled")}
              tooltip={t("Add room page.Only admin have permission to change this!")}
            >
              <Switch />
            </Form.Item>

            <Form.Item<IRoom>
              name={"verified"}
              valuePropName="checked"
              label={tApi("data code.room.verified")}
              tooltip={t("Add room page.Only admin have permission to change this!")}
            >
              <Switch />
            </Form.Item>

            <Form.Item<IRoom>
              name={"verified_real"}
              valuePropName="checked"
              label={tApi("data code.room.verified_real")}
              tooltip={t("Add room page.Only admin have permission to change this!")}
            >
              <Switch />
            </Form.Item>
          </>
        )}
      </Space>

      <Form.Item<TField>
        label={t("Search page.Owner ID")}
        name="owner"
        hidden={!isRoleAdmin(user?.role?.title)}
        tooltip={t("Add room page.Only admin have permission to change this!")}
      >
        <Input />
      </Form.Item>

      <Form.Item<TField> rules={[noEmptyRule()]} label={t("Search page.Room name")} name="name">
        <Input maxLength={50} showCount />
      </Form.Item>

      <Form.Item<TField> rules={[noEmptyRule()]} label={t("Room detail.Room type")} name="room_type">
        {!roomTypes ? <Skeleton.Input active block /> : <SelectRoomType />}
      </Form.Item>

      <Form.Item<TField> label={t("home page.Room service")} name="services">
        {!roomServicesConverted ? <Skeleton.Input active block /> : <SelectService />}
      </Form.Item>

      <Form.Item<TField> label={t("Room detail.Basic information")} name="sub_name">
        <Input maxLength={120} showCount />
      </Form.Item>

      <Form.Item<TField> label={t("Room detail.Detail information")} name="description">
        <Input.TextArea maxLength={5000} showCount autoSize />
      </Form.Item>

      <Form.Item<TField> label={t("Search page.Room images")} tooltip={t("Search page.Room image tooltip")}>
        <FilesUpload ref={files} accept="image/*" initImages={room?.images} />
      </Form.Item>

      <Form.Item<TField> rules={[noEmptyRule()]} label={t("Search page.Cost per month")} name="price_per_month">
        <InputNumber
          addonAfter={
            <Form.Item<TField> name="price_currency_code" noStyle>
              <SelectCurrency />
            </Form.Item>
          }
          step={1000}
          formatter={numberFormat}
          min={minPrice}
          parser={moneyParser}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<TField> rules={[noEmptyRule()]} label={t("Search page.Usable area")} name="usable_area">
        <InputNumber
          addonAfter={
            <Form.Item<TField> name="usable_area_unit" noStyle>
              {<SelectMeasure />}
            </Form.Item>
          }
          formatter={numberFormat}
          parser={numberParser}
          className="w-full"
        />
      </Form.Item>

      <Form.Item<TField> label={t("Search page.Number of living rooms")} name="number_of_living_room">
        <InputNumber formatter={numberFormat} parser={numberParser} min={minRoom} max={maxRoom} className="w-full" />
      </Form.Item>

      <Form.Item<TField> label={t("Search page.Number of bedrooms")} name="number_of_bedroom">
        <InputNumber formatter={numberFormat} parser={numberParser} min={minRoom} max={maxRoom} className="w-full" />
      </Form.Item>

      <Form.Item<TField> label={t("Search page.Number of bathrooms")} name="number_of_bathroom">
        <InputNumber formatter={numberFormat} parser={numberParser} min={minRoom} max={maxRoom} className="w-full" />
      </Form.Item>

      <Form.Item<TField> label={t("Search page.Number of floors")} name="number_of_floor" tooltip={t("Search page.Ground floor not included")}>
        <InputNumber formatter={numberFormat} parser={numberParser} min={minRoom} max={maxRoom} className="w-full" />
      </Form.Item>

      <Form.Item<TField> noStyle>
        <LocationFormInputs />
      </Form.Item>
    </>
  );
};

export default RoomFormAddEdit;
