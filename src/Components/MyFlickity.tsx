import { ReactNode, useEffect, useState } from "react";
import Flickity from "react-flickity-component";

interface IProps {
  children: ReactNode;
}

export function MyFlickity({ children }: IProps) {
  const [flickity, setFlickity] = useState<any>();

  useEffect(() => {
    if (!flickity) return;

    const dragStart = () => {
      flickity.slider.childNodes.forEach(
        (slide: any) => (slide.style.pointerEvents = "none"),
      );
    };
    const dragEnd = () => {
      flickity.slider.childNodes.forEach(
        (slide: any) => (slide.style.pointerEvents = ""),
      );
    };

    flickity.on("dragStart", dragStart);
    flickity.on("dragEnd", dragEnd);

    // flickity.on("dragMove", move);
    // flickity.on("dragEnd", end);

    return () => {
      flickity.off("dragStart", dragStart);
      flickity.off("dragEnd", dragEnd);
    };
  }, [flickity]);

  return (
    <Flickity
      className={"-mx-2"}
      elementType={"div"}
      options={{
        contain: true,
        // cellAlign: "left",
        prevNextButtons: false,
        draggable: true,
        groupCells: true,
      }}
      reloadOnUpdate
      flickityRef={(e: any) => setFlickity(e)}
    >
      {children}
    </Flickity>
  );
}
