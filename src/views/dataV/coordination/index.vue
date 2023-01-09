<!-- 协同执纪 -->
<template>
  <div class="main p-4">
    <el-row :gutter="10" class="mb4 justify-end">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          @click="handleAdd"
          >新增协同执纪</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <wt-table
      ref="wtTableList"
      api="getXtzjList"
      :columns="newColumns"
      :isDataV="false"
      :index="false"
      :operation="['edit', 'del']"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </wt-table>
    <el-dialog
      v-model="dialogVisible"
      :title="`${dialogType == 'add' ? '新增' : '编辑'}协同执纪`"
      width="450px"
      center
    >
      <el-form
        :model="queryParams"
        :rules="rules"
        ref="formRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="联动时间" prop="ldsj">
          <el-date-picker
            v-model="queryParams.ldsj"
            style="width: 350px"
            value-format="YYYY-MM"
            type="month"
            placeholder="选择年月"
            clearable
            @change="handleDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发起方" prop="fqfList">
          <el-checkbox-group v-model="queryParams.fqfList">
            <el-checkbox label="嘉善县" name="fqf"></el-checkbox>
            <el-checkbox label="吴江区" name="fqf"></el-checkbox>
            <el-checkbox label="青浦区" name="fqf"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="参与方">
          <el-checkbox-group v-model="queryParams.cyfList">
            <el-checkbox label="嘉善县" name="cyf"></el-checkbox>
            <el-checkbox label="吴江区" name="cyf"></el-checkbox>
            <el-checkbox label="青浦区" name="cyf"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="协调会商" prop="xths">
          <div class="flex-center">
            <el-input v-model.number="queryParams.xths"> </el-input>
            <div class="ml4">次</div>
          </div>
        </el-form-item>
        <el-form-item label="通报案例" prop="tbal">
          <div class="flex-center">
            <el-input v-model.number="queryParams.tbal"></el-input>
            <div class="ml4">个</div>
          </div>
        </el-form-item>
        <el-form-item label="移送问题" prop="yswt">
          <div class="flex-center">
            <el-input v-model.number="queryParams.yswt"> </el-input>
            <div class="ml4">个</div>
          </div>
        </el-form-item>
        <el-form-item label="共享资源" prop="gxzy">
          <div class="flex-center">
            <el-input v-model.number="queryParams.gxzy"> </el-input>
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
const wtTableList = ref(null);
const formRef = ref(null);
const dialogType = ref("add");
const newColumns = ref([
  { label: "联动时间", prop: "ldsj" },
  { label: "发起方", prop: "fqf" },
  { label: "参与方", prop: "cyf" },
  { label: "协调会商", prop: "xths" },
  { label: "通报案例", prop: "tbal" },
  { label: "移送问题", prop: "yswt" },
  { label: "共享资源", prop: "gxzy" }
]);
const dialogVisible = ref(false);
const queryParams = ref({});
const rules = ref({
  ldsj: [
    { type: "date", required: true, message: "请选择年月", trigger: "change" }
  ],
  fqfList: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个发起方",
      trigger: "change"
    }
  ],
  xths: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ],
  tbal: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ],
  yswt: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ],
  gxzy: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ]
});
// 新增
function handleAdd() {
  dialogType.value = "add";
  formRef.value && formRef.value.resetFields();
  queryParams.value = {
    ldsj: "",
    fqfList: [],
    cyfList: [],
    xths: "",
    tbal: "",
    yswt: "",
    gxzy: ""
  };
  dialogVisible.value = true;
}
// 保存
function handleSave() {
  formRef.value.validate(valid => {
    if (valid) {
      const { ldsj, xths, tbal, yswt, gxzy } = queryParams.value;
      let fqf = queryParams.value.fqfList.join("、");
      let cyf = queryParams.value.cyfList.join("、");
      let params = {
        ldsj: ldsj,
        fqf: fqf,
        cyf: cyf,
        xths: xths,
        tbal: tbal,
        yswt: yswt,
        gxzy: gxzy
      };
      if (dialogType.value == "edit") {
        params.id = queryParams.value.id;
        $api.getXtzjEdit(params).then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess(res.msg);
            dialogVisible.value = false;
            wtTableList.value.refreshData();
          }
        });
      } else {
        $api.getXtzjAdd(params).then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess(res.msg);
            dialogVisible.value = false;
            wtTableList.value.refreshData();
          }
        });
      }
    }
  });
}
function handleEdit(row) {
  dialogType.value = "edit";
  let obj = JSON.parse(JSON.stringify(row));
  dialogVisible.value = true;
  queryParams.value = obj;
  queryParams.value.fqfList = obj.fqf ? obj.fqf.split("、") : [];
  queryParams.value.cyfList = obj.cyf ? obj.cyf.split("、") : [];
}
function handleDelete(row) {
  proxy.$modal.confirm("确定删除?").then(function () {
    $api.getXtzjDelete(row.id).then(res => {
      if (res.code == 200) {
        wtTableList.value.refreshData();
        proxy.$modal.msgSuccess("删除成功");
      }
    });
  });
}
onMounted(() => {});
</script>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  width: 250px;
}
</style>
