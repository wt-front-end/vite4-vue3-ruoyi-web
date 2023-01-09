<!--
 * @Author: xkloveme
 * @Date: 2021-12-01 16:13:50
 * @LastEditTime: 2022-06-27 11:56:30
 * @LastEditors: xkloveme
 * @Description: 数字增长
 * @FilePath: /la-ft-web/src/packages/wt-number/index.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="number-grow-warp">
    <span ref="numberGrow" class="number-grow overflow-hidden light-font-led">{{
      formatNumber(showValue)
    }}</span
    >{{ unit }}
  </div>
</template>

<script setup name="wtNumber">
const emit = defineEmits(["update:modelValue"]);
// 定义props
const props = defineProps({
  time: {
    type: Number,
    default: 10
  },
  unit: {
    type: String,
    default: ""
  },
  fontSize: {
    type: Number,
    default: 0.745
  },
  modelValue: {
    type: Number,
    default: 100
  },
  toFixed: {
    type: Number,
    default: 0
  }
});
const formatNumber = computed(() => {
  return function (index) {
    return parseFloat(index)
      .toFixed(props.toFixed || 0)
      .toString()
      .replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, "$1,");
  };
});
let showValue = ref(0);
let numText = 0;
let golb; // 为了清除requestAnimationFrame
function numberGrow() {
  let step = props.modelValue / (props.time * 20);
  function numSlideFun() {
    // 数字动画
    numText += step; // 速度的计算可以为小数 。数字越大，滚动越快
    if (numText >= props.modelValue) {
      numText = props.modelValue;
      cancelAnimationFrame(golb);
    } else {
      golb = requestAnimationFrame(numSlideFun);
    }
    showValue.value = numText;
  }
  numSlideFun(); // 调用数字动画
}
const style = computed(() => {
  return {
    fontSize: props.fontSize + "rem"
  };
});
onMounted(() => {
  numberGrow();
});
</script>

<style lang="scss" scoped>
.number-grow-warp {
  transform: translateZ(0);
}
.number-grow {
  font-size: v-bind("style.fontSize");
  color: #fff;
}
</style>
