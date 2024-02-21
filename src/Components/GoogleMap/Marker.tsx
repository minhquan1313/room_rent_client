import useGoogleMapMarker from "@/hooks/useGoogleMapMarker";
import logger from "@/utils/logger";
import { Coords } from "google-map-react";
import { ReactNode, memo, useEffect, useRef, useState } from "react";

export interface MarkerProps {
  //
  coord: Coords;
  map?: google.maps.Map;
  maps?: typeof google.maps;
  children?: ReactNode;

  onDragStart?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
}

const defaultBL = {
  bottom: `0%`,
  left: `0%`,
};

const Marker = memo(function Marker(props: MarkerProps) {
  const {
    //
    coord,
    map,
    maps,

    onDragStart,
    onDrag,
    onDragEnd,

    children,
    ..._props
  } = props;

  const [bottomLeft, setBottomLeft] = useState(defaultBL);

  const [shouldUpdate, setShouldUpdate] = useState({});

  const transform = useRef("");
  const observeMapDiv = useRef<HTMLElement | null>(null);
  const allowUpdate = useRef(true);

  const isMDown = useRef(false);

  const pinMainRef = useRef<HTMLDivElement>(null as never);

  const { generateTransparentMarker, removeMarker } = useGoogleMapMarker({
    map,
    maps,
  });

  const updateTransform = (str: string) => {
    transform.current = str;
    pinMainRef.current.style.transform = `translateX(-50%) ${str}`;
  };

  const updatePinLocation = () => {
    const ne = map?.getBounds()?.getNorthEast().toJSON();
    const sw = map?.getBounds()?.getSouthWest().toJSON();
    if (!ne || !sw) return;

    const { bottom, left } = calLayoutPixel();

    setBottomLeft({
      bottom: bottom + "px",
      left: left + "px",
    });
  };

  const calLayoutPixel = () => {
    const o = { left: 0, bottom: 0 };

    const ele = map?.getDiv();
    if (!ele) return o;

    const { clientWidth, clientHeight } = ele;

    const [centerX, centerY] = [clientWidth / 2, clientHeight / 2];

    o.left = centerX;
    o.bottom = centerY;
    return o;
  };

  function makeObserver<T extends HTMLElement>(
    ele: T | null,
    cb: (ele: T) => void,
  ) {
    if (!ele) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let observer = new MutationObserver((mutationList, observer_) => cb(ele));

    observer.observe(ele, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return {
      destroy: () => {
        observer.disconnect();
        observer = null as any;
      },
    };
  }

  const extractValues = (str: string) => {
    return str.match(/-?\d+/g)?.map((e) => parseInt(e));
  };

  const mapDragListener = () => {
    const ele = map?.getDiv();
    if (!ele) return;

    let x = 0,
      y = 0,
      mUp = true;

    const md = (e: MouseEvent): void => {
      mUp = false;
      isMDown.current = true;

      const z = extractValues(transform.current) || [0, 0];

      [x, y] = [e.x - z[0], e.y - z[1]];
    };

    const mu = (): void => {
      mUp = true;
      isMDown.current = false;
    };

    const mm = (e: MouseEvent): void => {
      if (mUp || !allowUpdate.current) return;
      logger(`~🤖 Marker 🤖~ mouse move`);

      const [xx, yy] = [e.x - x, e.y - y];

      updateTransform(`translate(${xx}px, ${yy}px)`);
    };

    ele.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);
    window.addEventListener("mousemove", mm);

    return {
      destroy: () => {
        ele.removeEventListener("mousedown", md);
        window.removeEventListener("mouseup", mu);
        window.removeEventListener("mousemove", mm);
      },
    };
  };

  const markerDragListener = () => {};

  useEffect(() => {
    const mk = generateTransparentMarker(coord);
    if (!map || !maps || !mk) return;

    observeMapDiv.current = map
      .getDiv()
      .querySelector('*[style*="z-index: 4"]');

    logger(`~🤖 Marker2 🤖~ `, {
      observeDiv: observeMapDiv.current,
      mk: mk.marker.element,
    });

    updatePinLocation();

    let lastMarkerTransform = "";
    let timeOut: number;

    const onMapDivChange = (ele: HTMLElement): void => {
      if (!allowUpdate.current || isMDown.current) return;
      logger(`~🤖 Marker 🤖~ onMapDivChange`);

      // if (!document.contains(mk.marker.element)) {
      //   pinMainRef.current.hidden = true;
      //   return;
      // } else {
      //   pinMainRef.current.hidden = false;
      // }

      const b = extractValues(ele.style.transform) || [0, 0];

      if (b[0] === 0 && b[1] === 0) {
        if (!isRealPinVisible()) return;
      }

      const a = extractValues(lastMarkerTransform) || [0, 0];
      const [x, y] = [a[0] + b[0], a[1] + b[1]];
      logger(`~🤖 Marker 🤖~ `, { a, b, x, y });

      updateTransform(`translate(${x}px,${y}px)`);
    };

    function onMarkerChange(ele: HTMLElement) {
      if (!allowUpdate.current) return;
      logger(`~🤖 Marker 🤖~ onMarkerChange`);

      const { transform } = ele.style;
      const t = transform.slice(transform.lastIndexOf("translate"));

      lastMarkerTransform = t;
      updateTransform(t);
    }

    const isRealPinVisible = () => {
      logger(`~🤖 Marker 🤖~ idle`);
      if (!document.contains(mk.marker.element)) {
        logger(`~🤖 Marker 🤖~ idle !document.contains`, mk, mk.marker.element);
        pinMainRef.current.hidden = true;
        allowUpdate.current = false;
        return false;
      }

      allowUpdate.current = true;
      pinMainRef.current.hidden = false;
      return true;
    };

    const listeners = mapDragListener();

    const resize = () => setShouldUpdate({});

    const obs1 = makeObserver(observeMapDiv.current, onMapDivChange);
    const obs2 = makeObserver(mk.marker.element, onMarkerChange);

    const ev5 = map.addListener("idle", () => {
      clearTimeout(timeOut);

      const process = () => {
        logger(`~🤖 Marker 🤖~ idle process`);

        isRealPinVisible() && onMarkerChange(mk.marker.element);
      };

      timeOut = setTimeout(process, 100);
    });

    window.addEventListener("resize", resize);

    return () => {
      removeMarker(mk);

      obs1?.destroy();
      obs2?.destroy();

      lastMarkerTransform = null as any;

      maps.event.removeListener(ev5);

      clearTimeout(timeOut);

      listeners?.destroy();

      window.removeEventListener("resize", resize);
    };
  }, [JSON.stringify(coord), map, generateTransparentMarker, shouldUpdate]);

  if (!map) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomLeft.bottom,
        left: bottomLeft.left,
        transform: `translateX(-50%)`,
        zIndex: 1,
        transition: "none",
      }}
      {..._props}
      ref={pinMainRef}
    >
      {/* <div data-mask className="peer absolute inset-0 z-10" /> */}
      <div
        data-visual
        className="origin-bottom transition-all peer-hover:scale-150"
      >
        {children}
      </div>
    </div>
  );
});

export default Marker;
