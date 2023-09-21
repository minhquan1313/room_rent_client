import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@Pub",
        replacement: path.resolve(process.cwd(), "public"),
      },
      {
        find: "@",
        // eslint-disable-next-line no-undef
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  // define: {
  //   global: "window",
  // },
  plugins: [
    //
    // mkcert(),
    react(),
    svgr(),
  ],
});
