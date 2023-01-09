<template>
  <div class="main p-4">
    <el-row :gutter="10" class="mb4 justify-end">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          @click="handleEdit"
          >编辑</el-button
        >
      </el-col>
    </el-row>
    <wt-table
      style="width: 500px"
      ref="wtTableList"
      :columns="newColumns"
      :tableData="tableData"
      :isDataV="false"
      :index="false"
      :isShowPagination="false"
      :isBorder="true"
    >
    </wt-table>
    <el-dialog v-model="dialogVisible" title="编辑" width="450px" center>
      <el-form :model="queryParams" :rules="rules" ref="formRef" :inline="true">
        <el-form-item label="镇街" prop="zj">
          <div class="flex-center">
            <el-input v-model.number="queryParams.zj"> </el-input>
            <div class="ml4">个</div>
          </div>
        </el-form-item>
        <el-form-item label="村社" prop="cs">
          <div class="flex-center">
            <el-input v-model.number="queryParams.cs"></el-input>
            <div class="ml4">个</div>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex-center">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const props = defineProps({});
const route = useRoute();
const rules = ref({
  zj: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ],
  cs: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ]
});
const newColumns = ref([
  {
    label: "名称",
    prop: "name"
  },
  {
    label: "数量",
    prop: "num",
    formatter: (row, column) => {
      return row.num + "个";
    }
  }
]);
const tableData = ref([
  {
    name: "镇街",
    num: "0"
  },
  {
    name: "村社",
    num: "0"
  }
]);
const dialogVisible = ref(false);
const queryParams = ref({});
const id = ref(null);
// 编辑
function handleEdit() {
  dialogVisible.value = true;
  queryParams.value.zj = tableData.value[0].num;
  queryParams.value.cs = tableData.value[1].num;
}
// 保存
function handleSave() {
  dialogVisible.value = false;
  $api.getXgyqfkEdit({ id: id.value, ...queryParams.value }).then(res => {
    if (res.code == 200) {
      proxy.$modal.msgSuccess(res.msg);
      getData();
    }
  });
}
function getData() {
  $api.getXgyqfkList().then(res => {
    id.value = res.data[0].id;
    tableData.value[0].num = res.data[0].zj;
    tableData.value[1].num = res.data[0].cs;
  });
}
onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss"></style>
