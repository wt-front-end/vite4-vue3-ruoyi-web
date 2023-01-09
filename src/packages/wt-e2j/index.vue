<!--
 * @Author: xkloveme
 * @Date: 2022-04-21 15:45:06
 * @LastEditTime: 2022-05-10 16:54:49
 * @LastEditors: xkloveme
 * @Description: EXCEL转JSON
 * @FilePath: /la-ft-web/src/packages/wt-e2j/index.vue
 * @Copyright © xkloveme
-->
<template>
  <wt-upload
    :limit="1"
    accept=".xls,.xlsx"
    name="批量导入"
    :onlyFile="true"
    @file="getJson"
  ></wt-upload>
</template>
<script setup name="wtE2j">
import { read, utils } from "xlsx";
const emit = defineEmits(["getJsonData"]);
function getJson(file) {
  let reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = function (evt) {
    let data = evt.target.result; // 读到的数据
    try {
      var workbook = read(data, { type: "binary" });
      if (workbook?.SheetNames?.length > 1) {
        let sheets = [];
        workbook.SheetNames.map((sheet, index) => {
          sheets[sheet] = utils.sheet_to_json(workbook.Sheets[sheet]);
        });
        emit("getJsonData", sheets);
      } else if (workbook?.SheetNames?.length == 1) {
        const wsname = workbook.SheetNames[0]; //这里取第一张表,您可以自行调整,亦可以采取便利再操作
        const ws = utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
        emit("getJsonData", { [wsname]: ws });
      } else {
        emit("getJsonData", {});
      }
    } catch (err) {
      new Error("some wrong with import");
    }
  };
}
</script>
