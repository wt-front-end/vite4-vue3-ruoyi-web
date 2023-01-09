<!--
 * @Author: xkloveme
 * @Date: 2022-01-07 16:54:31
 * @LastEditTime: 2022-03-28 20:45:43
 * @LastEditors: xkloveme
 * @Description: charts基础组件
 * @FilePath: /la-ft-web/src/packages/wt-chart/index.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="wt-echart">
    <div ref="echartDivRef" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script setup name="wtChart">
import { ref, onMounted, withDefaults, watchEffect } from "vue";
import useEchart from "./useEchart";

// 定义props
const props = defineProps({
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "300px"
  },
  options: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(["handleChart"]);
const echartDivRef = ref();

onMounted(() => {
  const { setOptions, echartInstance } = useEchart(echartDivRef.value);
  watchEffect(() => {
    setOptions(props.options);
    echartInstance.on("click", function (params) {
      emit("handleChart", params);
    });
  });
});
</script>
