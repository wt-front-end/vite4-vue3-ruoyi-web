<!--
 * @Author: xkloveme
 * @Date: 2022-04-21 15:45:06
 * @LastEditTime: 2022-05-10 16:54:36
 * @LastEditors: xkloveme
 * @Description: JSON转EXCEL,新方案xml生成
 * @FilePath: /la-ft-web/src/packages/wt-j2e/index.vue
 * @Copyright © xkloveme
-->
<template>
  <span @click="generate">
    <el-button size="small" type="text"> <slot></slot></el-button>
  </span>
</template>
<script setup name="wtJ2e">
import EXDownloadManager from "./download-excel.js";
const props = defineProps({
  tableData: {
    // 单表表格数据
    type: Array,
    default: () => []
  },
  columns: {
    // 单表表头
    //  "title",name支持
    // "dataIndex": field 字段
    type: Array,
    default: () => []
  },
  operationName: {
    // 操作名称
    type: [String, Number],
    default: "查看"
  },
  sheets: {
    // 多表数据(注意,传了sheets,则tableData,columns会失效,否则会报错)
    type: Array,
    default: () => []
  },
  fileName: {
    // 文件名
    type: String,
    default: "模版"
  }
});

function generate() {
  if (props.sheets && props.sheets.length) {
    // const sheets = [
    //   {
    //     // 单个 sheet 名字
    //     name: '用户数据1',
    //     // 单个 sheet 数据源
    //     data: dataSource,
    //     // 单个 sheet 列名称与读取key
    //     columns: columns
    //   },
    //   {
    //     // 单个 sheet 名字
    //     name: '用户数据2',
    //     // 单个 sheet 数据源
    //     data: [],
    //     // 单个 sheet 列名称与读取key
    //     columns: columns
    //   }
    // ]
    EXDownloadManager(props.sheets, null, props.fileName);
  } else {
    EXDownloadManager(
      [
        {
          name: "sheet0",
          data: props.tableData,
          columns: props.columns
        }
      ],
      null,
      props.fileName
    );
  }
}
</script>
