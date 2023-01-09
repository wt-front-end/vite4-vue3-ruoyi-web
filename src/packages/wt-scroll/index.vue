<!--
 * @Author: xkloveme
 * @Date: 2021-12-02 14:00:04
 * @LastEditTime: 2022-06-25 20:04:54
 * @LastEditors: xkloveme
 * @Description: 大屏列表滚动
 * @FilePath: /la-ft-web/src/packages/wt-scroll/index.vue
 * @Copyright © xkloveme
-->
<template>
  <!-- 滚动标题 -->
  <div class="light-font scroll-header" v-if="!hiddenHeader">
    <div
      class="scroll-item-text"
      :style="{ width: indexWidth + '%' }"
      title="序号"
      v-if="!isHiddenIndex"
    >
      序号
    </div>
    <div
      class="scroll-item-text"
      :style="{ width: column.width + '%' }"
      v-for="column in columns"
      :key="column.dataIndex"
      :title="column.title"
    >
      <slot
        v-if="$slots[column.slotTitleName]"
        :name="column.slotTitleName"
        :title="column.title"
      />
      <span v-else>{{ column.title }}</span>
    </div>
  </div>
  <div
    class="wtScroll light-font"
    id="wtScroll"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <div
      ref="wtScrollItem"
      :class="listClassName"
      @mouseenter="status = 'paused'"
      @mouseleave="status = 'running'"
    >
      <div v-for="(item, index) in list" :key="index" class="scroll-item">
        <div
          class="scroll-item-text cursor-pointer"
          @click="handleDetail(item, 0, index)"
          :style="{ width: indexWidth + '%' }"
          title="序号"
          v-if="!isHiddenIndex"
        >
          <slot v-if="slotIndexIcon" name="indexIcon" :index="index + 1" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div
          class="scroll-item-text cursor-pointer"
          :style="{
            ...column,
            width: column.width + '%',
            color: column.color || props.color,
            cursor: column.color ? 'pointer' : 'default'
          }"
          v-for="(column, i) in columns"
          :key="column.dataIndex"
          :title="item[column.dataIndex]"
          @click="handleDetail(item, i + 1, index)"
          :data-id="[item[column.dataIndex], item.instance_id]"
        >
          <slot
            v-if="$slots[column.slotName]"
            :name="column.slotName"
            :text="item[column.dataIndex]"
            :item="item"
            :column="column"
            :index="i"
          />
          <span v-else>{{ item[column.dataIndex] }}{{ column.suffix }}</span>
        </div>
      </div>
      <p v-if="list.length == 0" class="mt-1 text-center empty-container">
        无数据
      </p>
    </div>
  </div>
</template>
<script setup name="wtScroll">
const { proxy } = getCurrentInstance();
// 定义props
const props = defineProps({
  width: {
    type: [String, Number],
    default: "4"
  },
  indexWidth: {
    type: [String, Number],
    default: "15"
  },
  height: {
    type: [String, Number],
    default: "2"
  },
  fontSize: {
    type: [String, Number],
    default: "0.16"
  },
  titleColor: {
    type: String,
    default: "#00e6ff"
  },
  needNum: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: "#c8ddde"
  },
  api: {
    // 接口名称
    type: Function,
    default: null
  },
  tableData: {
    // 与api是互斥的，api优先级高，不传api，会读取tabledata的值
    type: Array,
    default: () => []
  },
  columns: {
    // 表头的值,跟el-table 保持一致
    type: Array,
    default: () => []
  },
  // 开始无缝滚动的数据量只有列表长度大于等于该值才会滚动
  limitScrollNum: {
    type: [String, Number],
    default: 5
  },
  // 滚动到底部时，加载数据的条数
  hiddenHeader: {
    // 是否隐藏滚动标题 默认不隐藏
    type: Boolean,
    default: false
  },
  isHiddenIndex: {
    // 是否隐藏序号 默认不隐藏
    type: Boolean,
    default: false
  },
  step: {
    // 滚动速度
    type: [String, Number],
    default: 0
  }
});
const style = computed(() => {
  return {
    width: props.width + "rem",
    height: props.height + "rem",
    fontSize: props.fontSize + "rem",
    titleColor: props.titleColor,
    itemWidth: props.needNum
      ? 100 / props.columns.length - 15 + "%"
      : 100 / props.columns.length + "%",
    needNum: props.needNum,
    color: props.color
  };
});
// 滚动动画class
const listClassName = ref("");
let loading = ref(false);
let duration = ref("6s");
let status = ref("running");
const list = ref([]);
// 获取dom,计算滚动时间
const wtScrollItem = ref(null);
function getdata() {
  loading.value = true;
  list.value = [];
  listClassName.value = "";
  if (props.api) {
    proxy.$api[props.api].then(res => {
      list.value = res.data;
    });
  } else {
    list.value = props.tableData;
  }

  if (list.value.length && list.value.length > props.limitScrollNum) {
    nextTick(() => {
      loading.value = false;
      duration.value = wtScrollItem.value.offsetHeight / 50 + props.step + "s";
      listClassName.value = "report-item-wrap";
    });
  } else {
    loading.value = false;
  }
}
const emit = defineEmits("clickList");
function handleDetail(item, col, row) {
  emit("clickList", item, row, col);
}

const slotIndexIcon = !!useSlots().indexIcon;

onMounted(() => {
  watchEffect(() => {
    getdata();
  });
});
</script>
<style lang="scss" scoped>
.wtScroll {
  width: v-bind("style.width");
  height: v-bind("style.height");
  font-size: v-bind("style.fontSize");
  color: v-bind("style.color");
  overflow: hidden;
  overflow-y: hidden;
  .scroll-item {
    color: v-bind("style.color");
    // background-color: #09434c;
    padding: 0.01rem;
    margin: 0.05rem 0rem;
    // border: solid 0.01rem #0095a9;
    border-image: linear-gradient(to right, #0095a9, transparent 15%, #0095a9) 1
      10;
  }
  @keyframes swipe-top {
    0% {
      transform: translate3d(0, 0, 0);
      -webkit-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(0, calc(v-bind("style.height") - 100%), 0);
      -webkit-transform: translate3d(0, calc(v-bind("style.height") - 100%), 0);
      -o-transform: translate3d(0, calc(v-bind("style.height") - 100%), 0);
      -moz-transform: translate3d(0, calc(v-bind("style.height") - 100%), 0);
    }
  }
  .report-item-wrap {
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -moz-backface-visibility: hidden;
    -moz-perspective: 1000;
    backface-visibility: hidden;
    perspective: 1000;

    animation: swipe-top 0s linear 0s infinite running;
    animation-play-state: v-bind(status);
    animation-duration: v-bind(duration);
  }
}
.scroll-item-text {
  display: inline-block;
  width: v-bind("style.itemWidth");
  padding: 0.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
.scroll-header {
  width: v-bind("style.width");
  color: v-bind("style.titleColor");
  font-size: v-bind("style.fontSize");
}

.empty-container {
  color: v-bind("style.titleColor");
  font-size: v-bind("style.fontSize");
}
</style>
