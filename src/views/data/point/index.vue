<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 15:20:35
 * @LastEditTime: 2022-11-09 16:01:01
 * @LastEditors: xkloveme
 * @Description: 点位管理
 * @FilePath: /js-web/src/views/data/point/index.vue
 * @Copyright © xkloveme
-->
<template>
  <div class="main p-4">
    <!-- 查询内容 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item prop="area">
        <el-select v-model="queryParams.area" placeholder="区域" size="small" clearable style="width: 200px">
          <el-option label="全部" value="" />
          <el-option v-for="dict in culture_map_area" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="name">
        <el-input v-model="queryParams.name" placeholder="点位名称" clearable size="small" style="width: 200px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="queryParams.type" placeholder="点位类型" size="small" clearable style="width: 200px">
          <el-option label="全部" value="" />
          <el-option label="场馆" value="场馆" />
          <el-option label="村居" value="村居" />
          <el-option label="学校" value="学校" />
        </el-select>
      </el-form-item>
      <el-form-item prop="line">
        <el-select v-model="queryParams.line" placeholder="线路类型" size="small" clearable style="width: 200px">
          <el-option v-for="dict in culture_map_line" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="address">
        <el-input v-model="queryParams.address" placeholder="详细地址" clearable size="small" style="width: 210px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button icon="Plus" size="small" @click="handleAdd">新增点位</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <wt-table ref="wtTableList" operation="view,edit,del" :params="queryParams" api="pointsListApi"
      :columns="newColumns" @handleDelete="handleDelete" @handleView="handleView" @handleEdit="handleEdit"
      :isDataV="false">
    </wt-table>
  </div>
  <editDialog v-model="showEdit" :isEdit="isEdit" :id="editId" @refresh="handleQuery" />
</template>

<script setup>
import $api from "@/api";
import { columns } from "./components/table.js";
import editDialog from "./components/editDialog";
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();


const { culture_map_area } = proxy.useDict("culture_map_area");
const { culture_map_line } = proxy.useDict("culture_map_line");

// 弹窗
let showEdit = ref(false);

// 查询内容

const data = reactive({
  form: {},
  queryParams: {
    area: null,
    name: null,
    type: null, //状态
    line: null, //单位
    address: null, //审批结果
  },
  rules: {}
});
const dateRange = ref([]);


const { queryParams, form, rules } = toRefs(data);


const newColumns = columns();


// 查询方法
const wtTableList = ref(null);
const refresh = () => {
  wtTableList.value.refreshData();
};
let editId = ref('')
let isEdit = ref(true)
// 编辑弹窗
function handleEdit (row) {
  editId.value = row.id
  isEdit.value = true
  showEdit.value = true;
}
function handleAdd(){
  editId.value = ''
  isEdit.value = true
  showEdit.value = true;
}

function handleView (row) {
  isEdit.value = false
  editId.value = row.id
  showEdit.value = true;
}

// 删除
function handleDelete (row) {
  ElMessageBox.alert("确定要删除该条数据?", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        $api
          .pointDeleteApi({ id: row.id })
          .then(res => {
            if (res.code == 200) {
              proxy.$modal.msgSuccess("删除成功");
              wtTableList.value.refreshData();
            }
          });
      }
    }
  });
}

/** 导出按钮操作 */
function handleExport () {
  proxy.download("jwFtNotarization/export", {
    params: { ...queryParams.value, pageNum: null, pageSize: null }
  });
}
/** 搜索按钮操作 */
function handleQuery () {
  refresh();
}
/** 重置按钮操作 */
function resetQuery () {
  //   proxy.resetForm('queryRef');
  queryParams.value = {
    area: null,
    name: null,
    type: null, //状态
    line: null, //单位
    address: null, //审批结果
  };
  dateRange.value = [];
  refresh();
}
</script>

<style lang="scss" scoped>

</style>
