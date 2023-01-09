<template>
  <div class="app-container123">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="applyStatus">
        <el-select
          v-model="queryParams.applyStatus"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="certificateStatus">
        <el-select
          v-model="queryParams.certificateStatus"
          placeholder="入库情况"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in licenseOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="oldDeptId">
        <el-select
          v-model="queryParams.oldDeptId"
          placeholder="全部移出单位"
          clearable
          size="small"
          style="width: 240px"
          filterable
        >
          <el-option
            v-for="dict in outUnitOption"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="newDeptId">
        <el-select
          v-model="queryParams.newDeptId"
          placeholder="全部移入单位"
          clearable
          size="small"
          style="width: 240px"
          filterable
        >
          <el-option
            v-for="dict in inUnitOption"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="姓名/身份证号码/申请编号"
          clearable
          size="small"
          style="width: 340px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="Search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleJobChange"
          v-if="checkRole(['QGGBZGY'])"
          >发起人员换岗(区管干部)</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleJobChange2"
          v-if="checkRole(['FQGGBZGY'])"
          >发起人员换岗(非区管干部)</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" size="small" @click="handleExport"
          >批量导出</el-button
        >
      </el-col> -->
    </el-row>
    <!-- 表格数据 -->
    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column label="申请编号" prop="applyNo" width="150" />
      <el-table-column
        label="姓名"
        prop="name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="身份证号"
        prop="sfzh"
        :show-overflow-tooltip="true"
        width="180"
      />
      <el-table-column label="移出单位" prop="oldDept" width="150" />
      <el-table-column label="职务" prop="oldPosition" width="100" />
      <el-table-column label="移入单位" prop="newDept" width="130" />
      <el-table-column label="状态" prop="applyStatus" width="130">
        <template #default="scope">
          {{ statusOption[scope.row.applyStatus].label }}
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createBy" width="130">
        <template #default="scope">
          {{ scope.row.createByDept }}-{{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="createTime" width="160" />
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            v-if="
              (scope.row.applyStatus == 1 || scope.row.applyStatus == 4) &&
              props.activeName === 'dwcl'
            "
            size="small"
            type="text"
            @click="handleReceiver(scope.row)"
            >接收</el-button
          >
          <el-button
            v-if="
              (scope.row.applyStatus == 1 || scope.row.applyStatus == 3) &&
              (props.activeName === 'dwcl' || props.activeName === 'qbxx') &&
              scope.row.createBy == userName
            "
            size="small"
            type="text"
            @click="handleCallBack(scope.row)"
            >撤销</el-button
          >
          <el-button
            v-if="scope.row.applyStatus == 2 && props.activeName === 'dwcl'"
            size="small"
            type="text"
            @click="handleFeedback(scope.row)"
            >反馈</el-button
          >
          <el-button
            v-if="scope.row.applyStatus == 3 && props.activeName === 'dwcl'"
            size="small"
            type="text"
            @click="handleReissue(scope.row)"
            >重新发起</el-button
          >
          <el-button
            v-if="
              scope.row.applyStatus == 5 &&
              scope.row.certificateStatus == 1 &&
              props.activeName === 'dwcl'
            "
            size="small"
            type="text"
            @click="handleLicense(scope.row)"
            >证照入库</el-button
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
    <JobChange ref="jobRef" @ok="getList" :isQg="isQg" />
    <ReceiverDialog
      ref="receiverRef"
      @ok="getList"
      :id="id"
      :taskId="taskId"
      :newDeptId="newDeptId"
      :detailData="detailData"
    />
    <LicenseDialog
      ref="licenserRef"
      @ok="getList"
      :id="id"
      :taskId="taskId"
      :detailData="licenseDetailData"
    />
    <FeedbackDialog
      ref="feedbackRef"
      @ok="getList"
      :id="id"
      :taskId="taskId"
      :detailData="detailData"
    />
    <ReissueDialog
      ref="reissueRef"
      @ok="getList"
      :name="reissueName"
      :newDept="newDept"
      :newDeptId="newDeptId"
      :isPromote="reissueisPromote"
      :oldZgdwId="oldZgdwId"
      :sfzh="sfzh"
      :id="id"
      :taskId="taskId"
    />
  </div>
</template>
<script setup name="Unit">
import JobChange from "./components/jobChange";
import ReceiverDialog from "./components/receiverDialog";
import LicenseDialog from "./components/licenseDialog";
import FeedbackDialog from "./components/feedbackDialog";
import ReissueDialog from "./components/reissueDialog";
import { checkRole } from "@/utils/permission.js";
import {
  listHgMystart,
  postCallBackProcess,
  listHgWaitForMy,
  listHgMyHandle,
  listHgSelectAll,
  getLicenseDetailById,
  getLicenseById
} from "@/api/process/index";
import { listDept } from "@/api/system/dept";
import { ElMessageBox } from "element-plus";
import { queryParams2FormData } from "@/utils/ruoyi";
const store = useStore();
const userName = store.state.user.user.userName; //登录用户信息
const router = useRouter();
const { proxy } = getCurrentInstance();
const isQg = ref(true);
const reissueName = ref("");
const newDept = ref("");
const reissueisPromote = ref("");
const oldZgdwId = ref("");
const sfzh = ref("");
const props = defineProps({
  activeName: {
    type: String,
    default: "dwcl"
  }
});
const dateRange = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    applyStatus: null,
    certificateStatus: null,
    oldDeptId: null, //原单位
    newDeptId: null, //新单位
    // startTime: '', //审批开始时间
    // endTime: '', //审批结束时间
    content: undefined // 模糊搜索
  },
  rules: {
    roleName: [
      { required: true, message: "角色名称不能为空", trigger: "blur" }
    ],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  }
});
// 待办页面入口 自动条件过滤
const { applyStatus, startTime, endTime, content } = queryParams2FormData(
  "applyStatus",
  "startTime",
  "endTime",
  "content"
);
data.queryParams.applyStatus = applyStatus;
if (startTime && endTime) {
  data.queryParams.startTime = startTime;
  data.queryParams.endTime = endTime;
  dateRange.value = [startTime, endTime];
}
data.queryParams.content = content;

const { queryParams, form, rules } = toRefs(data);
const statusOption = [
  { label: "全部状态", value: null },
  { label: "待移入单位接收", value: "1" },
  { label: "待公安反馈", value: "2" },
  { label: "移入单位驳回", value: "3" },
  { label: "公安驳回", value: "4" },
  { label: "已换岗", value: "5" },
  { label: "已撤销", value: "6" }
];
const licenseOption = [
  { label: "全部入库情况", value: null },
  { label: "有待入库证照", value: 1 },
  { label: "无待入库证照", value: 2 }
];
const outUnitOption = ref([
  { deptName: "全部移出单位", deptId: null }
  // { deptName: '单位', deptId: 1 }
]);
const inUnitOption = ref([
  { deptName: "全部移入单位", deptId: null }
  // { deptName: '单位', deptId: 1 }
]);
const roleList = ref([]);
const total = ref(0);
const loading = ref(true);
const deptName = ref("");
const id = ref(0);
const taskId = ref(0);
const newDeptId = ref(0);
const detailData = ref({});
const licenseDetailData = ref({});
/** 查询角色列表 */
function getList() {
  loading.value = true;
  if (dateRange.value.length != 0) {
    queryParams.value.startTime = dateRange.value[0];
    queryParams.value.endTime = dateRange.value[1];
  }
  if (props.activeName == "wfqd") {
    listHgMystart(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else if (props.activeName == "wycl") {
    listHgMyHandle(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else if (props.activeName == "dwcl") {
    listHgWaitForMy(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else {
    listHgSelectAll(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  //   proxy.resetForm('queryRef');
  dateRange.value = [];
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    applyStatus: null,
    certificateStatus: null,
    oldDeptId: null,
    newDeptId: null,
    content: undefined // 模糊搜索
  };
  handleQuery();
}
/** 新增单位 */
function handleAdd() {
  reset();
  //   getMenuTreeselect();
  //   open.value = true;
  title.value = "新增单位";
}
function handleExport() {}
function handleDetail(row) {
  router.push({ path: "/process/processDetail", query: { id: row.id } });
}
// 发起人员换岗(区管干部)
function handleJobChange() {
  isQg.value = true;
  proxy.$refs["jobRef"].show();
}
// 发起人员换岗(非区管干部)
function handleJobChange2() {
  isQg.value = false;
  proxy.$refs["jobRef"].show();
}
// 重新发起
function handleReissue(row) {
  reissueName.value = row.name;
  newDept.value = row.newDept;
  newDeptId.value = row.newDeptId;
  reissueisPromote.value = row.isPromote;
  oldZgdwId.value = row.oldZgdwId;
  sfzh.value = row.sfzh;
  id.value = row.id;
  taskId.value = row.taskId;
  proxy.$refs["reissueRef"].show();
}
// 去接收
function handleReceiver(row) {
  id.value = row.id;
  taskId.value = row.taskId;
  newDeptId.value = row.newDeptId;
  getLicenseDetailById({ id: row.id }).then(res => {
    detailData.value = res.data;
  });
  proxy.$refs["receiverRef"].show();
}
// 撤销
function handleCallBack(row) {
  ElMessageBox.alert(`确认撤销编号为${row.applyNo}的人员换岗？`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "温馨提示",
    callback: action => {
      if (action === "confirm") {
        postCallBackProcess({ id: row.id }).then(res => {
          proxy.$modal.msgSuccess("撤销成功");
          getList();
        });
      }
    }
  });
}
function handleLicense(row) {
  id.value = row.id;
  taskId.value = row.taskId;
  getLicenseById({ id: row.id }).then(res => {
    licenseDetailData.value = res.data;
    proxy.$refs["licenserRef"].show();
  });
}
function handleFeedback(row) {
  id.value = row.id;
  taskId.value = row.taskId;
  getLicenseDetailById({ id: row.id }).then(res => {
    detailData.value = res.data;
  });
  proxy.$refs["feedbackRef"].show();
}
function handleSubmit(data) {
  getList();
}
function getDept() {
  listDept({ parentId: 1 }).then(response => {
    // outUnitOption.value = response.data
    // inUnitOption.value = response.data
    outUnitOption.value.push(...response.data);
    inUnitOption.value.push(...response.data);
    // roleList.value = response.rows;
    // total.value = response.total;
    // loading.value = false;
  });
}
watch(
  () => props.activeName,
  val => {
    // reset();
    getList();
  }
);
getDept();
getList();
</script>
