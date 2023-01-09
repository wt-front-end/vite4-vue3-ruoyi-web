/*
 * @Author: xkloveme
 * @Date: 2022-01-07 16:53:08
 * @LastEditTime: 2022-01-07 16:53:10
 * @LastEditors: xkloveme
 * @Description: 图表基础配置
 * @FilePath: /RuoYi-Vue3/src/views/chart/useEchart.js
 * @Copyright © xkloveme
 */
import * as echarts from "echarts";

export default function (el) {
  const echartInstance = echarts.init(el);
  const setOptions = options => {
    echartInstance.setOption(options, !!options.notMerge);
  };
  const updateSize = () => {
    echartInstance.resize();
  };

  window.addEventListener("resize", () => {
    echartInstance.resize();
  });

  return {
    echartInstance,
    setOptions,
    updateSize
  };
}
