<!--
 * @Author: xkloveme
 * @Date: 2021-12-02 14:00:04
 * @LastEditTime: 2022-11-09 14:39:51
 * @LastEditors: xkloveme
 * @Description: table 封装
 * @FilePath: /js-web/src/packages/wt-table/wt-table.vue
 * @Copyright © xkloveme
-->
<template>
  <div v-if="newColumn.length" class="wtTable light-font" id="wtTable">
    <el-table
      v-bind="attrs"
      v-loading="listLoading"
      :data="
        isPagination
          ? newTableData?.slice((pageNum - 1) * pageSize, pageNum * pageSize)
          : newTableData
      "
      :span-method="spanMethod"
      :border="isBorder"
      :element-loading-background="
        isDataV ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)'
      "
      style="width: 100%; overflow-y: auto"
      stripe
      @selection-change="handleSelectionChange"
      @select-all="onSelectAll"
      @row-click="emit('onRowClick', $event)"
    >
      <el-table-column v-if="selection" type="selection" width="60" />
      <el-table-column
        v-if="index"
        label="序号"
        align="center"
        type="index"
        :width="isDataV ? 120 : 60"
      />
      <el-table-column
        v-for="item in newColumn"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
        :type="item.type"
        header-align="center"
        :align="item.align || 'center'"
        :width="item.width"
        :sortable="item.sortable || false"
        show-overflow-tooltip
      >
        <template #header>
          <slot :name="item.prop + '-header'">
            <span>{{ item.label }}</span>
          </slot>
        </template>
        <template #default="scope" v-if="item.slot">
          <slot :name="item.slot" :scope="scope"></slot>
        </template>
      </el-table-column>
      <slot></slot>
      <el-table-column
        v-if="operation.length"
        label="操作"
        align="center"
        :width="
          Array.isArray(operation)
            ? operation.length && operation.length * 23 + 155
            : operation.length && operation.length * 20
        "
      >
        <template #default="scope">
          <div class="flex-center">
            <el-button
              size="small"
              v-if="operation.indexOf('view') > -1"
              type="text"
              title="查看"
              alt="查看"
              @click="emit('handleView', scope.row)"
              >{{ operationName || "查看" }}</el-button
            >
            <el-button
              size="small"
              v-if="operation.indexOf('edit') > -1"
              type="text"
              title="编辑"
              alt="编辑"
              @click="emit('handleEdit', scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              v-if="operation.indexOf('del') > -1"
              type="text"
              title="删除"
              alt="删除"
              style="color: crimson"
              @click="emit('handleDelete', scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div :class="isDataV ? 'flex-center' : 'flex justify-end'">
      <div class="mt-5">
        <el-pagination
          v-if="isShowPagination"
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :class="isDataV ? 'wt-pagination flex-center' : 'flex-right'"
          :popper-class="isDataV ? 'select-popper-class' : ''"
          :total="newTotal"
          background
          layout="total,sizes, prev, pager, next, jumper"
          :hide-on-single-page="false"
          :pager-count="8"
          :small="true"
          @size-change="paginationSize"
          @current-change="paginationCurrrent"
        />
      </div>
    </div>
  </div>
</template>
<script setup name="wtTable">
import $api from "@/api";
const { proxy } = getCurrentInstance();

const emit = defineEmits([
  "handleView",
  "handleEdit",
  "handleDelete",
  "handleSelectionChange",
  "onSelectAll",
  "paginationChange",
  "onRowClick"
]);

const props = defineProps({
  tableData: {
    // 表格数据
    type: Array,
    default: () => []
  },
  api: {
    // 表格数据
    type: [String, Function],
    default: ""
  },
  operationName: {
    // 操作名称
    type: [String, Number],
    default: "查看"
  },
  columns: {
    // 表头
    type: Array,
    default: () => []
  },
  tableHeight: {
    // 表格高度
    type: String,
    default: "7rem"
  },
  params: {
    // 查询条件
    type: Object,
    default() {
      return { pageSize: 1, pageNum: 10 };
    }
  },
  total: {
    // 翻页条件
    type: Number,
    default: () => 0
  },
  operation: {
    // 需要哪些操作按钮
    type: Array,
    default: () => []
  },
  selection: {
    // 全选
    type: Boolean,
    default: () => false
  },
  index: {
    // 序号
    type: Boolean,
    default: () => true
  },
  radio: {
    // 单选
    type: Boolean,
    default: () => false
  },
  setting: {
    // 表头配置
    type: Boolean,
    default: () => false
  },
  selectAll: {
    // 表头配置
    type: Boolean,
    default: () => false
  },
  tableRowClassName: {
    type: Function,
    default: () => null
  },
  isHighlight: {
    // 是否需要点击高亮当行
    type: Boolean,
    default: true
  },
  isDataV: {
    // 是否是大屏
    type: Boolean,
    default: true
  },
  isPagination: {
    // 是否是前端分页
    type: Boolean,
    default: false
  },
  pollInterval: {
    // 是否是需要轮询
    type: Number,
    default: 0
  },
  isShowPagination: {
    // 是否显示分页
    type: Boolean,
    default: true
  },
  isSpanMethod: {
    // 是否合并行/列
    type: Boolean,
    default: false
  },
  isBorder: {
    // 是否显示竖直方向的边框
    type: Boolean,
    default: true
  }
});

const attrs = useAttrs();

const tableDom = ref();

const newColumn = computed(() => {
  let arr = [];
  props.columns.map(item => {
    arr.push({
      ...item,
      label: item.label || item.title,
      prop: item.prop || item.dataIndex,
      formatter: item.formatter || item.customRender || item.render
    });
  });
  return arr;
});
const newTotal = ref(props.total || props.tableData.length);
const newTableData = ref(props.tableData || []);
// 选择内容变化
const handleSelectionChange = val => {
  // 如果radio为true，则当前表格为单选表格
  if (proxy.radio === true && val.length > 1) {
    tableDom.value.clearSelection();
    tableDom.value.toggleRowSelection(val.pop());
  } else {
    emit("handleSelectionChange", val);
  }
};
// 全选
const onSelectAll = () => {
  if (proxy.radio === true) {
    tableDom.value.clearSelection();
  } else {
    emit("onSelectAll");
  }
};
const listLoading = ref(false);
const pageSize = ref(10);
const pageNum = ref(1);
const timer = ref(null);

// 关键方法,调用接口
function fetch() {
  const newParmas = {};
  for (const key in props.params) {
    const element = props.params[key];
    if (element !== "" && element !== null && element !== undefined) {
      newParmas[key] = element;
    }
  }
  const params = {
    ...newParmas,
    pageNum: pageNum.value,
    page: pageNum.value,
    pageSize: pageSize.value,
    size: pageSize.value
  };
  $api[props.api](params)
    .then(({ data, rows, total }) => {
      newTotal.value = total || data?.total || data?.data_total;
      newTableData.value = rows || data?.rows || data?.data || data || [];
      listLoading.value = false;
    })
    .catch(() => {
      listLoading.value = false;
    })
    .then(() => {
      clearTimeout(timer.value);
      if (props.pollInterval) {
        timer.value = setTimeout(() => fetch(), this.pollInterval);
      }
    });
}

function getData() {
  if (props.api) {
    listLoading.value = true;
    newTableData.value = [];
    nextTick(() => {
      fetch();
    });
  } else {
    nextTick(() => {
      listLoading.value = true;
      newTotal.value = props.tableData.length;
      newTableData.value = props.tableData || [];
      listLoading.value = false;
    });
  }
}
watch(
  () => props.tableData,
  () => {
    getData();
  },
  { deep: true }
);

onMounted(() => {
  getData();
});

// 卸载定时器
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});

// 抛重置方法
function refreshData() {
  pageNum.value = 1;
  pageSize.value = 10;
  getData();
}
defineExpose({
  refreshData,
  getData
});
// 设置
const openDialog = () => console.log("设置");

function paginationSize(data) {
  pageSize.value = data;
  pagination();
}
function paginationCurrrent(data) {
  pageNum.value = data;
  pagination();
}

// 翻页
const pagination = () => {
  getData();
  emit("paginationChange", {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  });
};
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (
    props.isSpanMethod &&
    (columnIndex == 0 || columnIndex == 1) &&
    column.label != "序号"
  ) {
    let spanArr = getSpanArr(newTableData.value, column.property);
    const _row = spanArr[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col
    };
  }
};
// 处理合并行的数据
function getSpanArr(data, spanKey) {
  let spanArr = [];
  let pos = "";
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      spanArr.push(1);
      pos = 0;
    } else {
      // 判断当前元素与上一个元素是否相同
      if (data[i][spanKey] === data[i - 1][spanKey]) {
        spanArr[pos] += 1;
        spanArr.push(0);
      } else {
        spanArr.push(1);
        pos = i;
      }
    }
  }
  return spanArr;
}
</script>
<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
$borderColor: #1f7ac0;
$bgColor: #071526;
$bgColor2: #10223b;
$bgColor3: #09308c;

.wt-pagination {
  :deep(.el-pagination__total) {
    color: #25d9f6;
    font-size: 0.2rem;
  }
  :deep(.el-pagination__jump) {
    color: #25d9f6;
    font-size: 0.2rem;
    height: 0.2rem;
    line-height: inherit;
  }
  :deep(.more) {
    background: url("../wt-modal/img/page_def.png") no-repeat;
    background-size: 100% 100%;
    color: #5bb9f9 !important;
    background-color: #08223a !important;
    font-size: 0.12rem;
    height: 0.35rem;
    width: 0.35rem;
  }
  :deep(.btn-prev) {
    background: url("../wt-modal/img/pre_click.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.12rem;
    margin-left: 0.5rem;
    height: 0.35rem;
    width: 0.35rem;
  }
  :deep(.btn-next) {
    background: url("../wt-modal/img/next_click.png") no-repeat;
    background-size: 100% 100%;
    height: 0.35rem;
    width: 0.35rem;
  }
  :deep(.el-pager .number) {
    color: #5bb9f9;
    background: url("../wt-modal/img/page_def.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.16rem;
    height: 0.35rem;
    width: 0.35rem;
    margin: 0 0.1rem;
  }

  :deep(.el-input--small .el-input__inner) {
    background: #08223a;
    box-shadow: inset 0 0 4px 1px #00f5fc;
    border: 1px solid #00f5fc;
    color: #00f5fc;
    height: 0.4rem;
    width: 1rem;
    font-size: 0.12rem;
  }
  :deep(.el-pagination__editor.el-input) {
    width: 1rem;
    display: flex;
    align-items: center;
  }
}
</style>
