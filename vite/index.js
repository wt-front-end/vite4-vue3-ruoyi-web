import vue from "@vitejs/plugin-vue";
import createAutoImport from "./auto-import";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";
import createUnocss from "./unocss";
import createElementPlus from "./element-plus";
import createGitVersion from "./rollup-plugin-version";
import Icons from 'unplugin-icons/vite'
export default function createVitePlugins (viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createGitVersion(viteEnv));
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createElementPlus());
  vitePlugins.push(Icons({ autoInstall: true,  compiler: "vue3" }));
  vitePlugins.push(createUnocss());
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
