<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="派驻机构/监督单位" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 240px"
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
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column
        label="派驻机构/镇（街道）纪（工）委"
        align="center"
        prop="deptName"
        width="300"
      />
      <el-table-column label="监督单位" prop="unit" align="center">
        <template #default="scope">
          <span
            v-for="(item, index) in scope.row.childDept"
            :key="index"
            style="margin-right: 20px"
          >
            <span v-html="item.deptName"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            icon="Edit"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" v-model="open" width="800px" append-to-body>
      <el-checkbox-group v-model="checkedList">
        <el-checkbox
          :label="item.deptId"
          v-for="(item, index) in getJddwList"
          :key="index"
          >{{ item.deptName }}</el-checkbox
        >
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getUnitList, getJddw, editDept } from "@/api/system/unit";
const { proxy } = getCurrentInstance();
const roleList = ref([]);
const loading = ref(true);
const open = ref(false);
const data = reactive({
  queryParams: {
    deptName: ""
  }
});
const { queryParams, form, rules } = toRefs(data);
const getJddwList = ref([]);
const checkedList = ref([]);
const deptId = ref(0);
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 查询角色列表 */
function getList() {
  loading.value = true;
  getUnitList(queryParams.value).then(res => {
    roleList.value = res.rows;
    loading.value = false;
  });
}
// 修改
function handleEdit(row) {
  deptId.value = row.deptId;
  checkedList.value = [];
  row.childDept.map(item => {
    checkedList.value.push(item.deptId);
  });
  getJddw().then(res => {
    open.value = true;
    getJddwList.value = res.data;
  });
}
// 确定修改
function submitForm() {
  editDept({ deptId: deptId.value, childIds: checkedList.value }).then(() => {
    open.value = false;
    getList();
  });
}
getList();
</script>
