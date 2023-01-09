<!--村级小微权力监督 -->
<template>
  <div class="main p-4">
    <div class="mb-2 flex justify-between">
      <div>大屏首页</div>
      <el-button
        class="w-20"
        type="primary"
        plain
        size="small"
        @click="handleEdit"
        >编辑</el-button
      >
    </div>
    <div class="mb-2">
      <span v-for="(item, index) in topList" :key="index" class="mr-8"
        >{{ item.label }}：{{ item.value }}</span
      >
    </div>
    <div class="mb-2 flex justify-between">
      <div>统计图+统计表</div>
      <!-- <el-button
        class="w-20"
        type="primary"
        plain
        size="small"
        @click="handleEditChart"
        >编辑</el-button
      > -->
    </div>
    <wt-table
      ref="wtTableList"
      api="getCjxwqljdList"
      :columns="newColumns"
      :isDataV="false"
      :index="false"
      :isShowPagination="false"
      :isBorder="true"
      :operation="['edit']"
      @handleEdit="handleEditChart"
    >
    </wt-table>
  </div>
  <el-dialog v-model="dialogVisible" title="编辑大屏首页" width="450px" center>
    <el-form :model="queryParams" ref="formRef" :inline="true">
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-for="(item, index) in topList"
        :key="index"
        :rules="rules.number"
      >
        <el-input
          v-model.number="queryParams[item.prop]"
          style="width: 250px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex-center">
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog
    v-model="dialogChartVisible"
    title="编辑统计图+统计表"
    width="450px"
    center
  >
    <el-form
      :model="queryChartParams"
      ref="formChartRef"
      :inline="true"
      label-width="130px"
    >
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-for="(item, index) in newColumns"
        :key="index"
        :rules="index != 0 ? rules.number : ''"
      >
        <span v-if="index == 0">{{ queryChartParams[item.prop] }}</span>
        <el-input
          v-else
          v-model.number="queryChartParams[item.prop]"
          style="width: 250px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="flex-center">
      <el-button type="primary" @click="handleChartSave">保存</el-button>
    </div></el-dialog
  >
</template>

<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const props = defineProps({});
const route = useRoute();
const formRef = ref(null);
const formChartRef = ref(null);
const wtTableList = ref(null);
const id = ref(null);
const topList = ref([
  { label: "监督事项", value: 6, prop: "jdsx" },
  { label: "权力流程", value: 25, prop: "qllc" },
  { label: "监督节点", value: 202, prop: "jdjd" }
]);
const newColumns = ref([
  { label: "监督事项", prop: "jdsx" },
  { label: "纳入事项", prop: "nryj" },
  { label: "发出预警", prop: "fcyj" },
  { label: "红色预警", prop: "red" },
  { label: "黄色预警", prop: "yellow" },
  { label: "蓝色预警", prop: "blue" },
  { label: "问题整改(已整改)", prop: "yzg", width: "150px" },
  { label: "问题整改(未整改)", prop: "wzg", width: "150px" },
  { label: "问题线索", prop: "wtxs" },
  { label: "责任追究", prop: "zrzj" }
]);
const formColumns = ref([
  // { label: "监督事项", prop: "jdsx" },
  { label: "纳入事项", prop: "nryj" },
  { label: "发出预警", prop: "fcyj" },
  { label: "红色预警", prop: "red" },
  { label: "黄色预警", prop: "yellow" },
  { label: "蓝色预警", prop: "blue" },
  { label: "问题整改(已整改)", prop: "yzg" },
  { label: "问题整改(未整改)", prop: "wzg" },
  { label: "问题线索", prop: "wtxs" },
  { label: "责任追究", prop: "zrzj" }
]);
const dialogVisible = ref(false);
const queryParams = ref({});
const dialogChartVisible = ref(false);
const queryChartParams = ref({});
const rules = ref({
  number: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ]
});
function handleEdit() {
  dialogVisible.value = true;
  queryParams.value = {
    jdsx: topList.value[0].value,
    qllc: topList.value[1].value,
    jdjd: topList.value[2].value
  };
}
// 大屏首页保存
function handleSave() {
  formRef.value.validate(valid => {
    if (valid) {
      $api
        .getDpsytjEdit({ id: id.value, type: 1, ...queryParams.value })
        .then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess(res.msg);
            getData();
          }
        });
      dialogVisible.value = false;
    }
  });
}
function handleEditChart(row) {
  let obj = JSON.parse(JSON.stringify(row));
  queryChartParams.value = obj;
  formChartRef.value && formChartRef.value.resetFields();
  dialogChartVisible.value = true;
}
function handleChartSave() {
  formChartRef.value.validate(valid => {
    if (valid) {
      $api.getCjxwqljdEdit(queryChartParams.value).then(res => {
        if (res.code == 200) {
          wtTableList.value.refreshData();
          proxy.$modal.msgSuccess(res.msg);
          dialogChartVisible.value = false;
        }
      });
    }
  });
}
function getData() {
  $api.getDpsytjList({ type: 1 }).then(res => {
    id.value = res.data[0].id;
    topList.value[0].value = res.data[0].jdsx;
    topList.value[1].value = res.data[0].qllc;
    topList.value[2].value = res.data[0].jdjd;
  });
}
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss"></style>
