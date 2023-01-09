<!--
 * @FileDesc:典型案例
-->
<template>
  <div class="main p-4">
    <el-form :model="queryParams" ref="formRef" inline size="small">
      <el-form-item label="区域" prop="area">
        <el-select
          v-model="queryParams.area"
          placeholder="请选择区域"
          clearable
        >
          <el-option
            v-for="dict in areaOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="案例名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入案例名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in statusOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建方式" prop="createType">
        <el-select
          v-model="queryParams.createType"
          placeholder="请选择创建方式"
          clearable
        >
          <el-option
            v-for="dict in createTypeOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="createTime"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
          type="daterange"
          range-separator="至"
          start-placeholder="年-月-日"
          end-placeholder="年-月-日"
          @change="onChangeCreateTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button icon="Plus" @click="handleEdit">新建案例管理</el-button>
      </el-form-item>
    </el-form>

    <wt-table
      ref="wtTableList"
      operation="view,edit,del"
      :params="queryParams"
      api="casesListApi"
      :columns="columns"
      :isDataV="false"
      @handleDelete="handleDelete"
      @handleView="handleView"
      @handleEdit="handleEdit"
    >
      <template #fileListSlot="{ scope }">
        <el-link @click="onPreview(scope.row?.fileList?.[0].url)">
          {{ scope.row?.fileList?.[0].url }}
        </el-link>
      </template>
    </wt-table>
  </div>

  <editDialog
    v-model="showEdit"
    v-if="showEdit"
    :isEdit="isEdit"
    :id="editId"
    @refresh="handleQuery"
  />

  <el-dialog v-model="showImagePreview" fullscreen align="center">
    <ImagePreview :src="pathImagePreview" />
  </el-dialog>
</template>

<script setup>
import api from "@/api";
import editDialog from "./components/editDialog";
import { areaOpts, statusOpts, createTypeOpts } from "./dictionary";
import { ElMessageBox } from "element-plus";
import $api from "@/api";

const { proxy } = getCurrentInstance();
const queryParams = ref({
  area: "",
  title: "",
  status: "",
  createType: "",
  createBy: "",
  beginTime: "",
  endTime: ""
});
const createTime = ref([]);
const wtTableList = ref(null);
const refresh = () => {
  wtTableList.value.refreshData();
};
const handleQuery = () => {
  refresh();
};
const resetQuery = () => {
  queryParams.value = {
    area: "",
    title: "",
    status: "",
    createType: "",
    createBy: "",
    beginTime: "",
    endTime: ""
  };
  createTime.value = [];
  refresh();
};
const onChangeCreateTime = val => {
  if (val.length) {
    queryParams.value.beginTime = val[0];
    queryParams.value.endTime = val[1];
  } else {
    queryParams.value.beginTime = "";
    queryParams.value.endTime = "";
  }
};

let showEdit = ref(false);
let editId = ref("");
let isEdit = ref(true);
// 编辑弹窗
const handleEdit = row => {
  isEdit.value = true;
  editId.value = row.id;
  showEdit.value = true;
};

const handleView = row => {
  isEdit.value = false;
  editId.value = row.id;
  showEdit.value = true;
};

const handleDelete = row => {
  ElMessageBox.alert("确定要删除该条数据?", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: cases => {
      if (cases === "confirm") {
        $api.casesDeleteApi({ id: row.id }).then(res => {
          if (res.code == 200) {
            proxy.$modal.msgSuccess("删除成功");
            wtTableList.value.refreshData();
          }
        });
      }
    }
  });
};

const columns = ref([
  {
    title: "地区",
    dataIndex: "area",
    formatter(row) {
      return areaOpts.find(item => item.value === row.area)?.label;
    }
  },
  {
    title: "主题",
    dataIndex: "title"
  },
  {
    title: "状态",
    dataIndex: "status",
    formatter(row) {
      return statusOpts.find(item => item.value === row.status)?.label;
    }
  },
  {
    title: "列表图片",
    dataIndex: "fileList",
    formatter(row) {
      return row.fileList?.[0]?.fileName;
    },
    slot: "fileListSlot"
  },
  {
    title: "创建方式",
    dataIndex: "createType",
    formatter(row) {
      return createTypeOpts.find(item => item.value === row.createType)?.label;
    }
  },
  {
    title: "创建人",
    dataIndex: "createBy"
  },
  {
    title: "创建时间",
    dataIndex: "createTime"
  }
]);

const showImagePreview = ref(false);
const pathImagePreview = ref("");
const onPreview = url => {
  showImagePreview.value = true;
  pathImagePreview.value = url;
};
</script>
