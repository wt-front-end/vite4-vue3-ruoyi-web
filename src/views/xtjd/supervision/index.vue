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
        <el-select v-model="queryParams.area" placeholder="发起方" size="small" clearable style="width: 200px">
          <el-option v-for="dict in dqArr" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间">
        <el-date-picker v-model="createTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable type="daterange"
          range-separator="至" start-placeholder="年-月-日" end-placeholder="年-月-日" @change="onChangeCreateTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="spzt">
        <el-select v-model="queryParams.participants" placeholder="参与方" size="small" clearable style="width: 200px">
          <el-option v-for="dict in dqArr" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="spzt">
        <el-select v-model="queryParams.supervisionType" placeholder="监督类型" size="small" clearable style="width: 200px">
          <el-option v-for="dict in supervisionTypeArr" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="queryParams.theme" placeholder="监督主题" clearable size="small" style="width: 210px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item prop="spzt">
        <el-select v-model="queryParams.status" placeholder="状态" size="small" clearable style="width: 200px">
          <el-option v-for="dict in stateArr" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="Plus" size="small" @click="handleXm">发起监督</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <wt-table ref="wtTableList" :params="queryParams" api="getCollaborativeSupervisionInfoList" :columns="newColumns"
      :isDataV="false">
      <template #action="{ scope }">
        <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
        <el-button size="small" type="text" v-if="scope.row.buttons['撤销']" @click="handlDelete(scope.row)">撤销
        </el-button>
        <el-button size="small" v-if="scope.row.buttons['上传检查结果']" type="text" @click="handleScjcjg(scope.row)">上传检查结果
        </el-button>
        <el-button size="small" v-if="scope.row.buttons['拒绝参与']" type="text" @click="handlRefuse(scope.row)">拒绝参与
        </el-button>
        <el-button size="small" v-if="scope.row.buttons['同意参与']" type="text" @click="handlAgree(scope.row)">同意参与
        </el-button>
      </template>
    </wt-table>
  </div>
  <detailDialog v-model="showDetail" :id="id" @refresh="handleQuery" />
  <agreeDialog v-model="showAgree" :agreeObj="agreeObj" @refresh="handleQuery" />
  <scjcjgDialog v-model="showScjcjg" :scjcjgObj="scjcjgObj" @refresh="handleQuery" />
  <xmDialog v-model="showXm" @refresh="handleQuery" />
</template>

<script setup>
import $api from "@/api";
import { columns } from "./components/table.js";
import xmDialog from "./components/xmDialog";
import detailDialog from "./components/detailDialog";
import agreeDialog from "./components/agreeDialog";
import scjcjgDialog from "./components/scjcjgDialog";
import { ElMessageBox } from "element-plus";
let { proxy } = getCurrentInstance();
// tabs
const store = useStore();
const user = computed(() => store.state.user.user);
let handleClick = (tab, event) => {
  handleQuery();
};

let { lajw_ft_swgz_content } = proxy.useDict("lajw_ft_swgz_content");

// 弹窗
let area = ref(null);
let showDetail = ref(false);
let showAgree = ref(false);
let showScjcjg = ref(false);
let showXm = ref(false);

// 查询内容

let data = reactive({
  form: {},
  queryParams: {
    area: '',
    participants: '',
    supervisionType: "",
    theme: "",
    status: '',
    launchTimeEnd: null,
    launchTimeEnd: null
  },
  rules: {}
});
let createTime = ref([]);


let { queryParams, form, rules } = toRefs(data);

let { lajw_ft_swgz_spzt } = proxy.useDict("lajw_ft_swgz_spzt");
let { lajw_ft_swgz_spjg } = proxy.useDict("lajw_ft_swgz_spjg");
let { lajw_ft_swgz_fkjg } = proxy.useDict("lajw_ft_swgz_fkjg");

let newColumns = columns(
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
);
let dqArr = [
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
let stateArr = [
  {
    value: 10,
    label: '发起中'
  },
  {
    value: 20,
    label: '进行中'
  },
  {
    value: 21,
    label: '整改中'
  },
  {
    value: 30,
    label: '已撤销'
  },
  {
    value: 40,
    label: '已完成'
  }
]
let supervisionTypeArr = ref([])

// 查询方法
let wtTableList = ref(null);
let refresh = () => {
  wtTableList.value.refreshData();
};
// 发起监督
function handleXm(row) {
  showXm.value = true;
};
onMounted(() => {
  $api.getPmdCollaborativesupervisionItem().then(response => {
    supervisionTypeArr.value = response.data;
  });
  if (user?.value?.area == "嘉善") {
    area.value = "0";
  } else if (user?.value?.area == "吴江") {
    area.value = "1";
  } else if (user?.value?.area == "青浦") {
    area.value = "2";
  }
});
// 详情
let id = ref('');
function handleDetail(row) {
  id.value = row.id
  showDetail.value = true;
}
// 撤销
function handlDelete(row) {
  ElMessageBox.alert("确定要撤销该条数据?", {
    confirmButtonText: "确认撤销",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        $api
          .getCollaborativeSupervisionInfoCancel(row)
          .then(res => {
            if (res.code == 200) {
              proxy.$modal.msgSuccess("撤销成功！");
              wtTableList.value.refreshData();
            }
          });
      }
    }
  });
}
// 拒绝参与
function handlRefuse(row) {
  ElMessageBox.alert("确定要拒绝参与?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    title: "拒绝参与",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        $api
          .getCollaborativeSupervisionInfoConfirmParticipateIn({
            id: row.id,
            area: area.value,
            number: "",
            participateIn: 0,
          })
          .then(res => {
            if (res.code == 200) {
              proxy.$modal.msgSuccess("操作成功！");
              wtTableList.value.refreshData();
            }
          });
      }
    }
  });
}
// 同意参与
let agreeObj = ref({})
function handlAgree(row) {
  agreeObj.value = row
  showAgree.value = true
}
// 上传检查结果
let scjcjgObj = ref({})
function handleScjcjg(row) {
  scjcjgObj.value = row
  showScjcjg.value = true
}
/** 搜索按钮操作 */
function handleQuery() {
  refresh();
}
const onChangeCreateTime = val => {
  if (val.length) {
    data.queryParams.launchTimeBegin = val[0];
    data.queryParams.launchTimeEnd = val[1];
  } else {
    data.queryParams.launchTimeBegin = "";
    data.queryParams.launchTimeEnd = "";
  }
};
/** 重置按钮操作 */
function resetQuery() {
  //   proxy.resetForm('queryRef');
  data.queryParams= {
    area: '', //地区
    projectName: null, //项目名称
    projectContent: null, //项目简介
    theme: null,
    status: null,
    launchTimeEnd: null,
    launchTimeEnd: null
  };
  createTime.value = [];
  refresh();
}
</script>

<style lang="scss" scoped>

</style>
