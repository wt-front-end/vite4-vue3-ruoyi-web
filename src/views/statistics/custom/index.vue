<template>
  <el-card>
    <el-form ref="formRef" :model="form" :inline="true">
      <el-form-item label="工作单位">
        <el-select
          v-model="form.deptId"
          placeholder="工作单位"
          style="width: 200px"
          collapse-tags
          multiple
          filterable
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期区间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button size="mini" @click="handleReset">重置</el-button>
        <el-button type="primary" size="mini" @click="handleExport"
          >导出</el-button
        ><el-button type="warning" size="mini" @click="handleField"
          >导出可筛选字段</el-button
        >
      </el-form-item>
    </el-form>
    <div v-if="tableData.length != 0" style="margin-top: 10px">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" width="55" align="center" />
        <el-table-column
          label="工作单位"
          prop="leader_name"
          align="center"
          width="320"
        />
        <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          :label="item.zn_comment"
          :prop="item.en_field"
          align="center"
        />
      </el-table>
    </div>
    <el-dialog title="选择筛选字段" v-model="showDialog" width="1000px">
      <div style="display: flex">
        <div
          style="
            width: 500px;
            height: 500px;
            overflow-y: scroll;
            overflow-x: hidden;
          "
        >
          <el-tree
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            ref="menuRef"
            @check="handleCheck"
          />
        </div>
        <div
          style="
            margin-left: 50px;
            width: 400px;
            height: 500px;
            overflow-y: scroll;
            overflow-x: hidden;
          "
        >
          <el-table
            ref="multipleTableRef"
            :data="searchTableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column label="字段内容">
              <template #default="scope">{{ scope.row.label }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="showDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
const { proxy } = getCurrentInstance();
import {
  getCustomTree,
  getCustomStatis,
  postCustomStatisExport
} from "@/api/statistics/index";
import { listDept } from "@/api/abroad/index.js";
const form = ref({});
const deptList = ref([]);
const dateRange = ref([]);
const showDialog = ref(false);
const menuRef = ref(null);
const searchTableData = ref([]);
const tableData = ref([]);
const columnList = ref([
  { label: "工作单位", prop: "gzdw" },
  { label: "总数", prop: "count" }
]);
const defaultProps = {
  children: "children",
  // label: "label"
  label: "znComment"
};
const treeData = ref([
  {
    znComment: "纳管人员数据统计",
    id: 100,
    children: []
  },
  {
    znComment: "区管干部数据统计",
    id: 200,
    children: []
  },
  {
    znComment: "非区管干部数据统计",
    id: 300,
    children: []
  }
]);
const treeData1 = ref([
  {
    label: "总数统计",
    id: 100,
    children: [
      {
        label: "出国(境)申请总数",
        id: 1
      },
      {
        label: "出国(境)审批通过总数",
        id: 2
      },
      {
        label: "出国(境)审批驳回总数",
        id: 3
      },
      {
        label: "出国(境)行程变更申请总数",
        id: 4
      },
      {
        label: "出国(境)行程变更审批通过总数",
        id: 5
      },
      {
        label: "出国(境)行程变更审批驳回总数",
        id: 6
      },
      {
        label: "出国(境)行程取消申请总数",
        id: 7
      },
      {
        label: "备案申请总数",
        id: 8
      },
      {
        label: "备案审批通过总数",
        id: 9
      },
      {
        label: "备案审批驳回总数",
        id: 10
      },
      {
        label: "备案撤销申请总数",
        id: 11
      },
      {
        label: "备案撤销审批通过总数",
        id: 12
      },
      {
        label: "备案撤销审批驳回总数",
        id: 13
      },
      {
        label: "证照核查申请总数",
        id: 14
      },
      {
        label: "证照核查审批通过总数",
        id: 15
      },
      {
        label: "证照核查审批驳回总数",
        id: 16
      },
      {
        label: "证照注销申请总数",
        id: 17
      },
      {
        label: "证照注销审批通过总数",
        id: 18
      },
      {
        label: "证照注销审批驳回总数",
        id: 19
      }
    ]
  },
  {
    label: "区管干部数据统计",
    id: 200,
    children: [
      {
        label: "区管出国(境)申请总数",
        id: 20
      },
      {
        label: "区管出国(境)审批通过总数",
        id: 21
      },
      {
        label: "区管出国(境)审批驳回总数",
        id: 22
      },
      {
        label: "区管出国(境)行程变更申请总数",
        id: 23
      },
      {
        label: "区管出国(境)行程变更审批通过总数",
        id: 24
      },
      {
        label: "区管出国(境)行程变更审批驳回总数",
        id: 25
      },
      {
        label: "区管出国(境)行程取消申请总数",
        id: 26
      },
      {
        label: "区管备案申请总数",
        id: 27
      },
      {
        label: "区管备案审批通过总数",
        id: 28
      },
      {
        label: "区管备案审批驳回总数",
        id: 29
      },
      {
        label: "区管备案撤销申请总数",
        id: 30
      },
      {
        label: "区管备案撤销审批通过总数",
        id: 31
      },
      {
        label: "区管备案撤销审批驳回总数",
        id: 32
      },
      {
        label: "区管证照注销申请总数",
        id: 33
      },
      {
        label: "区管证照注销审批通过总数",
        id: 34
      },
      {
        label: "区管证照注销审批驳回总数",
        id: 35
      }
    ]
  },
  {
    label: "非区管干部数据统计",
    id: 300,
    children: [
      {
        label: "非区管出国(境)申请总数",
        id: 36
      },
      {
        label: "非区管出国(境)审批通过总数",
        id: 37
      },
      {
        label: "非区管出国(境)审批驳回总数",
        id: 38
      },
      {
        label: "非区管出国(境)行程变更申请总数",
        id: 39
      },
      {
        label: "非区管出国(境)行程变更审批通过总数",
        id: 40
      },
      {
        label: "非区管出国(境)行程变更审批驳回总数",
        id: 41
      },
      {
        label: "非区管出国(境)行程取消申请总数",
        id: 42
      },
      {
        label: "非区管备案申请总数",
        id: 43
      },
      {
        label: "非区管备案审批通过总数",
        id: 44
      },
      {
        label: "非区管备案审批驳回总数",
        id: 45
      },
      {
        label: "非区管备案撤销申请总数",
        id: 46
      },
      {
        label: "非区管备案撤销审批通过总数",
        id: 47
      },
      {
        label: "非区管备案撤销审批驳回总数",
        id: 48
      },
      {
        label: "非区管证照注销申请总数",
        id: 49
      },
      {
        label: "非区管证照注销审批通过总数",
        id: 50
      },
      {
        label: "非区管证照注销审批驳回总数",
        id: 51
      }
    ]
  }
]);
function handleField() {
  searchTableData.value = [];
  treeData.value = [
    {
      znComment: "纳管人员数据统计",
      id: 100,
      children: []
    },
    {
      znComment: "区管干部数据统计",
      id: 200,
      children: []
    },
    {
      znComment: "非区管干部数据统计",
      id: 300,
      children: []
    }
  ];
  getTree();
  showDialog.value = true;
}
function handleReset() {
  form.value.deptId = null;
  form.value.startTime = "";
  form.value.endTime = "";
  dateRange.value = [];
  searchTableData.value = [];
  tableData.value = [];
}
const handleCheck = () => {
  idList.value = getMenuAllCheckedKeys();
  searchTableData.value = [];
  getCheckedItem(treeData.value);
};
const idList = ref([]);
function dateChange(date) {
  console.log(date, 88888);
  if (date == null) {
    form.value.startTime = "";
    form.value.endTime = "";
  } else {
    form.value.startTime = date[0];
    form.value.endTime = date[1];
  }
}
function handleSearch() {
  if (searchTableData.value.length == 0) {
    proxy.$modal.msgError("请先选择筛选字段");
    return;
  }
  let ids = searchTableData.value.map(item => {
    return item.id;
  });
  let params = {
    ids: ids,
    startTime: form.value.startTime,
    endTime: form.value.endTime
  };
  if (form.value.deptId.length !== 0) {
    params.leaderIds = form.value.deptId;
  }
  getCustomStatis(params).then(res => {
    showDialog.value = false;
    columnList.value = res.data.fieldList; // 表头
    tableData.value = res.data.dataList; // 数据
  });
}
function getCheckedItem(list) {
  for (let i = 0; i < list.length; i++) {
    let a = list[i];
    if (idList.value.includes(a.id) && a.id < 99) {
      searchTableData.value.push({ label: a.znComment, id: a.id });
    }
    if (a.children && a.children.length > 0) {
      getCheckedItem(a.children);
    }
  }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
function getTree() {
  getCustomTree().then(res => {
    for (let i = 0; i < res.rows.length; i++) {
      if (res.rows[i].groupType == 1) {
        treeData.value[0].children.push(res.rows[i]);
      } else if (res.rows[i].groupType == 2) {
        treeData.value[1].children.push(res.rows[i]);
      } else if (res.rows[i].groupType == 3) {
        treeData.value[2].children.push(res.rows[i]);
      }
    }
  });
}
function handleExport() {
  if (searchTableData.value.length == 0) {
    proxy.$modal.msgError("请先选择筛选字段");
    return;
  }
  let ids = searchTableData.value.map(item => {
    return item.id;
  });
  let params = {
    ids: ids,
    startTime: form.value.startTime,
    endTime: form.value.endTime
  };
  if (form.value.deptId.length !== 0) {
    params.leaderIds = form.value.deptId;
  }
  postCustomStatisExport(params).then(res => {
    // 创建 a 标签
    var alink = document.createElement("a");
    // 设置下载文件名,大部分浏览器兼容,IE10及以下不兼容
    alink.download = `自定义统计.xls`;
    // 将数据包装成 Blob
    var blob = new Blob([res]);
    // 根据 Blob 创建 URL
    alink.href = URL.createObjectURL(blob);
    // 将 a 标签插入到页面
    document.body.appendChild(alink);
    // 自动点击
    alink.click();
  });
}
function getDept() {
  listDept(1).then(response => {
    deptList.value = response.data;
  });
}
getDept();
// getTree();
</script>
