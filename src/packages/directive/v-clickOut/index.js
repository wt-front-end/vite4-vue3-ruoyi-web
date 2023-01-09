/*
 * @Author: xkloveme
 * @Date: 2022-06-16 14:20:21
 * @LastEditTime: 2022-06-16 14:48:18
 * @LastEditors: xkloveme
 * @Description: 点击节点外部时触发
 * @FilePath: /la-ft-web/src/packages/directive/v-clickOut/index.js
 * @Copyright © xkloveme
 */

// // 定义一个listener存储回调
const listener = {};
// 下标计数
let i = 0;
let handler = e => {
  Object.keys(listener).forEach(key => {
    if (typeof listener[key] === "function") {
      listener[key](e);
    }
  });
};
const vClickOut = {
  beforeMount(el, binding) {
    if (typeof binding.value === "function") {
      el.__OUTKEY__ = i++;
      listener[el.__OUTKEY__] = e => {
        if (e.target && !el.contains(e.target)) {
          binding.value(e, el);
        }
      };
      document.addEventListener("click", handler);
    }
  },
  updated(el, binding) {
    if (typeof binding.value === "function") {
      binding.value(el);
    }
  },
  unmounted(el) {
    delete listener[el.__OUTKEY__];
    delete el.__OUTKEY__;
    document.removeEventListener("click", handler);
  }
};

export default vClickOut;
