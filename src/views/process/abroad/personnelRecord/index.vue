<template>
  <div style="padding: 20px 5px">
    <el-card>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="83px"
      >
        <el-form-item label="姓名" prop="xm">
          <el-input
            style="width: 180px"
            v-model="queryParams.xm"
            placeholder="请输入姓名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input
            style="width: 180px"
            v-model="queryParams.sfzh"
            placeholder="请输入身份证号"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="备案状态" prop="bazt">
          <el-select
            v-model="queryParams.bazt"
            placeholder="请选择备案状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in ft_ryba_zt"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5"> </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="small" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              size="small"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" size="small" @click="handleImport"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" size="small" @click="handleExport"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              size="small"
              :disabled="multiple"
              @click="handlePlfqba"
              >批量发起备案</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              size="small"
              :disabled="multiple"
              @click="handlePlcxba"
              >批量撤销备案</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="small" @click="handleQuery"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button size="small" @click="reset">重置</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column
            label="姓名"
            align="center"
            prop="xm"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="出生日期"
            align="center"
            prop="csrq"
            width="160"
          >
            <template #default="scope">
              <span>{{ scope.row.csrq.substring(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            align="center"
            prop="xb"
            width="80"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column
            label="身份证号"
            align="center"
            prop="sfzh"
            width="150"
            :show-overflow-tooltip="true"
          /> -->
          <el-table-column
            label="工作单位"
            align="center"
            prop="gzdw"
            width="180"
          />
          <el-table-column
            label="职务（级）或职称"
            align="center"
            prop="zj"
            width="150"
          />
          <el-table-column
            label="人事主管单位"
            align="center"
            prop="rszgdw"
            width="120"
          />
          <!-- <el-table-column
            label="户口所在地"
            align="center"
            prop="hkszd"
            width="120"
          /> -->
          <el-table-column label="备案状态" align="center" prop="bazt">
            <template #default="scope">
              <dict-tag :options="ft_ryba_zt" :value="scope.row.bazt" />
            </template>
          </el-table-column>
          <el-table-column label="申请状态" align="center" prop="sqzt">
            <template #default="scope">
              {{ sqztOption[scope.row.sqzt] }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="handleDetail(scope.row)"
                >查看</el-button
              >
              <el-button
                size="small"
                type="text"
                icon="el-icon-edit"
                v-if="
                  scope.row.bazt == 0 &&
                  (scope.row.sqzt == 0 || scope.row.sqzt == 2)
                "
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="text"
                icon="el-icon-delete"
                v-if="
                  scope.row.bazt == 0 &&
                  (scope.row.sqzt == 0 || scope.row.sqzt == 2)
                "
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                size="small"
                type="text"
                icon="el-icon-key"
                v-if="scope.row.bazt == 0 && scope.row.sqzt != 1"
                @click="handleFqba(scope.row)"
                >发起备案</el-button
              >
              <el-button
                size="small"
                type="text"
                v-if="scope.row.bazt == 3 && scope.row.sqzt != 1"
                icon="el-icon-key"
                @click="handleCxba(scope.row)"
                >撤销备案</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="margin-right: 20px"
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-form>
    </el-card>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="xm">
              <el-input
                v-model="form.xm"
                placeholder="请输入姓名"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填表日期" prop="createTime">
              <el-date-picker
                :disabled="isDisabled"
                v-model="form.createTime"
                style="width: 160px"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="date"
                placeholder="选择填表日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="csrq">
              <el-date-picker
                v-model="form.csrq"
                :disabled="isDisabled"
                value-format="YYYY-MM-DD"
                style="width: 160px"
                type="date"
                placeholder="选择出生日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="xb">
              <el-radio-group v-model="form.xb" :disabled="isDisabled">
                <el-radio :label="'男'">男</el-radio>
                <el-radio :label="'女'">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证" prop="sfzh">
              <el-input
                v-model="form.sfzh"
                :disabled="isDisabled"
                placeholder="请输入身份证"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="gzdw">
              <el-input
                :disabled="isDisabled"
                v-model="form.gzdw"
                placeholder="请输入工作单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职务（级）或职称" prop="zj">
              <el-input
                :disabled="isDisabled"
                v-model="form.zj"
                placeholder="请输入职务（级）或职称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人事主管单位" prop="rszgdw">
              <el-input
                v-model="form.rszgdw"
                :disabled="isDisabled"
                placeholder="请输入人事主管单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户口所在地" prop="hkszd">
              <el-input
                :disabled="isDisabled"
                v-model="form.hkszd"
                placeholder="请输入户口所在地"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备案状态" prop="bazt">
              <el-select
                :disabled="isDisabled"
                v-model="form.bazt"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in baAddOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否区管干部" prop="gb">
              <el-radio-group :disabled="isDisabled" v-model="form.gb">
                <el-radio :label="'是'">是</el-radio>
                <el-radio :label="'否'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input
                :disabled="isDisabled"
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" v-if="!isDisabled" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-link
        type="primary"
        :underline="false"
        style="font-size: 12px; vertical-align: baseline"
        @click="importTemplate"
        >下载模板</el-link
      >
      <span>文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得超过10M</span>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="true"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button
        style="margin-top: 12px; margin-left: 12px"
        @click="upload.open = false"
        >取消</el-button
      >
    </el-dialog>

    <!-- 发起备案 -->
    <el-dialog :title="title1" v-model="open1" width="800px" append-to-body>
      <h3>确定要选择该人员发起备案申请吗？</h3>
      审批人员：
      <el-tag v-if="userName" class="ml-2" type="success">{{
        userName
      }}</el-tag>
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="10" :xs="24">
          <div style="height: 800px; overflow: scroll">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="10" :xs="24">
          <el-form
            :model="queryParams2"
            ref="queryRef"
            :inline="true"
            label-width="90px"
          >
            <el-row :gutter="20">
              <el-col :span="18" :xs="24">
                <el-form-item label="审批人员" prop="userName">
                  <el-input
                    v-model="queryParams2.userName"
                    placeholder="审批人员"
                    clearable
                    size="small"
                    style="width: 120px"
                    @keyup.enter="handleQuery1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" :xs="12">
                <el-form-item style="margin-top: 4px">
                  <el-button
                    type="primary"
                    icon="Search"
                    size="small"
                    @click="handleQuery1"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table :data="spOptions" @current-change="handleCurrentChange">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="审批人员"
              align="center"
              key="userName"
              prop="userName"
            />
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm1">确 定</el-button>
          <el-button @click="cancel1">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 撤销备案 -->
    <el-dialog :title="title2" v-model="open2" width="800px" append-to-body>
      <h3>确定要选择该人员撤销备案申请吗？</h3>
      审批人员：<el-tag v-if="userName" class="ml-2" type="success">{{
        userName
      }}</el-tag>
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="10" :xs="24">
          <div style="height: 700px; overflow: scroll">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="10" :xs="24">
          <el-form
            :model="queryParams2"
            ref="queryRef"
            :inline="true"
            label-width="90px"
          >
            <el-row :gutter="20">
              <el-col :span="18" :xs="24">
                <el-form-item label="审批人员" prop="userName">
                  <el-input
                    v-model="queryParams2.userName"
                    placeholder="审批人员"
                    clearable
                    size="small"
                    style="width: 120px"
                    @keyup.enter="handleQuery1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" :xs="12">
                <el-form-item style="margin-top: 4px">
                  <el-button
                    type="primary"
                    icon="Search"
                    size="small"
                    @click="handleQuery1"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table :data="spOptions" @current-change="handleCurrentChange">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="审批人员"
              align="center"
              key="userName"
              prop="userName"
            />
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm2">确 定</el-button>
          <el-button @click="open2 = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量发起备案 -->
    <el-dialog
      :title="title3"
      v-model="open3"
      width="800px"
      style="height: 500px; overflow: scroll"
      height="700px"
      append-to-body
    >
      <h3>确定要发起姓名为{{ userIds.toString() }}的备案申请吗？</h3>
      审批人员：<el-tag v-if="userName" class="ml-2" type="success">{{
        userName
      }}</el-tag>
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="10" :xs="24">
          <div style="height: 700px; overflow: scroll">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="10" :xs="24">
          <el-form
            :model="queryParams2"
            ref="queryRef"
            :inline="true"
            label-width="90px"
          >
            <el-row :gutter="20">
              <el-col :span="18" :xs="24">
                <el-form-item label="审批人员" prop="userName">
                  <el-input
                    v-model="queryParams2.userName"
                    placeholder="审批人员"
                    clearable
                    size="small"
                    style="width: 120px"
                    @keyup.enter="handleQuery1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" :xs="12">
                <el-form-item style="margin-top: 4px">
                  <el-button
                    type="primary"
                    icon="Search"
                    size="small"
                    @click="handleQuery1"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table :data="spOptions" @current-change="handleCurrentChange">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="审批人员"
              align="center"
              key="userName"
              prop="userName"
            />
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm3">确 定</el-button>
          <el-button @click="cancel3">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量撤销备案 -->
    <el-dialog :title="title4" v-model="open4" width="800px" append-to-body>
      <h3>确定要撤销姓名为{{ userIds1.toString() }}的备案申请吗？</h3>
      审批人员：<el-tag v-if="userName" class="ml-2" type="success">{{
        userName
      }}</el-tag>
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="10" :xs="24">
          <div style="height: 700px; overflow: scroll">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="10" :xs="24">
          <el-form
            :model="queryParams2"
            ref="queryRef"
            :inline="true"
            label-width="90px"
          >
            <el-row :gutter="20">
              <el-col :span="18" :xs="24">
                <el-form-item label="审批人员" prop="userName">
                  <el-input
                    v-model="queryParams2.userName"
                    placeholder="审批人员"
                    clearable
                    size="small"
                    style="width: 120px"
                    @keyup.enter="handleQuery1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" :xs="12">
                <el-form-item style="margin-top: 4px">
                  <el-button
                    type="primary"
                    icon="Search"
                    size="small"
                    @click="handleQuery1"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table :data="spOptions" @current-change="handleCurrentChange">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="审批人员"
              align="center"
              key="userName"
              prop="userName"
            />
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm4">确 定</el-button>
          <el-button @click="cancel4">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
const { proxy } = getCurrentInstance();
import {
  listRyFt,
  getRyFt,
  addRyFt,
  updateRyFt,
  delRyFt,
  importDataRyFt,
  exportRyFt,
  applyActRyba,
  listRyba,
  getRyba,
  addRyba,
  updateRyba,
  delRyba,
  exportRyba
} from "@/api/people/ry";

const total = ref(0);
const total1 = ref(0);
const open = ref(false);
const open1 = ref(false);
const isAdd = ref(false);
const open2 = ref(false);
const open3 = ref(false);
const open4 = ref(false);
const loading = ref(false);
const deptOptions = ref(undefined);
const loading1 = ref(false);
let active = ref(0);
const current = ref(0);
const ids = ref([]);
const names = ref([]);
const single = ref(true);
const multiple = ref(true);
const multiple1 = ref(true);
const userList = ref([]);
const userName = ref("");
const isDisabled = ref(true);
const deptName = ref("");
const title = ref("");
const deptId = ref("");
const title1 = ref("");
const title2 = ref("");
const title3 = ref("");
const title4 = ref("");
const userIds = ref("");
const userIds1 = ref("");
const userIds2 = ref("");
const userIds3 = ref([]);
const { ft_ryba_zt } = proxy.useDict("ft_ryba_zt");
const sqztOption = { 0: "未发起", 1: "已发起", 2: "已结束" };
const baAddOption = [
  { label: "未备案", value: "0" },
  { label: "已备案", value: "3" }
];
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 1,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/data/ft/ry/importData"
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    scenesName: "",
    ruleName: ""
  },
  queryParams2: {
    pageNum: 1,
    pageSize: 100,
    deptId: "",
    userName: ""
  },
  typeOptions: [],
  spOptions: [],
  rules: {
    xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    csrq: [{ required: true, message: "出生日期不能为空", trigger: "blur" }],
    xb: [{ required: true, message: "性别不能为空", trigger: "blur" }],
    sfzh: [
      {
        pattern:
          /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
        required: true,
        message: "请输入正确的身份证号",
        trigger: "blur"
      }
    ],
    gzdw: [{ required: true, message: "工作单位不能为空", trigger: "blur" }],
    zj: [
      { required: true, message: "职务（级）或职称不能为空", trigger: "blur" }
    ],
    rszgdw: [
      { required: true, message: "人事主管单位不能为空", trigger: "blur" }
    ],
    hkszd: [{ required: true, message: "户口所在地不能为空", trigger: "blur" }],
    gb: [{ required: true, message: "是否区管干部不能为空", trigger: "blur" }],
    bazt: [{ required: true, message: "备案状态不能为空", trigger: "blur" }]
    // zj: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  }
});
const { queryParams, queryParams2, form, typeOptions, rules, spOptions } =
  toRefs(data);
// function handleClick(tab, event) {
//   console.log(tab, event);
// }
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
// 搜索按钮
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
function handleQuery1() {
  getListUser();
}
function handleAdd() {
  proxy.resetForm("userRef");
  isDisabled.value = false;
  reset1();
  open.value = true;
  title.value = "新增人员";
}
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listRyFt(queryParams.value).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total.value = res.total;
  });
}
function getListUser() {
  spOptions.value = [];
  listUser(proxy.addDateRange(queryParams2.value)).then(res => {
    res.rows.map(n => {
      spOptions.value.push({ userName: n.userName, userId: n.userId });
    });
  });
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/data/ft/ry/importTemplate",
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}
/** 重置操作表单 */
function reset() {
  queryParams.value = {
    xm: undefined,
    sfzh: undefined,
    bazt: undefined,
    pageNum: 1,
    pageSize: 10
  };
  getList();
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset1();
}
function reset1() {
  form.value = {
    xm: undefined,
    tbrq: undefined,
    csrq: undefined,
    xb: undefined,
    sfzh: undefined,
    gzdw: undefined,
    zj: undefined,
    rszgdw: undefined,
    hkszd: undefined,
    bazt: undefined,
    gb: undefined,
    remark: undefined
  };
  open.value = false;
}
// 查看
function handleDetail(row) {
  proxy.resetForm("userRef");
  isDisabled.value = true;
  const id = row.id;
  getRyFt(id).then(response => {
    form.value = response.data;
    form.value.bazt = response.data.bazt + "";
    // form.value.gb = (response.data.gb);
    open.value = true;
    title.value = "查看";
  });
}
// 修改
function handleUpdate(row) {
  proxy.resetForm("userRef");
  // reset();
  isDisabled.value = false;
  const id = row.id;
  getRyFt(id).then(response => {
    form.value = response.data;
    form.value.bazt = response.data.bazt + "";
    // form.value.gb = Number(response.data.gb);
    open.value = true;
    title.value = "修改";
  });
}
function handleCurrentChange(val) {
  console.log(val, 99999);
  userName.value = val.userName;
}
// 删除按钮
function handleDelete(row) {
  // const userIds = row.xm || (userIds.value).toString();
  const userIds = row.xm || names.value;
  proxy.$modal
    .confirm('是否确认删除用户姓名为"' + userIds + '"的数据项？')
    .then(function () {
      return delRyFt(userIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
function handleImport() {
  active.value = 0;
  upload.title = "用户导入";
  upload.open = true;
}
// 导出
function handleExport() {
  proxy.download("data/ft/ry/export");
}
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  names.value = selection.map(item => item.xm);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
function handleSelectionChange1(selection) {
  userIds2.value = selection.map(item => item.userName).toString();
  multiple1.value = !selection.length;
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams2.value.userName = "";
  queryParams2.value.deptId = data.id;
  getListUser();
}
/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
}
// 发起备案
function handleFqba(row) {
  userName.value = "";
  queryParams2.value.deptId = "";
  getListUser();
  queryParams2.value.userName = "";
  userIds3.value = [];
  userIds3.value.push(row.id);
  open1.value = true;
  title1.value = "发起备案";
}
// 撤销备案
function handleCxba(row) {
  userIds3.value = [];
  userName.value = "";
  queryParams2.value.deptId = "";
  getListUser();
  queryParams2.value.userName = "";
  userIds3.value.push(row.id);
  open2.value = true;
  title2.value = "撤销备案";
}
function submitForm() {
  // if (!form.value.xm) {
  //   proxy.$modal.msgError('姓名不能为空！');
  // } else if (!form.value.csrq) {
  //   proxy.$modal.msgError('出生日期不能为空！');
  // } else if (!form.value.xb) {
  //   proxy.$modal.msgError('性别不能为空！');
  // } else if (!form.value.sfzh) {
  //   proxy.$modal.msgError('身份证号不能为空！');
  // } else if (!form.value.gzdw) {
  //   proxy.$modal.msgError('工作单位不能为空！');
  // } else if (!form.value.zj) {
  //   proxy.$modal.msgError('职务（级）或职称不能为空！');
  // } else if (!form.value.rszgdw) {
  //   proxy.$modal.msgError('人事主管单位不能为空！');
  // } else if (!form.value.hkszd) {
  //   proxy.$modal.msgError('户口所在地不能为空！');
  // } else if (!form.value.bazt) {
  //   proxy.$modal.msgError('备案状态不能为空！');
  // } else {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateRyFt(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRyFt(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
  // }
}
// 发起备案的提交
function submitFileForm1() {
  if (userName.value) {
    applyActRyba({
      applyType: 0,
      ryidList: userIds3.value,
      approver: userName.value
    }).then(n => {
      if (n.code == 200) {
        open1.value = false;
        userIds2.value = "";
        // userIds3.value = [];
        userName.value = "";
        getList();
        proxy.$modal.msgSuccess("成功发起备案！");
      }
    });
  } else {
    proxy.$modal.msgSuccess("请选择审批人员！");
  }
}
function cancel1() {
  open1.value = false;
  userIds2.value = "";
  // userIds3.value = [];
  userName.value = "";
}
// 撤销备案
function submitFileForm2() {
  if (userName.value) {
    applyActRyba({
      applyType: 1,
      ryidList: userIds3.value,
      approver: userName.value
    }).then(n => {
      if (n.code == 200) {
        open2.value = false;
        userIds2.value = "";
        userName.value = "";
        // userIds3.value = [];
        getList();
        proxy.$modal.msgSuccess("成功撤销备案！");
      }
    });
  } else {
    proxy.$modal.msgSuccess("请选择审批人员！");
  }
}
function cancel2() {
  open2.value = false;
  userIds2.value = "";
  // userIds3.value = [];
  userName.value = "";
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
// 批量发起备案
function submitFileForm3() {
  if (userName.value) {
    applyActRyba({
      applyType: 0,
      ryidList: ids.value,
      approver: userName.value
    }).then(n => {
      if (n.code == 200) {
        open3.value = false;
        userIds2.value = "";
        ids.value = [];
        userName.value = "";
        getList();
        proxy.$modal.msgSuccess("操作成功！");
      }
    });
  } else {
    proxy.$modal.msgSuccess("请选择审批人员！");
  }
}
function cancel3() {
  open3.value = false;
  userIds2.value = "";
  ids.value = [];
  userName.value = "";
}
// 批量撤销备案
function submitFileForm4() {
  if (userName.value) {
    applyActRyba({
      applyType: 1,
      ryidList: ids.value,
      approver: userName.value
    }).then(n => {
      if (n.code == 200) {
        open4.value = false;
        userIds2.value = "";
        ids.value = [];
        userName.value = "";
        getList();
        proxy.$modal.msgSuccess("操作成功！");
      }
    });
  } else {
    proxy.$modal.msgSuccess("请选择审批人员！");
  }
}
function cancel4() {
  open4.value = false;
  userIds2.value = "";
  ids.value = [];
  userName.value = "";
}
// 批量发起备案
function handlePlfqba() {
  userName.value = "";
  queryParams2.value.deptId = "";
  getListUser();
  queryParams2.value.userName = "";
  userIds.value = names.value;
  open3.value = true;
  title3.value = "批量发起备案";
}
// 批量撤销备案
function handlePlcxba() {
  userName.value = "";
  queryParams2.value.deptId = "";
  getListUser();
  queryParams2.value.userName = "";
  userIds1.value = names.value;
  open4.value = true;
  title4.value = "批量撤销备案";
}
// 下一步
function next() {
  if (active.value++ > 2) active.value = 0;
}
// 进度条
function format(percentage) {
  return percentage === 100 ? "满" : `${percentage}%`;
}
//
function handleStatusChange() {}
getList();
getTreeselect();
getListUser();
</script>
<style lang="scss" scoped></style>
