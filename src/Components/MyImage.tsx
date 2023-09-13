import ImgErrorIcon from "@/Components/Icons/ImgErrorIcon";
import { ThemeContext } from "@/Contexts/ThemeProvider";
import { preloadImage } from "@/utils/preloadImage";
import img_fail from "@Pub/img_fail.png";
import img_fail_light from "@Pub/img_fail_light.png";
import { Image, ImageProps, Skeleton } from "antd";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

interface Props extends Omit<ImageProps, "placeholder"> {}

preloadImage(img_fail);
preloadImage(img_fail_light);

function MyImage({ src, width, height, ...rest }: Props) {
  const { myTheme } = useContext(ThemeContext);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    preloadImage(src)
      .then(() => setLoaded(true))
      .catch(() => setFailed(true));
  }, [src]);

  // if (failed)
  //   return (
  //     <div
  //       {...rest}
  //       style={{ width, height, ...rest.style }}
  //       className={classNames(rest.className, "inline-block bg-red-400")}
  //     >
  //       <ImgErrorIcon style={{ fontSize: "1000%" }} />
  //       {/* <img
  //         src={myTheme === "dark" ? img_fail_light : img_fail}
  //         className="w-full p-5"
  //       /> */}
  //     </div>
  //   );

  return (
    // loaded ?
    <div
      {...rest}
      style={{
        width,
        height,
        ...rest.style,
      }}
      className={classNames(rest.className, "relative inline-block")}
    >
      {failed ? (
        <ImgErrorIcon style={{ fontSize: "1000%" }} />
      ) : (
        <Image
          loading="eager"
          // width={width}
          // height={height}
          src={src}
          className={"block"}
        />
      )}
      <Skeleton.Image
        active={true}
        rootClassName={classNames(
          "!h-full !w-full absolute inset-0 transition-all duration-500",
          {
            "opacity-100": !loaded && !failed,
            "opacity-0": loaded || failed,
          },
        )}
        className="!h-full !w-full"
      />
    </div>
  );
  // : (
  //   <div
  //     {...rest}
  //     style={{
  //       width,
  //       height,
  //       ...rest.style,
  //     }}
  //     className={classNames(rest.className, "relative")}
  //   >
  //     <Skeleton.Image
  //       active={true}
  //       rootClassName="!h-full !w-full"
  //       className="!h-full !w-full"
  //     />
  //   </div>
  // );
}

export default MyImage;
