<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 15:20:35
 * @LastEditTime: 2022-10-31 17:40:07
 * @LastEditors: xkloveme
 * @Description: 点位管理
 * @FilePath: /js-web/src/views/data/point/index.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main p-4">

    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item prop="spzt">
        <el-select v-model="queryParams.area" placeholder="地区" size="small" clearable style="width: 200px">
          <el-option v-for="dict in dqArr" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="queryParams.projectName" placeholder="项目名称" clearable size="small" style="width: 210px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="queryParams.projectContent" placeholder="项目简介" clearable size="small" style="width: 210px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="总投资额">
        <el-input-number :min="1" v-model="queryParams.investTotalStart" placeholder="" clearable size="small" style="width: 120px"
          @keyup.enter="handleQuery" />至
        <el-input-number :min="1" v-model="queryParams.investTotalEnd" placeholder="" clearable size="small" style="width: 120px"
          @keyup.enter="handleQuery" />元
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="Plus" size="small" @click="handleXm">新建项目</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <wt-table ref="wtTableList" :params="queryParams" api="getPmdProjectList" :columns="newColumns" :isDataV="false">
      <!-- 监督检查 -->
      <template #countInfo="{ scope }">
        <el-button v-if="scope.row.countInfo" size="small" type="text" @click="handleJdjc(scope.row)">{{
            scope.row.countInfo
        }}</el-button>
        <div v-else size="small">{{ scope.row.countInfo }}</div>
      </template>
      <!-- 问题清单 -->
      <template #countProblem="{ scope }">
        <el-button v-if="scope.row.countProblem" size="small" type="text" @click="handleWtqd(scope.row)">{{
            scope.row.countProblem
        }}</el-button>
        <div v-else size="small">{{ scope.row.countProblem }}</div>
      </template>
      <template #action="{ scope }">
        <el-button size="small" type="text" @click="handleDetail(scope.row)">详情</el-button>
        <el-button v-if="area==scope.row.area" size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" type="text" @click="handlDelete(scope.row)">删除</el-button>
        <el-button size="small" type="text" @click="handleAddJdjc(scope.row)">新增监督检查</el-button>
      </template>
    </wt-table>
  </div>
  <jdjcdetailDialog v-model="showDetailJdjc" :projectId="jdjcId" :jdarea="jdarea" @refresh="handleQuery" />
  <wtqdDialog v-model="showWtqd" :wtqdArr="wtqdArr" :wtqdId="wtqdId" @refresh="handleQuery" />
  <xmDialog v-model="showXm" :title="title" :isEdit="isEdit" :isDelet="isDelet" :projectId="projectId"
    @refresh="handleQuery" />
  <jdjcDialog v-model="showJdjc" :projectId="spId" @refresh="handleQuery" />
</template>

<script setup>
import $api from "@/api";
import { columns } from "./components/table.js";
import xmDialog from "./components/xmDialog";
import jdjcdetailDialog from "./components/jdjcdetailDialog";
import wtqdDialog from "./components/wtqdDialog";
import jdjcDialog from "./components/jdjcDialog";
import { ElMessageBox } from "element-plus";
import { queryParams2FormData } from "@/utils/ruoyi";
const { proxy } = getCurrentInstance();
// tabs

const handleClick = (tab, event) => {
  handleQuery();
};

const { lajw_ft_swgz_content } = proxy.useDict("lajw_ft_swgz_content");

// 弹窗
let area = ref(null);
let jdarea = ref(null);
let showDetailJdjc = ref(false);
let showWtqd = ref(false);
let showXm = ref(false);
let showJdjc = ref(false);
let editId = ref('');
let title = ref('');
const store = useStore();
const user = computed(() => store.state.user.user);

// 查询内容

const data = reactive({
  form: {},
  queryParams: {
    area: '',
    projectName: '',
    projectContent: '',
    investTotalStart: null,
    investTotalEnd: null
  },
  rules: {}
});
const dateRange = ref([]);
onMounted(() => {
  if (user?.value?.area  == "嘉善") {
      area.value = "0";
    } else if (user?.value?.area  == "吴江") {
      area.value = "1";
    } else if (user?.value?.area  == "青浦") {
      area.value = "2";
    }
});

// 待办页面入口 自动条件过滤
const { spzt, spkssj, spjssj, content } = queryParams2FormData(
  "spzt",
  "spkssj",
  "spjssj",
  "content"
);
data.queryParams.spzt = spzt;
if (spkssj && spjssj) {
  data.queryParams.spkssj = spkssj;
  data.queryParams.spjssj = spjssj;
  dateRange.value = [spkssj, spjssj];
}
data.queryParams.content = content;

const { queryParams, form, rules } = toRefs(data);

const { lajw_ft_swgz_spzt } = proxy.useDict("lajw_ft_swgz_spzt");
const { lajw_ft_swgz_spjg } = proxy.useDict("lajw_ft_swgz_spjg");
const { lajw_ft_swgz_fkjg } = proxy.useDict("lajw_ft_swgz_fkjg");

const newColumns = columns(
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
);
let isEdit = ref(true)
let isDelet = ref(true)
const dqArr = [
  {
    value: 0,
    label: '嘉善'
  },
  {
    value: 1,
    label: '吴江'
  },
  {
    value: 2,
    label: '青浦'
  }
]
const unitOption = ref([]);
// $api.listDept({ parentId: 1, deptName: "" }).then(response => {
//   unitOption.value = response.data;
// });

function handleDateChange(dateString) {
  queryParams.value.spjssj = dateString[0];
  queryParams.value.spkssj = dateString[1];
}

// 查询方法
const wtTableList = ref(null);
const refresh = () => {
  wtTableList.value.refreshData();
};
// 发起审批
const handleXm = row => {
  title.value = '新增'
  projectId.value = ''
  isEdit.value = true
  isDelet.value = true
  showXm.value = true;
};

const sp = ref({
  name: "",
  taskId: ""
});
// 详情
let projectId = ref('');
function handleDetail(row) {
  title.value = "详情"
  isEdit.value = false
  isDelet.value = false
  projectId.value = row.projectId
  showXm.value = true;
}
// 修改
function handleEdit(row) {
  title.value = "编辑"
  isEdit.value = true
  isDelet.value = true
  projectId.value = row.projectId
  showXm.value = true;
}
const fk = ref({});
// 反馈
function handleFk(row) {
  fk.value = row;
  showWtqd.value = true;
}
const jdjcArr = ref([]);
function handleJdjc(row) {
  jdjcId.value = row.projectId;
  jdarea.value = row.area;
  showDetailJdjc.value = true;
  $api.getProjectListInfoByProjectId({ projectId: row.projectId }).then(response => {
    jdjcArr.value = response.data;
  });
}
const wtqdArr = ref([]);
let wtqdId = ref('');
function handleWtqd(row) {
  wtqdId.value = row.projectId;
  showWtqd.value = true;
  $api.getProjectListProblemByProjectId({ projectId: row.projectId }).then(response => {
    wtqdArr.value = response.data;
  });
}
// 删除
function handlDelete(row) {
  ElMessageBox.alert("确定要删除该项目?", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        $api
          .deletePmdProjectDetail(row)
          .then(res => {
            if (res.code == 200) {
              proxy.$modal.msgSuccess("删除成功！");
              handleQuery();
            }
          });
      }
    }
  });
}
let spId = ref("");
let jdjcId = ref("");
// 审批记录
function handleAddJdjc(row) {
  spId.value = row.projectId;
  showJdjc.value = true;
}
/** 搜索按钮操作 */
function handleQuery() {
  if ((data.queryParams.investTotalStart && !data.queryParams.investTotalEnd) || (!data.queryParams.investTotalStart && data.queryParams.investTotalEnd)) {
    proxy.$modal.msgError("请填写完整总投资额！");
  } else {
    refresh();
  }
}
/** 重置按钮操作 */
function resetQuery() {
  //   proxy.resetForm('queryRef');
  queryParams.value = {
    area: null,
    projectName: null,
    projectContent: null,
    investTotalStart: null,
    investTotalEnd: null
  };
  refresh();
}
</script>

<style lang="scss" scoped>

</style>
