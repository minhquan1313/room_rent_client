import { Coords } from "google-map-react";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
};

interface IContext {
  loadMapTo: (detail: {
    ref: HTMLElement;
    coords?: Coords | null | undefined;
  }) => Promise<google.maps.Map>;
  getUserCoords: () => Promise<Coords | null>;
  addMarker: (
    map: google.maps.Map,
    position: Coords | google.maps.LatLng,
  ) => Promise<google.maps.Marker | undefined>;
  getAddressFromMarker: (
    latLng: Coords,
  ) => Promise<google.maps.GeocoderResult | null>;
  getCoordsFromAddress: (address: string) => Promise<google.maps.LatLng | null>;
  calculateDistance: (user: Coords, target: Coords) => number;
  clearMarker: (marker: google.maps.Marker) => Promise<void>;
  getCoordsCloseTo: (d: { target: Coords; items: Coords[] }) => Coords[];
}

export const GoogleMapContext = createContext<IContext>(null as never);
export default function GoogleMapProvider({ children }: Props) {
  const appended = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const proximityThreshold = 1000; // mét
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
        console.log(`🚀 ~ results:`, results);
        if (status === "OK") {
          if (results && results[0]) {
            const location = results[0].geometry.location;
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
        console.log(`🚀 ~ status:`, status);

        return rj(status);
      });
    });
  }

  function getUserCoords() {
    return new Promise<Coords | null>((r) => {
      navigator.geolocation.getCurrentPosition(
        function (success) {
          const { latitude, longitude } = success.coords;
          const obj = { lat: latitude, lng: longitude };

          r(obj);
          console.log(`🚀 ~ getUserCoords ~ obj:`, obj);
        },
        (error) => {
          console.log(`🚀 ~ getUserCoords ~ errorObj:`, error);

          r(null);
        },
      );
    });
  }

  async function loadMapTo(detail: {
    ref: HTMLElement;
    coords?: Coords | null;
  }) {
    console.log(`calling`);

    if (!isReady) await waitForMapToBeLoaded();
    console.log(`calling ok`);

    const { coords, ref } = detail;

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

    return new google.maps.Map(ref, mapOptions);
    // setMap(ref ? new google.maps.Map(ref, mapOptions) : undefined);
    // setMarkers([]);
  }

  async function addMarker(
    map: google.maps.Map,
    position: Coords | google.maps.LatLng,
  ) {
    if (!isReady) return undefined;

    const marker = new google.maps.Marker({
      position,
      map,
    });

    return marker;
  }

  function calculateDistance(user: Coords, target: Coords) {
    const earthRadius = 6371000; // Bán kính Trái Đất (đơn vị: mét)

    const radLat1 = (Math.PI * user.lat) / 180;
    const radLat2 = (Math.PI * target.lat) / 180;

    const deltaLat = (Math.PI * (target.lat - user.lat)) / 180;
    const deltaLng = (Math.PI * (target.lng - user.lng)) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radLat1) *
        Math.cos(radLat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
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
    console.log(`🚀 ~ useEffect ~ [lang, region]:`, [lang, region]);

    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAP_API_KEY ?? ""
    }&callback=${functionName}&v=weekly${lang && `&language=` + lang}${
      region && `&region=` + region
    }`;
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
    getUserCoords,
    addMarker,
    getAddressFromMarker,
    getCoordsFromAddress,
    calculateDistance,
    clearMarker,
    getCoordsCloseTo,
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
