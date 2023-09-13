import { Typography } from "antd";
import GoogleMapReact from "google-map-react";
import { useEffect, useRef } from "react";

function AnyReactComponent({
  text,
}: {
  text: string;
  lat: number;
  lng: number;
}) {
  return <div>{text}</div>;
}

export function Test() {
  const defaultProps = {
    center: {
      lat: 10.8389615,
      lng: 106.6560904,
    },
    zoom: 15,
  };

  return (
    // Important! Always set the container height explicitly
    <div className="aspect-video w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAP_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={10.8389615}
          lng={106.6560904}
          text="My Marker 2"
        />
      </GoogleMapReact>
    </div>
  );
}

function getUserLocation() {
  return new Promise<{ lat: number; lng: number }>((r, rj) => {
    navigator.geolocation.getCurrentPosition(
      function (successObj) {
        console.log(`🚀 ~ returnnewPromise ~ successObj:`, successObj);

        const { latitude, longitude } = successObj.coords;
        r({ lat: latitude, lng: longitude });
      },
      (errorObj) => {
        console.log(`🚀 ~ returnnewPromise ~ errorObj:`, errorObj);
        rj(errorObj);
      },
    );
  });
}
async function initMap() {
  let userLocation;
  try {
    userLocation = await getUserLocation();
  } catch (error) {
    //
  }

  const centerCoords = userLocation || { lat: 10.8003497, lng: 106.6354724 };

  const mapOptions: google.maps.MapOptions = {
    // styles: [
    //   {
    //     elementType: "geometry",
    //     stylers: [{ color: "#242f3e" }],
    //   },
    //   {
    //     elementType: "labels.text.stroke",
    //     stylers: [{ color: "#242f3e" }],
    //   },
    //   {
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#746855" }],
    //   },
    // ],
    zoom: 15,
    center: centerCoords,
    disableDefaultUI: true,
    clickableIcons: false,
    // mapTypeId: google.maps.MapTypeId.HYBRID,
  };

  const mapElement = document.getElementById("map");
  if (!mapElement) throw new Error(`No element with id map`);

  // -=-=
  let marker: google.maps.Marker;
  const map = new google.maps.Map(mapElement, mapOptions);
  const geocoder = new google.maps.Geocoder();

  map.setOptions({ scrollwheel: true });

  let isAllow = true;
  map.addListener("click", function (event: any) {
    // Tạo một marker mới tại vị trí click
    if (marker) {
      marker.setMap(null); // Xóa marker cũ (nếu có)
    }
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });

    // Gọi hàm để lấy tên địa chỉ từ tọa độ của marker
    getAddressFromMarker(event.latLng);
  });
  function getAddressFromMarker(latLng: google.maps.LatLng) {
    console.log(`🚀 ~ getAddressFromMarker ~ latLng:`, latLng);

    return new Promise<google.maps.GeocoderResult | null>((r, rj) => {
      geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === "OK") {
          if (results && results[0]) {
            const address = results[0].formatted_address;
            console.log(`🚀 ~ results:`, results);

            console.log("Tên Địa Chỉ: " + address);

            return r(results[0]);
          } else {
            console.log("Không tìm thấy địa chỉ");
            return r(null);
          }
        }
        console.log("Lỗi khi lấy địa chỉ: " + status);
        return r(null);
      });
    });
  }

  // google.maps.event.addListener(map, "click", function (event: any) {
  //   // console.log(`🚀 ~ event:`, event, event.latLng.lat());
  //   if (!isAllow) return;
  //   placeMarker(event.latLng);
  // });

  function placeMarker(location: any, allow = false) {
    isAllow = false;
    const marker = new google.maps.Marker({
      position: location,
      map,
      title: "abc",
    });

    marker.addListener("click", () => {
      map.setZoom(13);

      const pos = marker.getPosition();
      pos && map.setCenter(pos);
    });

    isAllow = allow;
    return {
      instance: marker,
      lat: marker.getPosition()?.lat(),
      long: marker.getPosition()?.lng(),
    };
  }

  // const marker = placeMarker(centerCoords, true);
  // console.log(`🚀 ~ initMap ~ marker:`, marker);

  // marker.instance.addListener("click", () => {
  //   map.setZoom(13);

  //   const pos = marker.instance.getPosition();
  //   pos && map.setCenter(pos);
  // });

  // You can use a LatLng literal in place of a google.maps.LatLng object when
  // creating the Marker object. Once the Marker object is instantiated, its
  // position will be available as a google.maps.LatLng object. In this case,
  // we retrieve the marker's position using the
  // google.maps.LatLng.getPosition() method.

  // const infoWindow = new google.maps.InfoWindow({
  //   content: renderToString(<MyContent />),
  //   // content: "<p>Marker Location:" + marker.getPosition() + "</p>",
  // });

  // google.maps.event.addListener(marker, "click", () => {
  //   infoWindow.open(map, marker);
  // });
}

function MyContent() {
  return <Typography.Title>asd</Typography.Title>;
}

export default function Test1() {
  const appended = useRef(false);
  // const scriptExecuted = useRef(false);

  // Mount gg map script
  useEffect(() => {
    if (appended.current || document.querySelector("#googleMapScript")) return;
    const script = document.createElement("script");

    script.id = `googleMapScript`;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAP_API_KEY
    }&callback=initMap&v=weekly&language=${"vi"}&region=${"VN"}`;
    // script.innerHTML =
    //   '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key: "' +
    //   import.meta.env.VITE_GOOGLE_MAP_API_KEY +
    //   '", v: "beta"});';

    document.body.appendChild(script);

    appended.current = true;
  }, []);

  // gg map logic
  useEffect(() => {
    // if (!appended.current || scriptExecuted.current) return;
    console.log(`exe`);

    (window as any)["initMap"] = initMap;
    // initMap();
    // scriptExecuted.current = true;

    // const i = setTimeout(() => {
    //   console.log(`y`);
    //   initMap();
    // }, 3000);

    // return () => clearTimeout(i);
  }, []);

  return (
    // Important! Always set the container height explicitly
    <div id="map" className="aspect-video w-full" />
  );
}

export function Test2() {
  // const {} = useContext(GoogleMapContext);

  return (
    // Important! Always set the container height explicitly
    <div id="map" className="aspect-video w-full" />
  );
}
