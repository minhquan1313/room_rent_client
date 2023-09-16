import { ThemeContext } from "@/Contexts/ThemeProvider";
import img_fail from "@/assets/imgError.svg";
import img_fail_light from "@/assets/imgErrorLight.svg";
import { preloadImage } from "@/utils/preloadImage";
import { Image, ImageProps, Skeleton, theme } from "antd";
import { useContext } from "react";

const VITE_SERVER = import.meta.env.VITE_SERVER;

interface Props extends Omit<ImageProps, "placeholder"> {
  addServer?: boolean;
}

preloadImage(img_fail);
preloadImage(img_fail_light);

function MyImage({ src, addServer, ...rest }: Props) {
  const { myTheme } = useContext(ThemeContext);
  const { token } = theme.useToken();
  // console.log(`🚀 ~ MyImage ~ token:`, token);
  // console.log(addServer ? VITE_SERVER + src : src);

  return (
    // <img {...rest} src={addServer ? VITE_SERVER + src : src} />
    <Image
      {...rest}
      src={addServer ? VITE_SERVER + src : src}
      placeholder={
        <Skeleton.Image
          active={true}
          className="!h-full !w-full"
          style={{ backgroundColor: token.colorBgLayout }}
        />
      }
      fallback={myTheme === "light" ? img_fail : img_fail_light}
    />
  );
}

export default MyImage;
