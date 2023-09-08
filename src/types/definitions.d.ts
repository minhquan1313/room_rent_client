/// <reference types="vite-plugin-svgr/client" />

declare module "currency-symbol-map/map" {
  const currencyToSymbolMap: {
    [CurrencyKey: string]: string;
  };

  export default currencyToSymbolMap;
}
