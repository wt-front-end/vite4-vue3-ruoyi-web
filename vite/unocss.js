import Unocss from 'unocss/vite'
import icons from '../src/components/IconSelect/icons.js'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
export default function createUnocss () {
  let arr =[]
  icons.map(item=>{
    arr=arr.concat(item.icons)
  })
  return Unocss({
    safelist: arr,
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons()],
  });
}