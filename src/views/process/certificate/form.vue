<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="queryParams.dateRange"
          size="small"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="deptId" v-if="checkRole(['QGGBZGY', 'admin'])">
        <el-select
          v-model="queryParams.deptId"
          placeholder="全部工作单位"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in unitOption"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="zhzt">
        <el-select
          v-model="queryParams.zhzt"
          placeholder="状态"
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
      <el-form-item label="" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="姓名/身份证号码/申请编号/提交人"
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
          @click="handleAdd"
          v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
          >发起办(补)证</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" size="small" @click="handleExport"
          >批量导出</el-button
        >
      </el-col> -->
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList">
      <el-table-column
        label="申请编号"
        prop="sqbh"
        width="180"
        align="center"
      />
      <el-table-column label="姓名" prop="name" width="150" align="center" />
      <el-table-column
        label="身份证号"
        prop="sfzh"
        width="200"
        align="center"
      />
      <el-table-column
        label="工作单位"
        prop="employer"
        width="150"
        align="center"
      />
      <el-table-column label="职务" prop="zw" width="150" align="center" />
      <el-table-column label="证照类型" prop="zzlx" width="150" align="center">
        <template #default="scope">
          {{ getLicenseList(scope.row.zzlx) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="zhzt" width="150" align="center">
        <template #default="scope">
          {{ statusOption[scope.row.zhzt]?.label }}
        </template>
      </el-table-column>
      <el-table-column
        label="提交人"
        prop="createBy"
        width="150"
        align="center"
      />
      <el-table-column
        label="提交时间"
        prop="createTime"
        width="180"
        align="center"
      />
      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.zhzt == 1 && props.activeName === 'dwcl'"
            size="small"
            type="text"
            @click="handleCheck(scope.row)"
            >核查信息</el-button
          >
          <el-button
            v-if="
              (scope.row.zhzt == 1 || scope.row.zhzt == 2) &&
              (props.activeName === 'dwcl' || props.activeName === 'qbxx') &&
              !checkRole(['QGAFJCRJGLK'])
            "
            size="small"
            type="text"
            @click="handleCallBack(scope.row)"
            >撤销</el-button
          >
          <el-button
            v-if="scope.row.zhzt == 2 && props.activeName === 'dwcl'"
            size="small"
            type="text"
            @click="handleRetry(scope.row)"
            >重新发起</el-button
          >
          <el-button
            v-if="
              checkRole(['QGAFJCRJGLK']) &&
              scope.row.zhzt == 3 &&
              props.activeName == 'dwcl'
            "
            size="small"
            type="text"
            @click="handleConfirm(scope.row)"
            >确认制作完成</el-button
          >
          <el-button
            v-if="
              checkRole(['QGGBZGY', 'FQGGBZGY']) &&
              ((props.activeName == 'dwcl' && scope.row.zhzt == 4) ||
                (props.activeName == 'qbxx' && scope.row.zhzt == 3))
            "
            size="small"
            type="text"
            @click="handleWarehousing(scope.row)"
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
    <AddDialog ref="addRef" @ok="getList" />
    <CheckDialog
      ref="checkRef"
      @ok="getList"
      :sqbh="sqbh"
      :taskId="taskId"
      :detailData="detailData"
    />
    <ConfirmDialog
      ref="confirmRef"
      @ok="getList"
      :taskId="taskId"
      :detailData="detailData"
    />
    <WarehousingDialog
      ref="warehousingRef"
      @ok="getList"
      :sqbh="sqbh"
      :taskId="taskId"
      :detailData="detailData"
    />
    <RetryDialog
      ref="retryRef"
      @ok="getList"
      :taskId="taskId"
      :sqbh="sqbh"
      :detailData="detailData"
    />
  </div>
</template>
<script setup>
import { listDept } from "@/api/system/dept";
import {
  listBbzMystart,
  listBbzMyHandle,
  listBbzWaitForMy,
  getBbzDetail,
  postCallBackProcess,
  listBbzSelectAll
} from "@/api/certificate/index";
import { getUserInfo } from "@/api/abroad/index.js";
import AddDialog from "./components/addDialog";
import CheckDialog from "./components/checkDialog";
import ConfirmDialog from "./components/confirmDialog";
import WarehousingDialog from "./components/warehousingDialog";
import RetryDialog from "./components/retryDialog";
import { checkRole } from "@/utils/permission.js";
import { ElMessageBox } from "element-plus";
import { queryParams2FormData } from "@/utils/ruoyi";
const router = useRouter();
const total = ref(0);
const loading = ref(true);
const { proxy } = getCurrentInstance();
const detailData = ref({});
const sqbh = ref("");
const taskId = ref("");
const props = defineProps({
  activeName: {
    type: String,
    default: "dwcl"
  }
});
const roleList = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dateRange: [],
    zhzt: null, //状态
    deptId: null, //单位
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
const { zhzt, content } = queryParams2FormData("zhzt", "content");
data.queryParams.zhzt = zhzt;
data.queryParams.content = content;

const { queryParams, form, rules } = toRefs(data);
const statusOption = [
  { label: "全部状态", value: null },
  { label: "待核查", value: "1" },
  { label: "核查驳回", value: "2" },
  { label: "制作中", value: "3" },
  { label: "待入库", value: "4" },
  { label: "已入库", value: "5" },
  { label: "已撤销", value: "6" }
];
const unitOption = ref([
  { deptName: "全部工作单位", deptId: null }
  // { deptName: '单位', deptId: 1 }
]);
/** 查询角色列表 */
function getList() {
  if (queryParams.value.dateRange.length != 0) {
    queryParams.value.spkssj = queryParams.value.dateRange[0];
    queryParams.value.spjssj = queryParams.value.dateRange[1];
  }
  loading.value = true;
  if (props.activeName == "dwcl") {
    listBbzWaitForMy(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else if (props.activeName == "wycl") {
    listBbzMyHandle(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else if (props.activeName == "wfqd") {
    listBbzMystart(queryParams.value).then(response => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  } else {
    listBbzSelectAll(queryParams.value).then(response => {
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
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    dateRange: [],
    zhzt: null,
    deptId: null,
    content: undefined // 模糊搜索
  };
  handleQuery();
}
function getDept() {
  listDept({ parentId: 1 }).then(response => {
    unitOption.value.push(...response.data);
  });
}
function handleAdd() {
  proxy.$refs["addRef"].show();
}
function handleExport() {}
function handleDetail(row) {
  router.push({
    path: "/process/certificateDetail",
    query: { sqbh: row.sqbh, zhzt: row.zhzt }
  });
}
// 核查信息
function handleCheck(row) {
  sqbh.value = row.sqbh;
  taskId.value = row.taskId;
  proxy.$refs["checkRef"].show();
  getBbzDetail({ sqbh: row.sqbh }).then(res => {
    detailData.value = res.data;
  });
}
// 撤销
function handleCallBack(row) {
  ElMessageBox.alert(`确认撤销编号为${row.sqbh}的办（补）证？`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "温馨提示",
    callback: action => {
      if (action === "confirm") {
        postCallBackProcess({ sqbh: row.sqbh }).then(res => {
          proxy.$modal.msgSuccess("撤销成功");
          getList();
        });
      }
    }
  });
}
// 重新发起
function handleRetry(row) {
  taskId.value = row.taskId;
  sqbh.value = row.sqbh;
  proxy.$refs["retryRef"].show();
  getBbzDetail({ sqbh: row.sqbh }).then(res => {
    detailData.value = res.data;
  });
}
// 确认制作完成
function handleConfirm(row) {
  taskId.value = row.taskId;
  proxy.$refs["confirmRef"].show();
  getBbzDetail({ sqbh: row.sqbh }).then(res => {
    detailData.value = res.data;
  });
}
//证照入库
function handleWarehousing(row) {
  sqbh.value = row.sqbh;
  taskId.value = props.activeName == "dwcl" ? row.taskId : undefined;
  proxy.$refs["warehousingRef"].show();
  getBbzDetail({ sqbh: row.sqbh }).then(res => {
    detailData.value = res.data;
  });
}
function getLicenseList(str) {
  let arr = str.split(",");
  let result = [];
  arr.map(item => {
    if (item == "10") {
      result.push("普通护照");
    } else if (item == "20") {
      result.push("台湾通行证");
    } else if (item == "30") {
      result.push("港澳通行证");
    }
  });
  return result.toString();
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
