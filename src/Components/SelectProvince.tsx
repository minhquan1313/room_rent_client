import NotFoundContent from "@/Components/NotFoundContent";
import { fetcher } from "@/services/fetcher";
import { Location3rd } from "@/types/Location3rd";
import { searchFilterTextHasLabel } from "@/utils/searchFilterTextHasLabel";
import { Select, SelectProps } from "antd";
import { memo } from "react";
import useSWR from "swr";

export interface SelectLocation extends SelectProps {
  code?: string | number;
  onSelect?: (value: Location3rd) => void;
}

export const SelectProvince = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    // logger(`🚀 ~ SelectProvince ~ code:`, code);

    const { data, isLoading } = useSWR<Location3rd[]>(
      `/location/provinces-all${code ? `?country=${code}` : ""}`,
      fetcher,
    );

    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder="Tỉnh/Thành phố"
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
  },
);
export const SelectDistrict = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    const { data, isLoading } = useSWR<Location3rd[]>(
      code ? `/location/districts-all?province=${code}` : undefined,
      fetcher,
    );

    // logger(`🚀 ~ data:`, data, isLoading);
    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder="Quận/Huyện"
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
  },
);
export const SelectWard = memo(
  ({ code, onSelect, ...rest }: SelectLocation) => {
    const { data, isLoading } = useSWR<Location3rd[]>(
      code ? `/location/wards-all?district=${code}` : undefined,
      fetcher,
    );

    return (
      <Select
        filterOption={searchFilterTextHasLabel}
        notFoundContent={<NotFoundContent />}
        showSearch={true}
        placeholder="Xã/Phường"
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
