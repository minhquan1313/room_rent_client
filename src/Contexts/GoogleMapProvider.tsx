import { proximityThreshold } from "@/constants";
import { calculateDistance } from "@/utils/calculateDistance";
import { Coords } from "google-map-react";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
};

interface IContext {
  loadMapTo: (detail: {
    ref: HTMLElement;
    coords?: Coords | null | undefined;
    extra?:
      | {
          autocomplete?:
            | {
                ref: HTMLInputElement;
                onChange(places: google.maps.places.PlaceResult): void;
              }
            | undefined;
        }
      | undefined;
  }) => Promise<{
    map: google.maps.Map;
    // place,
    autocomplete: google.maps.places.Autocomplete | undefined;
  }>;
  addMarker: (
    map: google.maps.Map,
    position: Coords | google.maps.LatLng,
  ) => google.maps.Marker | undefined;
  getAddressFromMarker: (
    latLng: Coords,
  ) => Promise<google.maps.GeocoderResult | null>;
  getCoordsFromAddress: (address: string) => Promise<google.maps.LatLng | null>;
  clearMarker: (marker: google.maps.Marker) => Promise<void>;
  getCoordsCloseTo: (d: { target: Coords; items: Coords[] }) => Coords[];
  placeSearch: (
    input: string,
    place: google.maps.places.PlacesService,
    map: google.maps.Map,
  ) => Promise<any>;
}

export const GoogleMapContext = createContext<IContext>(null as never);
export default function GoogleMapProvider({ children }: Props) {
  const appended = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  // const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  function getAddressFromMarker(latLng: Coords) {
    return new Promise<google.maps.GeocoderResult | null>((r, rj) => {
      if (!geocoder) return r(null);

      geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === "OK") {
          if (results && results[0]) {
            console.log(`🚀 ~ results:`, results);

            const res = results.sort(
              (a, b) =>
                b.address_components.length - a.address_components.length,
            )[0];
            console.log(`🚀 ~ res:`, res);

            const address = res.formatted_address;
            console.log(`🚀 ~ address:`, address);

            return r(res);
          } else {
            console.log("Không tìm thấy địa chỉ");
            return r(null);
          }
        }

        console.log("Lỗi khi lấy địa chỉ: " + status);
        return rj(status);
      });
    });
  }
  function getCoordsFromAddress(address: string) {
    return new Promise<google.maps.LatLng | null>((r, rj) => {
      if (!geocoder) return r(null);

      console.log(`🚀 ~ getCoordsFromAddress ~ address:`, address);
      geocoder.geocode({ address: address }, function (results, status) {
        console.log(`🚀 ~ status:`, status);
        if (status === "OK") {
          if (results && results[0]) {
            const location = results[0].geometry.location;
            console.log(`🚀 ~ results:`, results);
            console.log(`🚀 ~ location:`, location);

            // const latitude = location.lat();
            // const longitude = location.lng();

            // Hiển thị kết quả
            return r(location);
          } else {
            return r(null);
          }
        }

        console.log(`Có lỗi khi lấy thông tin '${address}'`);

        return rj(status);
      });
    });
  }

  async function loadMapTo(detail: {
    ref: HTMLElement;
    coords?: Coords | null;
    extra?: {
      autocomplete?: {
        ref: HTMLInputElement;
        onChange(places: google.maps.places.PlaceResult): void;
      };
    };
  }) {
    console.log(`calling`);

    if (!isReady) await waitForMapToBeLoaded();
    console.log(`calling ok`);

    const { coords, ref, extra } = detail;

    const mapOptions: google.maps.MapOptions = {
      zoom: 10,
      center: coords || {
        lat: 10.79626,
        lng: 106.6393655,
      },
      disableDefaultUI: true,

      clickableIcons: false,

      scrollwheel: true,
      // mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    const map = new google.maps.Map(ref, mapOptions);
    // const place = new google.maps.places.PlacesService(map);
    let autocomplete_: google.maps.places.Autocomplete | undefined;

    if (extra) {
      const { autocomplete: autocompleteEx } = extra;
      if (autocompleteEx) {
        const { ref, onChange } = autocompleteEx;

        const autocomplete = new google.maps.places.Autocomplete(ref, {
          types: ["geocode"], // Specify the type of place data to retrieve
          fields: ["address_components", "formatted_address", "geometry"], // Requested fields
        });
        autocomplete_ = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          place.address_components;
          console.log(
            `🚀 ~ autocomplete.addListener ~ place.address_components:`,
            place.address_components,
          );

          place.geometry;
          console.log(
            `🚀 ~ autocomplete.addListener ~ place.geometry:`,
            place.geometry,
          );

          onChange(place);
          // if (!place.geometry) {
          //   console.error("No details available for input: " + place.name);
          //   return;
          // }

          // Handle the selected place (e.g., display its details on the map)
          // console.log(
          //   "Selected Place:",
          //   place.formatted_address,
          //   place.geometry.location,
          // );
        });
      }
    }
    return {
      map,
      // place,
      autocomplete: autocomplete_,
    };
  }

  async function placeSearch(
    input: string,
    place: google.maps.places.PlacesService,
    map: google.maps.Map,
  ) {
    return new Promise<any | null>((r, rj) => {
      const request = {
        location: map.getCenter(), // Use the map's center as the search location
        radius: 1000, // Search radius in meters
        query: input, // Your search query
      };

      place.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (results && results[0]) {
            console.log(`🚀 ~ place.textSearch ~ results:`, results);

            return r(results);
          } else {
            return r(null);
          }
          // Process and display the results here
          // for (const place of results) {
          //   // Example: Add a marker for each result
          //   new google.maps.Marker({
          //     map,
          //     position: place.geometry.location,
          //     title: place.name,
          //   });
          // }
        } else {
          console.error("Place search request failed:", status);
          return rj(status);
        }
      });
    });
  }

  function addMarker(
    map: google.maps.Map,
    position: Coords | google.maps.LatLng,
  ) {
    if (!isReady) return undefined;

    const marker = new google.maps.Marker({
      position,
      map,
    });

    // let c: Coords = position as Coords;

    // if (typeof position.lat !== "number") {
    //   const p = position as google.maps.LatLng;
    //   const [lat, lng] = [p.lat(), p.lng()];

    // c = {
    //   lat,
    //   lng,
    // };
    // }

    return marker;
  }

  function getCoordsCloseTo(d: { target: Coords; items: Coords[] }) {
    const { items, target } = d;
    return items.filter(
      (item) => calculateDistance(target, item) <= proximityThreshold,
    );
  }

  // function addMarkers() {}

  useEffect(() => {
    if (appended.current || document.querySelector("#googleMapScript")) return;
    const functionName = "initMap";

    (window as any)[functionName] = () => {
      setIsReady(() => true);
    };

    const script = document.createElement("script");

    script.id = `googleMapScript`;

    // const _lang = navigator.languages.find((s) => s.includes("-"));
    // const _lang = navigator.languages[navigator.languages.length - 1];

    // const [lang, region] = navigator.languages[0].split("-");
    const [lang, region] = ["vi", "VN"];
    // console.log(`🚀 ~ useEffect ~ [lang, region]:`, [lang, region]);

    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAP_API_KEY ?? ""
    }&callback=${functionName}&v=weekly${lang && `&language=` + lang}${
      region && `&region=` + region
    }&libraries=places`;
    // script.innerHTML =
    //   '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key: "' +
    //   import.meta.env.VITE_GOOGLE_MAP_API_KEY +
    //   '", v: "beta"});';

    document.head.appendChild(script);

    appended.current = true;
  }, []);

  useEffect(() => {
    if (!isReady) return;
    setGeocoder(new google.maps.Geocoder());
  }, [isReady]);

  const value = (() => ({
    loadMapTo,
    addMarker,
    getAddressFromMarker,
    getCoordsFromAddress,
    clearMarker,
    getCoordsCloseTo,
    placeSearch,
  }))();

  return (
    <GoogleMapContext.Provider value={value}>
      {children}
    </GoogleMapContext.Provider>
  );
}

function waitForMapToBeLoaded() {
  return new Promise<void>((r, rj) => {
    if (window?.google !== undefined) {
      return r();
    }

    const t = setTimeout(() => {
      if (window?.google === undefined) {
        clearInterval(i);

        return rj();
      }
    }, 30000);

    const i = setInterval(() => {
      if (window?.google === undefined) return;

      clearInterval(i);
      clearTimeout(t);

      return r();
    }, 50);
  });
}

async function clearMarker(marker: google.maps.Marker) {
  marker.setMap(null);
}
