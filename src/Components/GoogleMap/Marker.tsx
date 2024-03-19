import useGoogleMapMarker from "@/hooks/useGoogleMapMarker";
import logger from "@/utils/logger";
import { Coords } from "google-map-react";
import { CSSProperties, ReactNode, memo, useEffect, useRef, useState } from "react";

export interface MarkerProps {
  //
  coord: Coords;
  map?: google.maps.Map;
  maps?: typeof google.maps;
  children?: ReactNode;

  onDragEnd?: (coord: Coords, oldCoord: Coords) => void;
}

const Marker = memo(function Marker(props: MarkerProps) {
  const {
    coord,
    map,
    maps,
    // keys,

    // centerOnPin,
    // onDragStart,
    // onDrag,
    onDragEnd,

    children,
    ..._props
  } = props;

  const [bottomLeft, setBottomLeft] = useState(() => calBottomLeft());
  const [shouldUpdate, setShouldUpdate] = useState({});
  // const [scale, setScale] = useState(1);
  const [scale, setScale] = useState(1);

  const transform = useRef([0, 0]);
  const allowUpdate = useRef(true);
  const observeMapDiv = useRef<HTMLElement | null>(null);
  const pinMainRef = useRef<HTMLDivElement | null>(null);
  const markerDragDataRef = useRef({
    x: 0,
    y: 0,
    mDow: false,
    mMoved: false,
  });
  // const scale = useRef(1);
  // const pinVisualRef = useRef<HTMLDivElement | null>(null);

  const { generateTransparentMarker, removeMarker } = useGoogleMapMarker({
    map,
    maps,
  });

  const updateTransform = (xy: number[]) => {
    if (!pinMainRef.current) return;
    // logger(`~🤖 Marker 🤖~ `, { str });

    transform.current = xy;

    pinMainRef.current.style.transform = `translateX(-50%) translate(${xy[0]}px,${xy[1]}px)`;
  };

  const getBounds = () => {
    const ne = map?.getBounds()?.getNorthEast().toJSON();
    const sw = map?.getBounds()?.getSouthWest().toJSON();

    return { ne, sw };
  };

  function calBottomLeft() {
    // const { ne, sw } = getBounds();
    // if (!ne || !sw) return;

    const { bottom, left } = calLayoutPixel();

    return {
      bottom: bottom + "px",
      left: left + "px",
    };
  }

  const updatePinLocation = () => {
    setBottomLeft(calBottomLeft());
  };

  function calLayoutPixel() {
    const o = { left: 0, bottom: 0 };

    const ele = map?.getDiv();
    if (!ele) return o;

    const { clientWidth, clientHeight } = ele;

    const [centerX, centerY] = [clientWidth / 2, clientHeight / 2];

    o.left = centerX;
    o.bottom = centerY;
    return o;
  }

  function makeObserver<T extends HTMLElement>(ele: T | null, cb: (ele: T) => void) {
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

  const extractNumberStr = (str: string) => {
    return str.match(/-?\d+/g)?.map((e) => parseInt(e)) || [0, 0];
  };

  const extractTranslateMutableGGMarker = (ggMarker: HTMLElement) => {
    const { transform } = ggMarker.style;
    const t = transform.slice(transform.lastIndexOf("translate"));

    return t;
  };

  const markerDragDoneUpdateMap = (marker: HTMLElement) => {
    const projection = map?.getProjection();
    const { ne, sw } = getBounds();

    if (!projection || !ne || !sw || !map || !maps) return;

    const containerPos = map.getDiv().getBoundingClientRect();
    const pinPos = marker.getBoundingClientRect();

    const mapPointTR = projection.fromLatLngToPoint(ne);
    const mapPointBL = projection.fromLatLngToPoint(sw);

    if (!mapPointTR || !mapPointBL) return;

    const mapXyBL = { x: 0, y: 0 },
      mapXyTR = { x: containerPos.width, y: containerPos.height };

    const pinXy = {
      x: pinPos.x - containerPos.x + pinPos.width / 2,
      y: pinPos.y - containerPos.y + pinPos.height,
    };

    const percentOfPinXy = {
      x: (pinXy.x * 100) / (mapXyTR.x - mapXyBL.x),
      y: (pinXy.y * 100) / (mapXyTR.y - mapXyBL.y),
    };

    // convert to point
    const pintPoint = {
      x: mapPointBL.x + (percentOfPinXy.x * (mapPointTR.x - mapPointBL.x)) / 100,
      y: mapPointTR.y + (percentOfPinXy.y * (mapPointBL.y - mapPointTR.y)) / 100,
    };

    const newCoord = projection.fromPointToLatLng(new maps.Point(pintPoint.x, pintPoint.y));

    newCoord && onDragEnd?.(newCoord.toJSON(), coord);
  };

  const markerDragListener = (marker: HTMLElement) => {
    const data = markerDragDataRef.current;
    // let x = 0,
    //   y = 0,
    //   mDow = false,
    //   mMoved = false;

    const cursor: {
      [keys in "grab" | "grabbing"]: Required<CSSProperties>["cursor"];
    } = {
      grab: "auto",
      grabbing: "grabbing",
    };

    marker.style.cursor = cursor.grab;

    /**
     * HERE!!!!!!!!!!! THIS ONE Will prevent the click being triggered
     * after you dragged the marker
     */
    const mClick = (e: MouseEvent) => {
      if (!data.mMoved) return;

      e.stopPropagation();
    };
    const md = (e: MouseEvent): void => {
      // logger(`~🤖 Marker 🤖~ md`, { mMoved });
      data.mDow = true;
      data.mMoved = false;

      const mkTransf = extractNumberStr(extractTranslateMutableGGMarker(marker));

      const { x: ex, y: ey } = e;

      [data.x, data.y] = [ex - mkTransf[0], ey - mkTransf[1]];
    };

    const mu = (): void => {
      if (data.mMoved && !data.mDow) marker.style.userSelect = "";

      if (!data.mDow) return;
      // logger(`~🤖 Marker 🤖~ mu`, { mMoved });
      marker.style.userSelect = "";

      data.mDow = false;
      marker.style.cursor = cursor.grab;
      setScale(1);

      if (data.mMoved) markerDragDoneUpdateMap(marker);

      // mMoved = false;
    };

    const mm = (e: MouseEvent): void => {
      if (!data.mDow) {
        marker.style.userSelect = "none";
      }

      if (!data.mDow || !allowUpdate.current) return;
      // logger(`~🤖 Marker 🤖~ mm`, { mMoved, x, y });

      data.mMoved = true;
      marker.style.userSelect = "none";
      marker.style.cursor = cursor.grabbing;
      setScale(2);
      // pinVisual && (pinVisual.style.transform = `scale(2)`);

      const { x: ex, y: ey } = e;

      const [transfX, transfY] = [ex - data.x, ey - data.y];
      // logger(`~🤖 Marker 🤖~ `, { transfX, transfY });

      updateTransform([transfX, transfY]);
    };

    marker.addEventListener("click", mClick);
    marker.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);
    window.addEventListener("mousemove", mm);

    return {
      destroy: () => {
        marker.removeEventListener("click", mClick);
        marker.removeEventListener("mousedown", md);
        window.removeEventListener("mouseup", mu);
        window.removeEventListener("mousemove", mm);
      },
    };
  };

  useEffect(() => {
    const mk = generateTransparentMarker(coord);
    const pinMain = pinMainRef.current;

    if (!map || !maps || !mk || !pinMain) return;
    logger(`~🤖 Marker 🤖~ Effect run `, coord);

    observeMapDiv.current = map.getDiv().querySelector('*[style*="z-index: 4"]');

    logger(`~🤖 Marker2 🤖~ `, {
      observeDiv: observeMapDiv.current,
      ggMapMk: mk.marker.element,
      mk: pinMain,
    });

    updatePinLocation();

    let lastGgMarkerTransform = "";
    let idleTimeOut: number;
    let resizeTimeOut: number;
    let pinVisible = true;

    const delay = 100;

    const onMapDivChange = (ele: HTMLElement): void => {
      if (!pinVisible) return;
      // logger(`~🤖 Marker 🤖~ onMapDivChange`);

      const b = extractNumberStr(ele.style.transform);

      if (b[0] === 0 && b[1] === 0) {
        if (!isRealPinVisible()) return;
      }

      const a = extractNumberStr(lastGgMarkerTransform);
      const [x, y] = [a[0] + b[0], a[1] + b[1]];
      // logger(`~🤖 Marker 🤖~ `, { a, b, x, y });

      // logger(`~🤖 Marker 🤖~ `, { x, y });

      updateTransform([x, y]);
    };

    function onMarkerChange(marker: HTMLElement) {
      if (!allowUpdate.current) return;
      // logger(`~🤖 Marker 🤖~ onMarkerChange`);

      const t = extractTranslateMutableGGMarker(marker);

      lastGgMarkerTransform = t;
      // logger(`~🤖 Marker 🤖~ `, { t });

      updateTransform(extractNumberStr(t));
    }

    const isRealPinVisible = () => {
      if (!document.contains(mk.marker.element)) {
        // logger(
        //   `~🤖 Marker 🤖~ isRealPinVisible !document.contains`,
        //   mk,
        //   mk.marker.element,
        // );
        pinMain.hidden = true;
        allowUpdate.current = false;
        pinVisible = false;
        return false;
      }

      // logger(`~🤖 Marker 🤖~ isRealPinVisible`);
      allowUpdate.current = true;
      pinMain.hidden = false;
      pinVisible = true;
      return true;
    };

    const onMapIdleChange = () => {
      clearTimeout(idleTimeOut);

      const process = () => {
        // logger(`~🤖 Marker 🤖~ idle process`);

        isRealPinVisible() && onMarkerChange(mk.marker.element);
      };

      idleTimeOut = setTimeout(process, delay);
    };

    const onResize = () => {
      clearTimeout(resizeTimeOut);

      resizeTimeOut = setTimeout(() => {
        setShouldUpdate({});
      }, delay);
    };

    const obs1 = makeObserver(observeMapDiv.current, onMapDivChange);
    const obs2 = makeObserver(mk.marker.element, onMarkerChange);

    const ev5 = map.addListener("idle", onMapIdleChange);

    window.addEventListener("resize", onResize);

    return () => {
      removeMarker(mk);

      clearTimeout(idleTimeOut);
      clearTimeout(resizeTimeOut);

      obs1?.destroy();
      obs2?.destroy();

      maps.event.removeListener(ev5);

      window.removeEventListener("resize", onResize);
    };
  }, [JSON.stringify(coord), map, shouldUpdate, generateTransparentMarker]);

  useEffect(() => {
    const pinMain = pinMainRef.current;
    if (!pinMain) return;

    const mDragListener = onDragEnd ? markerDragListener(pinMain) : undefined;

    return () => {
      mDragListener?.destroy();
    };
  }, [onDragEnd]);

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
        cursor: "grab",
      }}
      {..._props}
      ref={pinMainRef}
    >
      <div
        data-visual
        className="origin-bottom transition-all duration-300"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default Marker;
