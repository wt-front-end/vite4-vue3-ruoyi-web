<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="部门状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          plain
          icon="Plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          size="small"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col> -->
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="deptName"
        label="部门名称"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="200"
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="200"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
            >修改</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="Plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="small"
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deptRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <tree-select
                v-model:value="form.parentId"
                :options="deptOptions"
                :objMap="{
                  value: 'deptId',
                  label: 'deptName',
                  children: 'children'
                }"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input
                v-model="form.leader"
                placeholder="请输入负责人"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入联系电话"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门全称" prop="employer">
              <el-input
                v-model="form.employer"
                placeholder="请输入部门全称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Dept">
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild
} from "@/api/system/dept";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const deptList = ref([]);
const tableDataCopy = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    deptName: undefined,
    status: undefined
  },
  rules: {
    parentId: [
      { required: true, message: "上级部门不能为空", trigger: "blur" }
    ],
    deptName: [
      { required: true, message: "部门名称不能为空", trigger: "blur" }
    ],
    orderNum: [
      { required: true, message: "显示排序不能为空", trigger: "blur" }
    ],
    email: [
      {
        type: "email",
        message: "'请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
function getList() {
  loading.value = true;
  listDept(queryParams.value).then(response => {
    // deptList.value = proxy.handleTree(response.rows, 'deptId');
    // deptList.value = response?.data[0].children || response.rows[0].children;
    let arr = [];
    if (response.data.length == 0) {
      arr = [];
    } else if (response.data[0].deptId == 1) {
      // 临安区
      arr = response.data[0].children;
    } else {
      arr = response.data;
    }
    tableDataCopy.value = arr; // 备份的全量数据
    deptList.value = JSON.parse(JSON.stringify(arr)).map(item => {
      // 展示数据
      // hasChildren 表示需要展示一个箭头图标
      item.hasChildren = item.children && item.children.length > 0;
      // 只展示一层
      // 如果有children数据，会自动加载，就不是懒加载了，也可以配置tree-props里面的children为其他字段
      item.children = null;
      // 记住层级关系
      item.idList = [item.deptId];
      return item;
    });
    loading.value = false;
    unload();
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    deptId: undefined,
    parentId: undefined,
    deptName: undefined,
    orderNum: 0,
    leader: undefined,
    phone: undefined,
    email: undefined,
    employer: undefined,
    status: "0"
  };
  proxy.resetForm("deptRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
async function handleAdd(row) {
  reset();
  await listDept().then(response => {
    // deptList.value = response.data||response.rows
    deptOptions.value = proxy.handleTree(
      response?.data[0].children || response.rows[0].children,
      "deptId"
    );
  });
  if (row != undefined) {
    form.value.parentId = row.deptId;
  }
  open.value = true;
  title.value = "添加部门";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await listDeptExcludeChild(row.deptId).then(response => {
    deptOptions.value = proxy.handleTree(response.data, "deptId");
  });
  getDept(row.deptId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改部门";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.deptId != undefined) {
        updateDept(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDept(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal
    .confirm('是否确认删除名称为"' + row.deptName + '"的数据项?')
    .then(function () {
      return delDept(row.deptId);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
// 展开
function load(tree, treeNode, resolve) {
  // 层级关系备份
  const idCopy = JSON.parse(JSON.stringify(tree.idList));
  // 查找下一层数据
  let resolveArr = tableDataCopy.value;
  let deptId;
  // eslint-disable-next-line
  while ((deptId = tree.idList.shift())) {
    const tarItem = resolveArr.find(item => item.deptId === deptId);
    tarItem.loadedChildren = true;
    resolveArr = tarItem.children;
  }
  // 处理下一层数据的属性
  resolveArr = JSON.parse(JSON.stringify(resolveArr));
  resolveArr.forEach(item => {
    item.hasChildren = item.children && item.children.length > 0;
    item.children = null;
    // 此处需要深拷贝，以防各个item的idList混乱
    item.idList = JSON.parse(JSON.stringify(idCopy));
    item.idList.push(item.deptId);
  });
  // 标识已经加载子节点
  tree.loadedChildren = true;
  // 渲染子节点
  resolve(resolveArr);
}
// 回到一层状态
function unload() {
  refreshTable.value = false;
  nextTick(() => {
    refreshTable.value = true;
  });
  deptList.value = JSON.parse(JSON.stringify(tableDataCopy.value)).map(item => {
    // hasChildren 表示需要展示一个箭头图标
    item.hasChildren = item.children && item.children.length > 0;
    // 只展示一层
    item.children = null;
    // 记住层级关系
    item.idList = [item.deptId];
    return item;
  });
}
getList();
</script>
