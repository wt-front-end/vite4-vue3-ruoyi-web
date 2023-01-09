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
      <div>统计图</div>
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
      style="width: 500px"
      ref="wtTableList"
      api="getKyzfqljdtjtList"
      :columns="newColumns"
      :isDataV="false"
      :index="false"
      :isShowPagination="false"
      :isBorder="true"
      :operation="['edit']"
      @handleEdit="handleEditChart"
    >
    </wt-table>
    <div class="mb-2 flex justify-between">
      <div>统计表</div>
      <el-button
        class="w-20"
        type="primary"
        plain
        size="small"
        @click="handleAdd"
        >新增监督</el-button
      >
    </div>
    <wt-table
      ref="wtTableList2"
      api="getKyzfqljdtjbList"
      :columns="newColumns2"
      :isDataV="false"
      :index="false"
      :isBorder="true"
      :operation="['edit', 'del']"
      @handleEdit="handleEditTable"
      @handleDelete="handleDelete"
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
    title="编辑统计图"
    width="500px"
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
        <div class="flex-center" v-else>
          <el-input
            v-model.number="queryChartParams[item.prop]"
            style="width: 250px"
          ></el-input>
          <div class="ml4">个</div>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex-center">
      <el-button type="primary" @click="handleChartSave">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogTableVisible" title="新增监督" width="450px" center>
    <el-form
      :model="queryTableParams"
      ref="formTableRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="监督时间" prop="ldsj" :rules="rules.ldsj">
        <el-date-picker
          v-model="queryTableParams.ldsj"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择年月日"
          clearable
          @change="handleDateChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发起方" prop="fqfList" :rules="rules.fqfList">
        <el-checkbox-group v-model="queryTableParams.fqfList">
          <el-checkbox label="嘉善县" name="fqf"></el-checkbox>
          <el-checkbox label="吴江区" name="fqf"></el-checkbox>
          <el-checkbox label="青浦区" name="fqf"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="参与方">
        <el-checkbox-group v-model="queryTableParams.cyfList">
          <el-checkbox label="嘉善县" name="cyf"></el-checkbox>
          <el-checkbox label="吴江区" name="cyf"></el-checkbox>
          <el-checkbox label="青浦区" name="cyf"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="监督事项" prop="jdsx" :rules="rules.jdsx">
        <el-input v-model="queryTableParams.jdsx"> </el-input>
      </el-form-item>
      <el-form-item label="实时预警" prop="ssyj" :rules="rules.number">
        <el-input v-model.number="queryTableParams.ssyj"> </el-input>
      </el-form-item>
      <el-form-item label="预警整改" prop="yjzg" :rules="rules.number">
        <el-input v-model.number="queryTableParams.yjzg"></el-input>
      </el-form-item>
      <el-form-item label="问题处置" prop="wtcz" :rules="rules.number">
        <el-input v-model.number="queryTableParams.wtcz"> </el-input>
      </el-form-item>
      <el-form-item label="责任追究" prop="zrzj" :rules="rules.number">
        <el-input v-model.number="queryTableParams.zrzj"> </el-input>
      </el-form-item>
    </el-form>
    <div class="flex-center">
      <el-button type="primary" @click="handleTableSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const props = defineProps({});
const route = useRoute();
const formRef = ref(null);
const formChartRef = ref(null);
const formTableRef = ref(null);
const wtTableList = ref(null);
const wtTableList2 = ref(null);
const id = ref(null);
const dialogType = ref("add");
const topList = ref([
  { label: "监督事项", value: 6, prop: "jdsx" },
  { label: "权力流程", value: 25, prop: "qllc" },
  { label: "监督节点", value: 202, prop: "jdjd" }
]);
const newColumns = ref([
  { label: "事项", prop: "event" },
  { label: "联合执法", prop: "lhzf" },
  { label: "问题移送", prop: "wtys" },
  { label: "案件移送", prop: "ajys" }
]);
// const tableData = ref([
//   {
//     jdsx: "纳入事项",
//     nrsx: 20,
//     fcyj: 20,
//     red: 20
//   }
// ]);
const newColumns2 = ref([
  { label: "监督时间", prop: "ldsj" },
  { label: "发起方", prop: "fqf" },
  { label: "监督事项", prop: "jdsx" },
  { label: "参与方", prop: "cyf" },
  { label: "实时预警", prop: "ssyj" },
  { label: "预警整改", prop: "yjzg" },
  { label: "问题处置", prop: "wtcz" },
  { label: "责任追究", prop: "zrzj" }
]);
const dialogVisible = ref(false);
const queryParams = ref({});
const dialogChartVisible = ref(false);
const queryChartParams = ref({});
const dialogTableVisible = ref(false);
const queryTableParams = ref({});
const rules = ref({
  number: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    },
    { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
  ],
  fqfList: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个发起方",
      trigger: "change"
    }
  ],
  ldsj: [
    { type: "date", required: true, message: "请选择年月", trigger: "change" }
  ],
  jdsx: [
    {
      required: true,
      message: "请输入",
      trigger: "change"
    }
  ]
});
// const tableRules = ref({

//   number: [
//     {
//       required: true,
//       message: "请输入",
//       trigger: "change"
//     },
//     { pattern: /^\+?[0-9]\d*$/, message: "请输入正确的数字" }
//   ]
// })
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
        .getDpsytjEdit({ id: id.value, type: 2, ...queryParams.value })
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
      $api.getKyzfqljdtjtEdit(queryChartParams.value).then(res => {
        if (res.code == 200) {
          wtTableList.value.refreshData();
          proxy.$modal.msgSuccess(res.msg);
          dialogChartVisible.value = false;
        }
      });
    }
  });
}
function handleAdd() {
  dialogType.value = "add";
  formTableRef.value && formTableRef.value.resetFields();
  queryTableParams.value = {
    ldsj: "",
    fqfList: [],
    cyfList: [],
    xths: "",
    tbal: "",
    yswt: "",
    gxzy: ""
  };
  dialogTableVisible.value = true;
}
function handleEditTable(row) {
  dialogType.value = "edit";
  let obj = JSON.parse(JSON.stringify(row));
  dialogTableVisible.value = true;
  queryTableParams.value = obj;
  queryTableParams.value.fqfList = obj.fqf ? obj.fqf.split("、") : [];
  queryTableParams.value.cyfList = obj.cyf ? obj.cyf.split("、") : [];
}
function handleTableSave() {
  formTableRef.value.validate(valid => {
    if (valid) {
      const { ldsj, jdsx, ssyj, yjzg, wtcz, zrzj } = queryTableParams.value;
      let fqf = queryTableParams.value.fqfList.join("、");
      let cyf = queryTableParams.value.cyfList.join("、");
      let params = {
        ldsj: ldsj,
        fqf: fqf,
        cyf: cyf,
        jdsx: jdsx,
        ssyj: ssyj,
        yjzg: yjzg,
        wtcz: wtcz,
        zrzj: zrzj
      };
      if (dialogType.value == "edit") {
        params.id = queryTableParams.value.id;
        $api.getKyzfqljdtjbEdit(params).then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess(res.msg);
            dialogTableVisible.value = false;
            wtTableList2.value.refreshData();
          }
        });
      } else {
        $api.getKyzfqljdtjbAdd(params).then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess(res.msg);
            dialogTableVisible.value = false;
            wtTableList2.value.refreshData();
          }
        });
      }
    }
  });
}
function handleDelete(row) {
  proxy.$modal.confirm("确定删除?").then(function () {
    $api.getKyzfqljdtjbDelete(row.id).then(res => {
      if (res.code == 200) {
        wtTableList2.value.refreshData();
        proxy.$modal.msgSuccess("删除成功");
      }
    });
  });
}
function getData() {
  $api.getDpsytjList({ type: 2 }).then(res => {
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

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  width: 250px;
}
</style>
