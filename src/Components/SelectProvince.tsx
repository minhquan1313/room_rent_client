import NotFoundContent from "@/Components/NotFoundContent";
import { fetcher } from "@/services/fetcher";
import { Location3rd } from "@/types/Location3rd";
import logger from "@/utils/logger";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps } from "antd";
import { memo, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export interface SelectLocation extends SelectProps {
  code?: string | number;
  onCodeChange?: (value: string) => void;

  onSelect?: (value: Location3rd) => void;

  value?: string;
  onChange?: (value: string) => void;
}

export const SelectProvince = memo(({ code, onCodeChange, onChange, onSelect, ...rest }: SelectLocation) => {
  const { t } = useTranslation();
  const { t: tLoc } = useTranslation("location");

  const { data, isLoading } = useSWR<Location3rd[]>(`/location/provinces-all${code ? `?country=${code}` : ""}`, fetcher);

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

        logger(`~🤖 SelectProvince 🤖~ `, { obj });

        onSelect?.(obj);
      }}
      onChange={(name, options) => {
        onChange?.(name);

        if (Array.isArray(options)) return;

        // const obj: Location3rd = {
        //   code: options.key,
        //   name,
        // };

        onCodeChange?.(options.key);
      }}
      loading={isLoading}
      {...rest}
    >
      {dataSorted &&
        dataSorted.map(({ code, name, nameTranslated }) => (
          <Select.Option key={code} value={name} label={nameTranslated}>
            {nameTranslated}
          </Select.Option>
        ))}
    </Select>
  );
});
export const SelectDistrict = memo(({ code, onCodeChange, onChange, onSelect, ...rest }: SelectLocation) => {
  const { t } = useTranslation();
  const { t: tLoc } = useTranslation("location");

  const { data, isLoading } = useSWR<Location3rd[]>(code ? `/location/districts-all?province=${code}` : undefined, fetcher);

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
      onChange={(name, options) => {
        onChange?.(name);

        if (Array.isArray(options)) return;

        // const obj: Location3rd = {
        //   code: options.key,
        //   name,
        // };

        onCodeChange?.(options.key);
      }}
      loading={isLoading}
      {...rest}
    >
      {dataSorted &&
        dataSorted.map(({ code, name, nameTranslated }) => (
          <Select.Option key={code} value={name} label={nameTranslated}>
            {nameTranslated}
          </Select.Option>
        ))}
    </Select>
  );
});
export const SelectWard = memo(({ code, onCodeChange, onChange, onSelect, ...rest }: SelectLocation) => {
  const { t } = useTranslation();
  const { t: tLoc } = useTranslation("location");

  const { data, isLoading } = useSWR<Location3rd[]>(code ? `/location/wards-all?district=${code}` : undefined, fetcher);

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
      onChange={(name, options) => {
        onChange?.(name);

        if (Array.isArray(options)) return;

        // const obj: Location3rd = {
        //   code: options.key,
        //   name,
        // };

        onCodeChange?.(options.key);
      }}
      loading={isLoading}
      {...rest}
    >
      {dataSorted &&
        dataSorted.map(({ code, name, nameTranslated }) => (
          <Select.Option key={code} value={name} label={nameTranslated}>
            {nameTranslated}
          </Select.Option>
        ))}
    </Select>
  );
});

export const SelectCountry = memo(({ onCodeChange, onChange, onSelect, ...rest }: SelectLocation) => {
  const { t: tLoc } = useTranslation("location");

  const { data, isLoading } = useSWR<Location3rd[]>(`/location/countries-all`, fetcher);
  const selected = useRef(false);

  const dataSorted = useMemo(() => {
    if (!data) return undefined;

    return data
      .map((location) => ({
        ...location,
        nameTranslated: tLoc(`country.${location.name}` as any),
      }))
      .sort((a, b) => {
        const sortInt = a.nameTranslated.localeCompare(b.nameTranslated);
        return sortInt;
      });
  }, [data, tLoc]);

  const onChangeHandle: SelectProps["onChange"] = (name, options) => {
    onChange?.(name);

    if (Array.isArray(options)) return;

    // const obj: Location3rd = {
    //   code: options.key,
    //   name,
    // };
    onCodeChange?.(options.key);
  };

  useEffect(() => {
    // auto select
    if (!data || selected.current) return;

    const { name, code } = data[0];

    onChangeHandle(name, { key: code, label: "" });
    // onChange?.(data[0].name);
    selected.current = true;
  }, [data]);

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
      onChange={onChangeHandle}
      loading={isLoading}
      {...rest}
    >
      {dataSorted &&
        dataSorted.map(({ code, name, nameTranslated }) => (
          <Select.Option key={code} value={name} label={nameTranslated}>
            {nameTranslated}
          </Select.Option>
        ))}
    </Select>
  );
});
