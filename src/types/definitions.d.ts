/// <reference types="vite-plugin-svgr/client" />

declare module "currency-symbol-map/map" {
  const currencyToSymbolMap: {
    [CurrencyKey: string]: string;
  };

  export default currencyToSymbolMap;
}

// This shit just to disable the error
declare module "react-flickity-component" {
  const Flickity: FC = () => JSX.Element;

  export default Flickity;
}
