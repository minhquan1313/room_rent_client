import NotFoundContent from "@/Components/NotFoundContent";
import useGoogleMapMarker from "@/hooks/useGoogleMapMarker";
import logger from "@/utils/logger";
import { Select, Spin, message } from "antd";
import { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface InputAddressGGMapProps {
  maps: typeof google.maps;
  onChange?: (value: google.maps.GeocoderResult | null) => void;
}

const timeout = 1000;

const InputAddressGGMap = memo(function InputAddressGGMap(props: InputAddressGGMapProps) {
  const {
    //
    maps,
    onChange,
  } = props;

  const { t } = useTranslation();
  const { getCoordsFromAddress } = useGoogleMapMarker({ maps });
  const [notifyApi, holder] = message.useMessage();

  const [selected, setSelected] = useState<string>();
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressesData, setAddressesData] = useState<google.maps.GeocoderResult[]>([]);

  const timeoutRef = useRef<number>();

  function onSearchHandle(v: string) {
    clearTimeout(timeoutRef.current);
    setChanged(true);

    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      if (!v) {
        setLoading(false);
        return;
      }

      getCoordsFromAddress(v, {
        region: "Vietnam",
      })
        .then((v) => {
          logger(`🚀 ~ file: InputAddressGGMap.tsx:35 ~ .then ~ v:`, v);

          setAddressesData(v);
        })
        .catch((error) => {
          if (error === "ZERO_RESULTS") {
            setAddressesData([]);
            selected !== undefined && onChangeHandle(undefined);
            return;
          }
          notifyApi.error(t("Add room page.Error getting address!"));
          logger.error(`~🤖 InputAddressGGMap 🤖~ error`, { error });
        })
        .finally(() => {
          setLoading(false);
        });
    }, timeout);
  }

  function onChangeHandle(value?: string) {
    logger(`🚀 ~ file: InputAddressGGMap.tsx:67 ~ onChangeHandle ~ value:`, value);

    setSelected(value);

    const selected = addressesData.find((v) => v.place_id === value);
    onChange?.(selected || null);
  }

  // useEffect(() => {}, []);

  return (
    <>
      {holder}

      <Select
        showSearch
        filterOption={false}
        value={selected}
        onChange={onChangeHandle}
        onSearch={onSearchHandle}
        placeholder={t("Add room page.Type address")}
        loading={loading}
        notFoundContent={
          changed ? (
            <Spin
              spinning={loading}
              style={{ height: "100%" }}
              // style={{ alignItems: "center" }}
              // description={t("State.Loading")}
            >
              {loading ? null : addressesData.length ? null : <NotFoundContent />}
            </Spin>
          ) : (
            t("Extra.Start typing to get suggestion...")
          )
        }
      >
        {!loading &&
          addressesData?.map((value) => (
            <Select.Option key={value.place_id} value={value.place_id}>
              {value.formatted_address}
            </Select.Option>
          ))}
      </Select>
    </>
  );
});

export default InputAddressGGMap;
