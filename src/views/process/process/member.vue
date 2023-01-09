<template>
  <el-card>
    <el-form ref="forms" :model="form" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="gzrq"
          @change="dateChange"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="全部状态">
        <el-select
          v-model="form.status"
          placeholder="全部状态"
          clearable
          size="small"
          style="width: 160px"
        >
          <template v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])">
            <el-option
              v-for="(item, key) in statusEnmus"
              :key="key"
              :label="item"
              :value="key"
            />
          </template>
          <template v-else>
            <el-option
              v-for="(item, key) in FstatusEnmus"
              :key="key"
              :label="item"
              :value="key"
            />
          </template>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="全部提交单位"> 
        <el-select
          v-model="form.tjUnit"
          placeholder="全部提交单位"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否有驳回">
        <el-select
          v-model="form.bohuiNum"
          placeholder="是否有驳回"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="(value, key) in isBack"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.searchValue"
          placeholder="申请编号/提交人"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleQuery"
          >查询</el-button
        >
        <el-button type="" size="small" @click="resetForm">重置</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button
              v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
              type="primary"
              size="small"
              @click="handleBeiAn"
              >发起人员备案</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="userList">
      <el-table-column
        header-align="center"
        align="center"
        prop="applyId"
        label="申请编号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="beianNum"
        label="备案人数(人)"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="bohuiNum"
        label="驳回人数(人)"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="状态">
        <template #default="scope">
          <span>{{ statusEnmus[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="tjUnit"
        label="提交单位"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="tjPerson"
        label="提交人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createTime"
        label="提交时间"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            v-if="scope.row.status !== 1"
            @click="applyDetail(scope.row.applyId)"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.status === 2 && checkRole(['QGAFJCRJGLK'])"
            size="small"
            type="text"
            @click="feedback(scope.row.applyId)"
            >反馈</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="delBack(scope.row)"
            v-if="
              (scope.row.status === 2 || scope.row.status === 1) &&
              checkRole(['QGGBZGY', 'FQGGBZGY'])
            "
            >撤销</el-button
          >
          <el-button
            size="small"
            type="text"
            @click="
              containAdd(scope.row.applyId) &&
                checkRole(['QGGBZGY', 'FQGGBZGY'])
            "
            v-if="scope.row.status === 1"
            >继续发起</el-button
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
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button
        style="margin-top: 12px; margin-left: 12px"
        @click="upload.open = false"
        >取消</el-button
      >
    </el-dialog>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="900px"
      :destroy-on-close="true"
    >
      <div class="w-100 flex-between">
        <el-button type="primary" @click="downTable">下载登记备案表</el-button>
        <el-button
          type="primary"
          @click="memberdialogVisible = !memberdialogVisible"
          >添加人员</el-button
        >
      </div>
      <el-table :data="memberList" style="width: 100%" class="mt-20">
        <el-table-column prop="name" label="姓名" width="width">
        </el-table-column>
        <el-table-column label="出生日期" width="200">
          <template #default="scope">
            {{ formDate(scope.row.birthday) }}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="width">
          <template #default="scope">
            {{ genderEnum[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column prop="fxzh" label="身份证号" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="工作单位" width="width">
        </el-table-column>
        <el-table-column prop="zw" label="职务" width="width">
        </el-table-column>
        <el-table-column prop="zgdw" label="人事主管单位" width="width">
        </el-table-column>
        <el-table-column prop="address" label="户口所在地" width="width">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              @click="delPerson(scope.row.id, scope.row.personId, index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="folderFormRef" :model="folderForm" class="mt-20">
        <el-form-item
          label="登记备案表"
          prop="fileList"
          :rules="{
            required: true,
            message: '请选择备案登记表',
            trigger: ['change', 'blur']
          }"
        >
          <wt-upload
            :fileList="fileList"
            @success="uploadSuccess"
            @remove="removeFile"
          ></wt-upload>
        </el-form-item>
      </el-form>
      <div class="flex-center mt-20">
        <el-button
          type="primary"
          @click="addReports(1)"
          :disabled="!memberList || memberList.length === 0"
          >暂存</el-button
        >
        <el-button
          type="primary"
          @click="addReports(2)"
          :disabled="!memberList || memberList.length === 0"
          >提交备案</el-button
        >
      </div>
      <!-- <el-form ref="form" :model="fileForm" label-width="100px" class="mt-20">
        <el-form-item
          label="登记备案表"
          prop="fileForm.file"
          :rules="{
            required: true,
            message: '请选择要上传的备案表',
            trigger: ['change', 'blur']
          }"
        >
          <UploadFile
            :fileType="['png', 'jpeg', 'excel', 'word', 'pdf']"
          ></UploadFile>
        </el-form-item>
      </el-form> -->
    </el-dialog>
    <el-dialog
      title="添加人员"
      v-model="memberdialogVisible"
      width="400px"
      :before-close="dialogBeforeClose"
    >
      <el-form :model="memberForm" label-suffix=":">
        <el-form-item label="人员">
          <el-select
            class="w-100"
            v-model="memberForm.name"
            placeholder="请选择未备案人员"
            filterable
            remote
            :remote-method="remoteMethod"
            @change="handleChangeName"
          >
            <el-option
              v-for="item in userInfoOptions"
              :key="item.id"
              :label="`${item.name}-${item.unit}-${item.zw}-${item.fxzh}`"
              :value="`${item.id}-${item.name}-${item.unit}`"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-row :gutter="10">
          <el-col :span="6">身份证号:</el-col>
          <el-col :span="18"></el-col>
        </el-row> -->
        <el-form-item label="身份证号"> {{ memberForm.fxzh }} </el-form-item>
        <el-form-item label="性别">
          {{ genderEnum[memberForm.sex] }}
        </el-form-item>
        <el-form-item label="手机号码"> {{ memberForm.phone }} </el-form-item>
        <el-form-item label="工作单位">
          {{ memberForm.unit }}
        </el-form-item>
        <el-form-item label="职务"> {{ memberForm.zw }} </el-form-item>
        <div class="flex-center">
          <el-button
            type="primary"
            @click="addPerson"
            :disabled="!memberForm.name"
            >添加</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="备案详情" v-model="detailDialogVisible" width="800px">
      <div class="flex-center">
        状态: {{ statusEnmus[memberDetail.status] }}
      </div>
      <div class="w-100 flex-between">
        <span>申请编号: {{ memberDetail.applyId }}</span>
        <div class="flex-center">
          <el-button
            type="primary"
            @click="exportFailPerson(memberDetail.applyId)"
            >导出备案失败人员</el-button
          >
          <el-button
            type="primary"
            @click="exportAllPerson(memberDetail.applyId)"
            >导出全部人员</el-button
          >
        </div>
      </div>
      <el-table
        :data="memberDetail.personList"
        style="width: 100%"
        class="mt-20"
      >
        <el-table-column prop="name" label="姓名" width="width">
        </el-table-column>
        <el-table-column label="出生日期" width="200">
          <template #default="scope">
            <span>{{ formDate(scope.row.birthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="width">
          <template #default="scope">
            <span>{{ genderEnum[scope.row.sex] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fxzh" label="身份证号" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="工作单位" width="width">
        </el-table-column>
        <el-table-column prop="zw" label="职务" width="width">
        </el-table-column>
        <el-table-column prop="zgdw" label="人事主管单位" width="width">
        </el-table-column>
        <el-table-column prop="address" label="户口所在地" width="width">
        </el-table-column>
        <el-table-column prop="result" label="备案结果" width="width">
        </el-table-column>
        <el-table-column prop="remack" label="备注" width="width">
        </el-table-column>
      </el-table>
      <div class="flex-column-start mt-20">
        <div>登记备案表</div>
        <ul class="mt-20">
          <li
            v-for="(item, index) in fileList"
            :key="index"
            class="flex-between text-red mb-10"
            style="width: 300px"
          >
            <span class="el-icon-document"> {{ item.name }}</span>
            <el-link :href="item.url" target="_blank" :underline="false">
              <span class="text-primary">下载</span>
            </el-link>
          </li>
        </ul>
      </div>
      <div class="flex-column-start mt-20" v-if="memberDetail.approveOperList">
        <span>审批记录</span>

        <span
          class="mt-20"
          v-for="(item, index) in memberDetail.approveOperList"
          :key="index"
          >{{ filterTime(item.time) }} {{ item.unit }} {{ item.name }}
          {{ item.type }}</span
        >
      </div>
    </el-dialog>
    <el-dialog
      title="反馈备案结果"
      v-model="feedbackDialogVisible"
      width="800px"
    >
      <!-- <el-button type="primary">导入备案反馈表</el-button> -->
      <el-table :data="feedbackList" style="width: 100%" class="mt-20">
        <el-table-column prop="name" label="姓名" width="width">
        </el-table-column>
        <el-table-column label="出生日期" width="200">
          <template #default="scope">
            <span>{{ formDate(scope.row.birthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="width">
          <template #default="scope">
            <span>{{ genderEnum[scope.row.sex] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fxzh" label="身份证号" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="工作单位" width="width">
        </el-table-column>
        <el-table-column prop="zw" label="职务" width="width">
        </el-table-column>
        <el-table-column prop="zgdw" label="人事主管单位" width="width">
        </el-table-column>
        <el-table-column prop="address" label="户口所在地" width="width">
        </el-table-column>
        <el-table-column label="备案结果" width="200">
          <template #default="scope">
            <el-select v-model="scope.row.result" placeholder="请选择">
              <el-option
                v-for="(item, key) in feedbackEnmus"
                :key="key"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200">
          <template #default="scope">
            <el-input
              placeholder="请输入备注"
              v-model="scope.row.remack"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-center mt-20">
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  watch
} from "vue";
import { getToken } from "@/utils/auth";
import {
  listReport,
  addMemberReport,
  delMemberReport,
  getMemberDetail,
  getNotBaList,
  addContinueReport,
  getFeedBackList,
  addFeedback,
  backMemberList,
  exportReportPerson,
  downdFile
} from "@/api/process/member.js";
import { getUserInfo } from "@/api/abroad/index.js";
// import UploadFile from '@/components/FileUpload/index.vue';
import { checkRole } from "@/utils/permission.js";
import { queryParams2FormData } from "@/utils/ruoyi";
export default defineComponent({
  name: "index",
  props: {},
  // components: { UploadFile },
  setup() {
    const form = reactive({
      // 待办页面入口 自动条件过滤
      ...queryParams2FormData("status", "beginTime", "endTime", "searchValue")
    });
    const loading = ref(false);
    const folderForm = reactive({});
    const statusType = ref(0);
    const applyId = ref("");
    const gzrq = ref([]);
    if (form.beginTime && form.endTime) {
      gzrq.value = [form.beginTime, form.endTime];
    }

    const notBeiList = ref([]);
    const userList = ref([]);
    const transList = ref([]);
    const memberList = ref([]);
    const nortanForm = reactive([]);
    let memberForm = reactive({});
    const isZan = ref("");
    let memberDetail = ref({});
    const userInfoOptions = ref([]);
    const isBack = { 0: "否", 1: "是" };
    const fileList = ref([]);
    const statusEnmus = {
      1: "待提交备案",
      2: "待反馈",
      3: "已反馈",
      4: "已撤销"
    };
    const FstatusEnmus = {
      2: "待反馈",
      3: "已反馈",
      4: "已撤销"
    };
    const genderEnum = { 0: "男", 1: "女", 2: "未知" };
    const timer = ref("");
    const feedbackId = ref("");
    const recordList = reactive([]);
    //添加人员
    const memberdialogVisible = ref(false);
    //详情
    const detailDialogVisible = ref(false);
    const feedbackList = ref([]);
    // 反馈
    const feedbackDialogVisible = ref(false);
    const feedbackEnmus = {
      0: "已备案",
      1: "备案失败"
    };
    const dynamicValidateForm = reactive({
      xm: "",
      sfzh: "",
      domains: []
    });
    // 发起备案
    const dialogVisible = ref(false);
    const title = ref("发起备案");
    const total = ref(0);
    let active = ref(1);
    const { proxy } = getCurrentInstance();
    const data = reactive({
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {},
      queryFormRules: {}
    });
    const { queryParams, queryForm } = toRefs(data);
    const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
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
    function backOut() {
      active.value = 1;
    }
    function exportFailPerson() {
      proxy.download(`/ryba/person/export/1/${applyId.value}`);
    }
    function exportAllPerson() {
      proxy.download(`/ryba/person/export/0/${applyId.value}`);
    }
    function filterTime(time) {
      let newTime;
      if (time) {
        const times = time.split(" ")[0];
        const headTime = time.split(" ")[0].split("-")[0];
        newTime = times.replace(headTime, new Date().getFullYear());
      }
      const endTime = time.split(" ")[1];
      const approveTime = newTime + " " + endTime;
      return approveTime;
    }
    function remoteMethod(query) {
      if (query) {
        const parmas = {
          name: query
        };
        clearTimeout(timer.value);
        timer.value = setTimeout(() => {
          getNotBaList(parmas).then(res => {
            userInfoOptions.value = res.rows;
          });
        }, 500);
      }
    }
    function addForm() {
      dynamicValidateForm.domains.push({
        xm: "",
        sfzh: ""
      });
    }
    function downTable() {
      downdFile(memberList.value).then(res => {
        proxy.$download.link(res.msg);
      });
    }
    function restesForms() {
      memberForm.name = "";
      memberForm.fxzh = "";
      memberForm.sex = "";
      memberForm.phone = "";
      memberForm.unit = "";
      memberForm.zgdw = "";
      memberForm.zw = "";
      memberForm.birthday = "";
      memberForm.address = "";
      memberForm.personId = "";
    }
    function delBack(row) {
      proxy.$modal
        .confirm(
          `当前待提交备案人数为 ${row.beianNum} 人,确认撤销编号为${row.applyId}的备案申请?`
        )
        .then(function () {})
        .then(() => {
          backMemberList(row.applyId).then(res => {
            getList();
            memberList.value = [];
            restesForms();
          });
        })
        .catch(() => {});
    }
    function applyDetail(id) {
      detailDialogVisible.value = !detailDialogVisible.value;
      applyId.value = id;
      getMemberDetail(id).then(res => {
        memberDetail.value = res.data;
        folderForm.fileList = res.data.fileList;
        if (res.data.fileList && res.data.fileList.length > 0) {
          fileList.value = res.data.fileList.map(item => {
            return {
              url: JSON.parse(item.fileName).url
                ? JSON.parse(item.fileName).url
                : "",
              name: JSON.parse(item.fileName).name
            };
          });
        }
      });
    }
    function containAdd(id) {
      dialogVisible.value = !dialogVisible.value;
      applyId.value = id;
      statusType.value = 1;
      title.value = "继续发起备案";
      memberList.value = [];
      addContinueReport(id).then(res => {
        memberList.value = res.data.personList;
        folderForm.fileList = res.data.fileList;
        if (res.data.fileList && res.data.fileList.length > 0) {
          fileList.value = res.data.fileList.map(item => {
            return {
              url: JSON.parse(item.fileName).url
                ? JSON.parse(item.fileName).url
                : "",
              name: JSON.parse(item.fileName).name
            };
          });
        }
      });
    }
    function formDate(dates) {
      let date = new Date(dates);
      const year = date.getFullYear();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return dates ? year + "-" + month + "-" + day : "";
    }
    function uploadSuccess(e) {
      fileList.value = Object.values(e);
      folderForm.fileList = fileList.value.map(item => {
        return { fileName: JSON.stringify({ url: item.url, name: item.name }) };
      });
      proxy.$refs["folderFormRef"].clearValidate("fileList");
    }
    function removeFile(e) {
      fileList.value = Object.values(e);
      folderForm.fileList = fileList.value.map(item => {
        return { fileName: JSON.stringify({ url: item.url, name: item.name }) };
      });
    }
    function addPerson() {
      const params = JSON.parse(JSON.stringify(memberForm));
      const isExit = memberList.value.some(item => {
        return params.personId == item.personId;
      });
      if (isExit) {
        proxy.$modal.msgError("该人员已存在列表中!");
        return;
      } else {
        memberList.value.push(params);
        userInfoOptions.value = [];
        restesForms();
      }
      memberdialogVisible.value = !memberdialogVisible.value;
    }
    function submitFeedback() {
      addFeedback(feedbackId.value, feedbackList.value).then(res => {
        feedbackDialogVisible.value = !feedbackDialogVisible.value;
        getList();
      });
    }
    function dateChange(e) {
      form.beginTime = formDate(e[0]);
      form.endTime = formDate(e[1]);
    }
    function handleQuery() {
      queryParams.value.pageNum = 1;
      getList();
    }
    function delPerson(id, personId, index) {
      if (statusType.value === 1 && id) {
        delMemberReport(id, personId).then(res => {
          proxy.$modal.msgSuccess("删除成功");
          memberList.value.splice(index, 1);
          getList();
        });
      } else {
        memberList.value.splice(index, 1);
      }
    }
    function saveHandler() {
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          // 请求

          active.value = 2;
          proxy.resetForm("queryFormRef");
        }
      });
    }
    function resetForm() {
      form.beginTime = undefined;
      form.endTime = undefined;
      form.searchValue = undefined;
      form.status = undefined;
      form.bohuiNum = undefined;
      gzrq.value = undefined;
      getList();
    }
    function getList() {
      loading.value = true;
      const parmas = Object.assign(queryParams.value, form);
      listReport(parmas).then(res => {
        loading.value = false;
        userList.value = res.rows;
        total.value = res.total;
      });
    }
    function handleBeiAn() {
      dialogVisible.value = !dialogVisible.value;
      statusType.value = 0;
      title.value = "发起备案";
    }
    function handleChangeName(stringName) {
      let name = stringName.split("-")?.[1];
      const selectInfo = userInfoOptions.value.find(item => {
        return item.name === name;
      });
      memberForm.name = name;
      memberForm.fxzh = selectInfo.fxzh;
      memberForm.sex = selectInfo.sex;
      memberForm.phone = selectInfo.phone;
      memberForm.unit = selectInfo.unit;
      memberForm.zgdw = selectInfo.zgdw;
      memberForm.zw = selectInfo.zw;
      memberForm.birthday = selectInfo.birthday;
      memberForm.address = selectInfo.address;
      memberForm.personId = selectInfo.personId;
    }
    function addReports(value) {
      const parmas = {
        personList: memberList.value,
        status: value,
        fileList: folderForm.fileList,
        applyId: statusType.value === 1 ? applyId.value : undefined
      };
      if (value === 2) {
        proxy.$refs["folderFormRef"].validate(valid => {
          if (valid) {
            addMemberReport(parmas).then(res => {
              dialogVisible.value = !dialogVisible.value;
              memberList.value = [];
              fileList.value = [];
              getList();
            });
          }
        });
      } else {
        addMemberReport(parmas).then(res => {
          dialogVisible.value = !dialogVisible.value;
          memberList.value = [];
          fileList.value = [];
          getList();
        });
      }
    }
    function feedback(id) {
      feedbackDialogVisible.value = !feedbackDialogVisible.value;
      feedbackId.value = id;
      getFeedBackList(id).then(res => {
        feedbackList.value = res.rows;
      });
    }
    function handleImport() {
      upload.title = "用户导入";
      upload.open = true;
    }
    // 导出
    function handleExport() {
      proxy.download("data/ft/ry/export");
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
    };
    getList();
    watch(
      [detailDialogVisible, dialogVisible],
      nval => {
        const isClose = nval.some(item => {
          return item == false;
        });
        if (isClose) {
          memberList.value = [];
          fileList.value = [];
        }
      },
      { deep: true }
    );
    return {
      feedbackId,
      dialogVisible,
      queryParams,
      queryForm,
      userList,
      title,
      total,
      loading,
      form,
      sys_normal_disable,
      upload,
      dynamicValidateForm,
      active,
      nortanForm,
      memberList,
      transList,
      memberForm,
      memberdialogVisible,
      timer,
      detailDialogVisible,
      feedbackList,
      feedbackDialogVisible,
      recordList,
      notBeiList,
      userInfoOptions,
      statusEnmus,
      memberDetail,
      feedbackEnmus,
      gzrq,
      isBack,
      genderEnum,
      applyId,
      FstatusEnmus,
      statusType,
      fileList,
      folderForm,
      isZan,
      filterTime,
      delBack,
      submitFeedback,
      feedback,
      containAdd,
      applyDetail,
      addReports,
      delPerson,
      addPerson,
      handleQuery,
      getList,
      remoteMethod,
      backOut,
      addForm,
      ...toRefs(data),
      handleImport,
      handleExport,
      handleFileUploadProgress,
      handleFileSuccess,
      saveHandler,
      downTable,
      dateChange,
      handleBeiAn,
      handleChangeName,
      formDate,
      resetForm,
      exportFailPerson,
      exportAllPerson,
      checkRole,
      restesForms,
      uploadSuccess,
      removeFile
    };
  }
});
</script>

<style scoped lang="scss">
/* 页面布局 */
.w-100 {
  width: 100%;
}
:deep(.inner-input) {
  .el-input__inner {
    width: 230px;
  }
}
:deep(.el-step.is-simple .el-step__icon) {
  display: none;
}
:deep(.checkbox-inner.el-checkbox) {
  margin-right: 250px;
}
@for $i from 0 through 200 {
  $item: 2px * $i;
  $index: $i * 2;
  .m-#{$index} {
    margin: $item;
  }
  .mx-#{$index} {
    margin-left: $item;
    margin-right: $item;
  }

  .my-#{$index} {
    margin-top: $item;
    margin-bottom: $item;
  }
  .mt-#{$index} {
    margin-top: $item;
  }
  .mb-#{$index} {
    margin-bottom: $item;
  }
  .mr-#{$index} {
    margin-right: $item;
  }
  .ml-#{$index} {
    margin-left: $item;
  }
}
// flex
@mixin flex() {
  display: flex;
  display: -webkit-box; /*安卓低版本*/
  display: -moz-box; /*火狐低版本*/
  display: -ms-flexbox; /*IE版本*/
  display: -webkit-flex; /*谷歌*/
}
.d-flex {
  @include flex;
}
.flex-center {
  @include flex;
  justify-content: center;
  align-items: center;
}
.flex-start {
  @include flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.flex-between {
  @include flex;
  justify-content: space-between;
  align-items: center;
}
.flex-around {
  @include flex;
  justify-content: space-around;
  align-items: center;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-align-center {
  align-items: center;
}
.flex-align-start {
  align-items: flex-start;
}
.flex-column-center {
  @include flex;
  flex-direction: column;
  align-items: center;
}
.flex-column-end {
  @include flex;
  flex-direction: column;
  align-items: flex-end;
}
.flex-column-start {
  @include flex;
  flex-direction: column;
  align-items: flex-start;
}
.flex-1 {
  flex: 1;
  overflow: hidden;
}
.flex-direction-column {
  flex-direction: column;
}
.text-red {
  color: red;
}
.text-primary {
  color: skyblue;
}
</style>
