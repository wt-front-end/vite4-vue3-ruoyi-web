<template>
  <el-form
    :model="queryParams"
    ref="queryForm"
    :inline="true"
    style="margin-top: 5px"
  >
    <el-form-item label="风险等级" prop="warningLevel">
      <el-select
        v-model="queryParams.warningLevel"
        placeholder="请选择风险等级"
        clearable
        size="small"
      >
        <el-option
          v-for="dict in fxdjList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="延期情况" prop="delayStatus">
      <el-select
        v-model="queryParams.delayStatus"
        placeholder="请选择延期情况"
        clearable
        size="small"
      >
        <el-option
          v-for="dict in yqqkList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item label="状态" prop="applyStatus">
      <el-select
        v-model="queryParams.applyStatus"
        placeholder="请选择状态"
        clearable
        size="small"
      >
        <el-option
          v-for="dict in statusList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="业务范围" prop="isBusiness">
      <el-select
        v-model="queryParams.isBusiness"
        placeholder="请选择业务范围"
        filterable
        clearable
        size="small"
      >
        <el-option
          v-for="dict in ywfwList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关键字" prop="content">
      <el-input
        style="width: 450px"
        v-model="queryParams.content"
        placeholder="请输入编号/预警对象/预警模型/规则名称/预警结果/预交办单位/实际交办单位"
        clearable
        size="small"
      />
    </el-form-item>
    <!-- <el-form-item label="规则包" prop="packageId">
      <el-select
        v-model="queryParams.packageId"
        placeholder="请选择规则包"
        clearable
        size="small"
      >
        <el-option
          v-for="dict in packageIdList"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item label="时间" prop="time">
      <el-date-picker
        v-model="dateRange"
        size="small"
        style="width: 240px; line-height: 24px"
        value-format="YYYY-MM-DD"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="onChangeDateRange"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">
    <!-- <el-col :span="1.5">
      <el-button
        type="warning"
        size="mini"
        @click="handleExport"
        v-if="checkPermi(['data:result:export'])"
        >导出</el-button
      >
    </el-col> -->
    <el-col :span="1.5">
      <el-button type="primary" size="mini" @click="handleQuery"
        >查询</el-button
      >
    </el-col>
    <el-col :span="1.5">
      <el-button size="mini" @click="handleReset">重置</el-button>
    </el-col>
  </el-row>

  <el-table v-loading="loading" :data="dataList">
    <!-- <el-table-column label="序号" width="100" type="index" align="center" /> -->
    <el-table-column
      label="编号"
      align="center"
      prop="applyNo"
      width="160"
      :show-overflow-tooltip="true"
    />
    <el-table-column
      label="业务范围"
      align="center"
      prop="isBusiness"
      width="100"
    >
      <template #default="scope">
        <div>{{ ywfwList[scope.row.isBusiness].label }}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="预警对象"
      align="center"
      width="130"
      prop="warningPerson"
    />
    <el-table-column
      label="风险等级"
      align="center"
      width="130"
      prop="warningLevel"
    >
      <template #default="scope">
        <div>{{ fxdjList[scope.row.warningLevel - 1].label }}</div>
      </template>
    </el-table-column>
    <el-table-column
      label="预警模型"
      align="center"
      width="130"
      prop="eventType"
    />
    <el-table-column
      label="规则名称"
      align="center"
      prop="ruleName"
      width="200"
    />
    <el-table-column
      label="规则条件描述"
      align="center"
      width="120"
      prop="ruleConditions"
    />
    <el-table-column
      label="预交办单位"
      align="center"
      width="120"
      prop="beforehandUnit"
    />
    <el-table-column
      label="实际交办单位"
      align="center"
      width="120"
      prop="organizer"
    />
    <el-table-column
      label="截止日期"
      align="center"
      width="140"
      prop="closeDate"
    />
    <el-table-column
      label="创建时间"
      align="center"
      width="140"
      prop="createTime"
    />
    <el-table-column label="状态" align="center" width="140" prop="applyStatus">
      <template #default="scope">
        <div>{{ statusObj[scope.row.applyStatus] }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="120" fixed="right">
      <template #default="scope">
        <el-button size="mini" type="text" @click="handleDetail(scope.row)"
          >详情</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <pagination
    v-show="total > 0"
    :total="total"
    v-model:page="queryParams.pageNum"
    v-model:limit="queryParams.pageSize"
    @pagination="getList"
  />
</template>

<script setup>
// import { tansParams } from "@/utils/ruoyi";
// import { checkPermi } from "@/utils/permission.js";
import { getWarningList, getWarningDetail } from "@/api/warning/index";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const id = ref(0);
const fxdjList = ref([
  { label: "低风险", value: 1 },
  { label: "中风险", value: 2 },
  { label: "高风险", value: 3 }
]);
const yqqkList = ref([
  { label: "正常", value: 0 },
  { label: "申请延期中", value: 1 },
  { label: "已延期", value: 2 }
]);
const statusList = ref([
  { label: "待处置", value: 0 },
  { label: "待分管常委初审", value: 1 },
  { label: "待分管副书记初审", value: 2 },
  { label: "待生成通知书", value: 3 },
  { label: "承办单位办理中", value: 4 },
  { label: "待分管常委审核报告", value: 5 },
  { label: "待分管副书记审核报告", value: 6 },
  { label: "待书记审核报告", value: 7 },
  { label: "待归档", value: 8 },
  { label: "已归档", value: 9 },
  { label: "终止", value: 10 },
  { label: "外流转", value: 11 },
  { label: "审核驳回", value: 12 },
  { label: "交办单位待接收", value: 13 },
  { label: "待室主任审批", value: 25 }
]);
const statusObj = ref({
  0: "待处置",
  1: "待分管常委初审",
  2: "待分管副书记初审",
  3: "待生成通知书",
  4: "承办单位办理中",
  5: "待分管常委审核报告",
  6: "待分管副书记审核报告",
  7: "待书记审核报告",
  8: "待归档",
  9: "已归档",
  10: "终止",
  11: "外流转",
  12: "审核驳回",
  13: "交办单位待接收",
  25: "待室主任审批"
});
const packageIdList = ref([
  { label: "人员预警规则包", value: 1 },
  { label: "工程预警规则包", value: 2 },
  { label: "资产预警规则包", value: 3 },
  { label: "补助类预警规则包", value: 4 },
  { label: "出入境类预警规则包", value: 5 }
]);
const ywfwList = ref([
  { label: "其他", value: 0 },
  { label: "业务外", value: 1 },
  { label: "业务内", value: 2 }
]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  warningLevel: null, //风险等级
  delayStatus: null, //延期情况
  applyStatus: null, //状态
  content: null, // 关键字
  packageId: null, //规则包
  isBusiness: null, //业务范围
  startTime: null,
  endTime: null
});
const dateRange = ref([]);
const onChangeDateRange = () => {
  if (dateRange.value.length == 0) {
    queryParams.startTime = "";
    queryParams.endTime = "";
  } else {
    queryParams.startTime = dateRange.value[0];
    queryParams.endTime = dateRange.value[1];
  }
};

const dataList = ref([]);
const loading = ref(false);
const total = ref(0);
// 查询列表
function getList() {
  loading.value = true;
  getWarningList(queryParams).then(res => {
    loading.value = false;
    dataList.value = res.rows;
    total.value = res.total;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
const queryForm = ref();
const handleReset = () => {
  dateRange.value = [];
  queryParams.startTime = null;
  queryParams.endTime = null;
  queryParams.warningLevel = null;
  queryParams.delayStatus = null;
  queryParams.applyStatus = null;
  queryParams.content = null;
  queryParams.packageId = null;
  queryParams.isBusiness = null;
  // queryForm.value.resetFields();
  handleQuery();
};
function handleDetail(row) {
  router.push({
    path: "/warning/warningDetail",
    query: { id: row.id }
  });
}
getList();
</script>
<style lang="scss" scoped></style>
