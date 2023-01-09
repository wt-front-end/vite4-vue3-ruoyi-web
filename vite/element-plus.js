import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default function createElementPlus () {
  return Components({
    resolvers: [
      // Auto register icon components
      // 自动注册图标组件
      IconsResolver({
        enabledCollections: ['ep'],
      }),
      // Auto register Element Plus components
      // 自动导入 Element Plus 组件
      ElementPlusResolver(),
    ],
    dts: false
  });
}
