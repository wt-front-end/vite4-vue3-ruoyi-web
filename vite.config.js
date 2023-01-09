import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import createVitePlugins from "./vite";
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: command === "serve" ? "/" : "./",
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": resolve(__dirname, "./"),
        // 设置别名
        "@": resolve(__dirname, "./src")
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    // 解决element plus build卡住 https://github.com/vitejs/vite/issues/5597
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: atRule => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    // vite 相关配置
    server: {
      port: 3333,
      host: true,
      open: false,
      proxy: {
        "/dev-api": {
          // target: "http://vue.ruoyi.vip/prod-api", // 若依官方
          // target: 'http://172.18.39.191:33223/', // 本地
          // target: "http://30.207.88.19:31135/prod-api", // 预发
          target: "http://172.31.48.38:8800", // 吴金梨yanfa网
          // target: "http://172.31.47.146:8800", // 吴金梨work网
          // target: "http://172.18.39.200:34020/prod-api", // 测试
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, "")
        }
      }
    }
  };
});
