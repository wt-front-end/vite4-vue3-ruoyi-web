<!--
 * @Author: xkloveme
 * @Date: 2021-07-27 14:36:53
 * @LastEditTime: 2022-09-26 11:39:47
 * @LastEditors: xkloveme
 * @Description: 大屏弹窗
 * @FilePath: /la-ft-web/src/packages/wt-modal/wt-modal.vue
 * @Copyright © xkloveme
-->
<template>
  <div
    class="wt-modal light-font fixed top-0 left-0 right-0 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="show"
  >
    <div
      class="flex items-center justify-center min-h-screen text-center transition-opacity"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-35"
        aria-hidden="true"
      ></div>
      <div
        :class="[isbig ? 'wt-modal-bg-big' : 'wt-modal-bg', props.skinClass]"
        class="w-full h-full inline-block align-bottom rounded-xm text-left overflow-hidden animated animate-fadeInDown shadow-xl transform transition-all"
      >
        <header v-if="!$slots.header" class="relative">
          <img
            src="./img/close.png"
            @click="close"
            style="pointer-events: auto"
            :class="isbig ? 'my-1.3' : 'mt-0'"
            class="px-1 mx-2 absolute py-0 right-1 object-contain h-4 w-4 cursor-pointer -top-1"
          />
          <div
            class="flex-center align-bottom"
            @click="close"
            :class="isbig ? 'mt-2.5' : 'mt-3'"
          >
            <img
              src="./img/left.png"
              @click="close"
              class="h-2 w-2 py-0.5 mx-2"
            />
            {{ title }}
            <img
              src="./img/right.png"
              @click="close"
              class="h-2 w-2 py-0.5 mx-2"
            />
          </div>
        </header>
        <header v-else class="mt-3">
          <slot name="header" :triggerClose="close" />
        </header>

        <div
          :class="
            isbig ? 'mx-2 mt-1 px-2' : 'mx-5.5 mt-0.8 overflow-y-auto maxHeight'
          "
        >
          <slot />
          <wt-table
            ref="wtTableModal"
            v-if="columns.length"
            :columns="columns"
            v-bind="attrs"
          >
          </wt-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="wtModal">
const emit = defineEmits(["close", "update:modelValue"]);
// 定义props
const props = defineProps({
  width: {
    type: [String, Number],
    default: "40"
  },
  height: {
    type: [String, Number],
    default: "10"
  },
  columns: {
    // 表头
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ""
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  isbig: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 20
  },
  skinClass: {
    type: String,
    default: ""
  }
});
const attrs = useAttrs();
const style = computed(() => {
  return {
    width: props.width + "rem",
    height: props.height + "rem"
  };
});
const show = computed({
  get: () => props.modelValue,
  set: val => {
    emit("update:modelValue", val);
  }
});
function close() {
  show.value = false;
  emit("close", false);
}
const wtTableModal = ref(null);
const refresh = () => {
  wtTableModal.value.refreshData();
};
defineExpose({
  refresh
});

const zIndex = ref(props.zIndex || 20);
</script>
<style lang="scss" scoped>
.wt-modal {
  z-index: v-bind(zIndex);
  font-size: 0.3rem;
  .wt-modal-bg {
    position: relative;
    min-height: 10rem;
    width: v-bind("style.width");
    height: v-bind("style.height");
    background: url("./img/frame.png") no-repeat;
    background-size: 100% 100%;
    .maxHeight {
      max-height: 7.55rem;
    }
  }
  .wt-modal-bg-big {
    position: relative;
    width: 90%;
    pointer-events: auto;
    height: v-bind("style.height");
    background: url("./img/framebig.png") no-repeat;
    background-size: 100% 100%;
  }

  :deep(.el-form-item__label) {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #00f5fc;
    font-size: 0.18rem;
  }
  :deep(.el-input__inner) {
    background: #08223a;
    box-shadow: inset 0 0 4px 1px #00f5fc;
    letter-spacing: 4px;
    border: 1px solid #00f5fc;
    color: #00f5fc;
    font-size: 0.16rem;
    padding: 0.1rem;
    height: 0.4rem;
  }
  :deep(.el-button) {
    height: 0.4rem;
    padding: 0.1rem;
    font-size: 0.18rem;
  }
  :deep(.my-tabs .el-tabs .el-tabs__item) {
    color: #fff;
    font-size: 0.5rem;
    font-weight: 600;
  }
}
</style>
