<template>
  <div style="padding: 15px 20px 20px">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 200px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="全部状态"
          size="small"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in statusOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="companyName"
        v-if="checkRole(['admin', 'QGGBZGY', 'FQGGBZGY', 'QGAFJCRJGLK'])"
      >
        <el-select
          v-model="queryParams.companyName"
          placeholder="全部工作单位"
          size="small"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in unitOption"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptName"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="backStatus">
        <el-select
          v-model="queryParams.backStatus"
          placeholder="是否有驳回"
          size="small"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in backOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="certStatus">
        <el-select
          v-model="queryParams.certStatus"
          placeholder="证照退还"
          size="small"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in licenseExitOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="appIdOrCreateBy">
        <el-input
          v-model="queryParams.appIdOrCreateBy"
          placeholder="申请编号/提交人"
          clearable
          size="small"
          style="width: 200px"
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
          @click="handleAdd"
          v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
          >发起退出监察范围</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList">
      <el-table-column
        label="申请编号"
        prop="apply_code"
        width="180"
        align="center"
      />
      <el-table-column
        label="退出人数(人)"
        prop="out_num"
        width="180"
        align="center"
      />
      <el-table-column
        label="驳回人数(人)"
        prop="back_num"
        width="180"
        align="center"
      />
      <el-table-column label="状态" prop="status" width="180" align="center">
        <template #default="scope">
          {{ statusOption[scope.row.status].label
          }}{{
            scope.row.status == 2 && scope.row.backnum > 0 ? "(待退还证照)" : ""
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="提交单位"
        prop="dept_name"
        width="180"
        align="center"
      />
      <el-table-column
        label="提交人"
        prop="create_by"
        width="180"
        align="center"
      />
      <el-table-column
        label="提交时间"
        prop="create_time"
        width="180"
        align="center"
      />
      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="handleRetry(scope.row)"
            v-if="scope.row.status == 0 && checkRole(['QGGBZGY', 'FQGGBZGY'])"
            >继续发起</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="handleFeedback(scope.row)"
            v-if="scope.row.status == 1 && checkRole(['QGAFJCRJGLK'])"
            >反馈</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="handleCallBack(scope.row)"
            v-if="scope.row.status == 1 && checkRole(['QGGBZGY', 'FQGGBZGY'])"
            >撤销</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="handleReturn(scope.row)"
            v-if="
              scope.row.status == 2 &&
              scope.row.backnum > 0 &&
              checkRole(['QGGBZGY', 'FQGGBZGY'])
            "
            >退还证照</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <AddDialog ref="addRef" @ok="getList" />
    <EditDialog
      ref="editRef"
      @ok="getList"
      :id="id"
      :list="pensons"
      :file="fileList"
    />
    <BackCertDialog
      ref="backRef"
      @newList="getNewBackCert"
      @ok="getList"
      :list="cert"
    />
    <FeedbackDialog ref="feedbackRef" @ok="getList" :id="id" :list="pensons" />
  </div>
</template>
<script setup>
import {
  listExitSupervision,
  getDetailInfo,
  getListBackCert,
  postDel
} from "@/api/exitSupervision/index";
import { listDept } from "@/api/system/dept";
import AddDialog from "./components/addDialog";
import BackCertDialog from "./components/backCertDialog";
import FeedbackDialog from "./components/feedbackDialog";
import EditDialog from "./components/editDialog";
import { ElMessageBox } from "element-plus";
import { checkRole } from "@/utils/permission.js";
import { queryParams2FormData } from "@/utils/ruoyi";
const data = reactive({
  form: {},
  queryParams: {
    page: 1,
    pageSize: 10,
    status: null, //状态
    companyName: null, //单位
    backStatus: null, //有无驳回，1：有；2：无
    certStatus: null, //证书退还，1：待退回；2：已退回
    appIdOrCreateBy: undefined // 模糊搜索
  },
  rules: {
    roleName: [
      { required: true, message: "角色名称不能为空", trigger: "blur" }
    ],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  }
});
const dateRange = ref([]);

// 待办页面入口 自动条件过滤
const { status, startDate, endDate, certStatus, appIdOrCreateBy } =
  queryParams2FormData("status", "startDate", "endDate", "certStatus");
data.queryParams.status = status;
data.queryParams.certStatus = certStatus;
if (startDate && endDate) {
  data.queryParams.startDate = startDate;
  data.queryParams.endDate = endDate;
  dateRange.value = [startDate, endDate];
}
data.queryParams.appIdOrCreateBy = appIdOrCreateBy;

const { queryParams, form, rules } = toRefs(data);
const statusOption = [
  { label: "待提交撤销备案", value: "0" },
  { label: "待反馈", value: "1" },
  { label: "已反馈", value: "2" },
  { label: "已撤销", value: "3" }
];
const backOption = [
  { label: "有", value: 1 },
  { label: "无", value: 2 }
];
const licenseExitOption = [
  { label: "待退还", value: "1" },
  { label: "已退完", value: "2" }
];
const unitOption = ref([]);
const router = useRouter();
const { proxy } = getCurrentInstance();
const total = ref(0);
const loading = ref(true);
const roleList = ref([]);
const pensons = ref([]);
const fileList = ref([]);
const cert = ref([]);
const id = ref("");
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  //   proxy.resetForm('queryRef');
  queryParams.value = {
    page: 1,
    pageSize: 10,
    status: null,
    companyName: null,
    backStatus: null, //有无驳回，1：有；2：无
    certStatus: null, //证书退还，1：待退回；2：已退回
    appIdOrCreateBy: undefined // 模糊搜索
  };
  dateRange.value = [];
  handleQuery();
}
/** 查询角色列表 */
function getList() {
  if (dateRange.value.length) {
    queryParams.value.startDate = dateRange.value[0];
    queryParams.value.endDate = dateRange.value[1];
  }
  if (queryParams.value.companyName == "") {
    delete queryParams.value.companyName;
  }
  loading.value = true;
  listExitSupervision(queryParams.value).then(response => {
    roleList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}
function handleDetail(row) {
  router.push({
    path: "/process/exitSupervisionDetail",
    query: { id: row.id, apply_code: row.apply_code, status: row.status }
  });
}
// 发起退出监察范围
function handleAdd() {
  // isQg.value = true
  proxy.$refs["addRef"].show();
}
// 重新发起
function handleRetry(row) {
  id.value = row.id;
  getDetailInfo({ id: row.id }).then(res => {
    pensons.value = res.data.pensons;
    fileList.value = res.data.ossFile;
  });
  proxy.$refs["editRef"].show();
}
function getDept() {
  listDept({ parentId: 1 }).then(response => {
    unitOption.value.push(...response.data);
  });
}
// 反馈
function handleFeedback(row) {
  id.value = row.id;
  getDetailInfo({ id: row.id }).then(res => {
    pensons.value = res.data.pensons;
  });
  proxy.$refs["feedbackRef"].show();
}
// 撤销
function handleCallBack(row) {
  ElMessageBox.alert(`确认撤销编号为${row.apply_code}的退出监察范围申请？`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "温馨提示",
    callback: action => {
      if (action === "confirm") {
        postDel({ id: row.id }).then(res => {
          getList();
        });
      }
    }
  });
}
// 退还证照
function handleReturn(row) {
  id.value = row.id;
  proxy.$refs["backRef"].show();
  getListBackCert({ id: row.id }).then(res => {
    cert.value = res.data;
  });
}
function getNewBackCert() {
  getListBackCert({ id: id.value }).then(res => {
    cert.value = res.data;
  });
}
getDept();
getList();
</script>
