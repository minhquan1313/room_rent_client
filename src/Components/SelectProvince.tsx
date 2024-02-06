import NotFoundContent from "@/Components/NotFoundContent";
import { fetcher } from "@/services/fetcher";
import { Location3rd } from "@/types/Location3rd";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps } from "antd";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export interface SelectLocation extends SelectProps {
  code?: string | number;
  onSelect?: (value: Location3rd) => void;
}

export const SelectProvince = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    const { t } = useTranslation();
    const { t: tLoc } = useTranslation("location");

    const { data, isLoading } = useSWR<Location3rd[]>(
      `/location/provinces-all${code ? `?country=${code}` : ""}`,
      fetcher,
    );

    const dataSorted = useMemo(() => {
      if (!data) return undefined;

      return data
        .map((location) => ({
          ...location,
          nameTranslated: tLoc("translate", { val: location.name }),
        }))
        .sort((a, b) => {
          const sortInt = a.nameTranslated.localeCompare(b.nameTranslated);
          return sortInt;
        });
    }, [data, tLoc]);

    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder={t("Search page.Province")}
        onSelect={(_value, o) => {
          const obj: Location3rd = {
            name: String(o.value),
            code: o.key,
          };
          onSelect && onSelect(obj);
        }}
        loading={isLoading}
        {...rest}
      >
        {dataSorted &&
          dataSorted.map(({ code, name, nameTranslated }) => (
            <Select.Option value={name} key={code}>
              {nameTranslated}
            </Select.Option>
          ))}
      </Select>
    );
  },
);
export const SelectDistrict = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    const { t } = useTranslation();
    const { t: tLoc } = useTranslation("location");

    const { data, isLoading } = useSWR<Location3rd[]>(
      code ? `/location/districts-all?province=${code}` : undefined,
      fetcher,
    );

    const dataSorted = useMemo(() => {
      if (!data) return undefined;

      return data
        .map((location) => ({
          ...location,
          nameTranslated: tLoc("translate", { val: location.name }),
        }))
        .sort((a, b) => {
          const sortInt = a.nameTranslated.localeCompare(b.nameTranslated);
          return sortInt;
        });
    }, [data, tLoc]);

    // logger(`🚀 ~ data:`, data, isLoading);
    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder={t("Search page.District")}
        onSelect={(_value, o) => {
          const obj: Location3rd = {
            name: String(o.value),
            code: o.key,
          };
          onSelect && onSelect(obj);
        }}
        loading={isLoading}
        {...rest}
      >
        {dataSorted &&
          dataSorted.map(({ code, name, nameTranslated }) => (
            <Select.Option value={name} key={code}>
              {nameTranslated}
            </Select.Option>
          ))}
      </Select>
    );
  },
);
export const SelectWard = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    const { t } = useTranslation();
    const { t: tLoc } = useTranslation("location");

    const { data, isLoading } = useSWR<Location3rd[]>(
      code ? `/location/wards-all?district=${code}` : undefined,
      fetcher,
    );

    const dataSorted = useMemo(() => {
      if (!data) return undefined;

      return data
        .map((location) => ({
          ...location,
          nameTranslated: tLoc("translate", { val: location.name }),
        }))
        .sort((a, b) => {
          const sortInt = a.nameTranslated.localeCompare(b.nameTranslated);
          return sortInt;
        });
    }, [data, tLoc]);

    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder={t("Search page.Ward")}
        onSelect={(_value, o) => {
          const obj: Location3rd = {
            name: String(o.value),
            code: o.key,
          };
          onSelect && onSelect(obj);
        }}
        loading={isLoading}
        {...rest}
      >
        {dataSorted &&
          dataSorted.map(({ code, name, nameTranslated }) => (
            <Select.Option value={name} key={code}>
              {nameTranslated}
            </Select.Option>
          ))}
      </Select>
    );
  },
);
export const SelectCountry = memo(({ onSelect, ...rest }: SelectLocation) => {
  const { data, isLoading } = useSWR<Location3rd[]>(
    `/location/countries-all`,
    fetcher,
  );

  return (
    <Select
      filterOption={searchFilterTextHasLabel}
      notFoundContent={<NotFoundContent />}
      showSearch={true}
      placeholder="Quốc gia"
      onSelect={(_value, o) => {
        const obj: Location3rd = {
          name: String(o.value),
          code: o.key,
        };
        onSelect && onSelect(obj);
      }}
      loading={isLoading}
      {...rest}
    >
      {data &&
        data.map(({ code, name }) => (
          <Select.Option value={name} key={code} label={name}>
            {name}
          </Select.Option>
        ))}
    </Select>
  );
});
