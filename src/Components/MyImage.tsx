import { ThemeContext } from "@/Contexts/ThemeProvider";
import img_fail from "@/assets/imgError.svg";
import img_fail_light from "@/assets/imgErrorLight.svg";
import { VITE_SERVER } from "@/constants/env";
import { preloadImage } from "@/utils/preloadImage";
import { Image, ImageProps, Spin, theme } from "antd";
import { useContext } from "react";

interface Props extends Omit<ImageProps, "placeholder"> {
  addServer?: boolean;
}

preloadImage({ url: img_fail });
preloadImage({ url: img_fail_light });

function MyImage({ src, addServer, ...rest }: Props) {
  const { myTheme } = useContext(ThemeContext);
  const { token } = theme.useToken();

  return (
    <Image
      {...rest}
      src={addServer && src && src.startsWith("/") ? VITE_SERVER + src : src}
      placeholder={
        <div className="relative z-0 !h-full !w-full">
          <Spin
            wrapperClassName="!h-full !w-full"
            // wrapperClassName="absolute inset-0"
            className=""
            style={{ backgroundColor: token.colorBgLayout }}
            spinning
            children={""}
          />
          {/* <Skeleton.Image
            active
            className="!h-full !w-full"
            style={{ backgroundColor: token.colorBgLayout }}
          /> */}
        </div>
      }
      fallback={myTheme === "light" ? img_fail : img_fail_light}
    />
  );
}

export default MyImage;
