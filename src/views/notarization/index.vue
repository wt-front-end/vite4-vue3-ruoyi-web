<template>
  <el-card>
    <el-form ref="forms" :model="form" :inline="true">
      <el-form-item label="公证日期">
        <el-date-picker
          @change="dateChange"
          value-format="YYYY-MM-DD"
          v-model="form.notarizeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="全部工作单位"
        v-if="checkRole(['GZC', 'QGGBZGY', 'admin'])"
      >
        <el-select
          v-model="form.deptId"
          placeholder="工作单位"
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="item in roleList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 300px"
          size="small"
          v-model="form.content"
          placeholder="姓名/身份证号/公证用途/公证内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleQuery"
          >查询</el-button
        >
        <el-button type="" size="small" @click="restForm">重置</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              v-if="checkRole(['GZC'])"
              @click="dialogVisible = !dialogVisible"
              >反馈公证事项</el-button
            >
            <el-button type="info" size="small" @click="handleImport"
              >导入</el-button
            >
            <el-button type="warning" size="small" @click="handleExport"
              >导出</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="userList">
      <el-table-column
        header-align="center"
        align="center"
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sfzh"
        label="身份证号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="deptName"
        label="工作单位"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="notarizeDate"
        label="公证日期"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="notarizeUse"
        label="公证用途"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="notarizeContent"
        label="公证内容"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="公证证明">
        <template #default="scope"
          ><el-button
            type="text"
            @click="lookFile(scope.row.id, scope.row.name, scope.row.sfzh)"
            >查看</el-button
          ></template
        >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="feedbackPerson"
        label="反馈人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="feedbackTime"
        label="反馈时间"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            @click="backFeedback(scope.row.id, scope.row.name)"
            >撤销反馈</el-button
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
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
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
      width="850px"
      :destroy-on-close="true"
    >
      <el-steps :space="200" :active="active" simple class="mb-20">
        <el-step title="第1步: 验证是否为公职人员"></el-step>
        <el-step title="第2步: 上传公证事项"></el-step>
      </el-steps>
      <el-form
        ref="queryFormRef"
        label-suffix=":"
        :model="dynamicValidateForm"
        v-if="active === 1"
      >
        <div
          v-for="(item, index) in dynamicValidateForm.domains"
          :key="item.key"
        >
          <el-row gutter="10">
            <el-col :span="8">
              <el-form-item
                :label="`人员${index + 1}`"
                :prop="`domains.${index}.name`"
                :rules="[
                  {
                    required: true,
                    message: '请输入姓名',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input
                  v-model="item.name"
                  placeholder="姓名"
                  style="width: 220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item
                :prop="`domains.${index}.sfzh`"
                :rules="[
                  {
                    pattern:
                      /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                    required: true,
                    message: '请输入正确的身份证号',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input placeholder="身份证号" v-model="item.sfzh"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                v-if="index != 0"
                type="text"
                style="color: red"
                @click="removeDomanis(item)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <div class="flex-center">
          <el-button type="text" size="small" @click="addForm"
            >新增一条记录</el-button
          >
        </div>
        <el-row class="flex-center mt-20">
          <div>
            <el-button type="primary" size="small" @click="saveHandler"
              >验证</el-button
            >
          </div>
        </el-row>
      </el-form>
      <el-form
        ref="nortanForms"
        :model="dynamicValidateForm"
        label-width="80px"
        v-else-if="active === 2"
      >
        <span class="flex-center">以下人员为公职人员</span>
        <div v-for="(item, index) in dynamicValidateForm.domains" :key="index">
          <el-form-item :label="`人员${index + 1}:`">{{
            item.name
          }}</el-form-item>
          <el-form-item
            label="公证日期"
            :prop="`domains.${index}.notarizeDate`"
            :rules="{
              required: true,
              message: '请选择公证日期',
              trigger: ['change', 'blur']
            }"
          >
            <el-date-picker
              v-model="item.notarizeDate"
              type="date"
              placeholder="公证日期"
              value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="公证用途"
            :prop="`domains.${index}.notarizeUse`"
            :rules="{
              required: true,
              message: '请选择公证用途',
              trigger: ['change', 'blur']
            }"
          >
            <el-input v-model="item.notarizeUse" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item
            label="公证内容"
            :prop="`domains.${index}.notarizeContent`"
            :rules="{
              required: true,
              message: '请选择公证内容',
              trigger: ['change', 'blur']
            }"
          >
            <el-input
              v-model="item.notarizeContent"
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公证证明"
            :prop="`domains.${index}.jwFtFileList`"
            :rules="{
              required: true,
              message: '请选择公证证明',
              trigger: ['change', 'blur']
            }"
          >
            <wt-upload
              :fileList="item.jwFtFileList"
              @success="uploadSuccess"
              @remove="removeFile"
              @progress="progress(index)"
            ></wt-upload>
          </el-form-item>
        </div>
        <div class="flex-center">
          <el-button-group>
            <el-button type="" @click="backOut">上一步</el-button>
            <el-button type="primary" @click="saveFeedback">保存反馈</el-button>
          </el-button-group>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="公证证明" v-model="fileDialogVisible" width="800px">
      <div>{{ name }}-{{ sfzh }}</div>
      <el-row :gutter="10">
        <el-col :span="24" v-for="(item, index) in fileDetail" :key="index">
          <el-link
            style="color: blue"
            target="_blank"
            :href="item.attachPath"
            :underline="false"
            >{{ item.attachName }}</el-link
          >
        </el-col>
      </el-row>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from "vue";
import {
  getMattersList,
  addMatters,
  searchMattersPerson,
  delFeedback,
  getMattersDetail
} from "@/api/matters/index.js";
import { listDept } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import { checkRole } from "@/utils/permission.js";
export default defineComponent({
  name: "index",
  props: {},
  components: {},
  setup() {
    const form = reactive({});
    const loading = ref(false);
    const fileDialogVisible = ref(false);
    const fileDetail = ref([]);
    const deptName = ref("");
    const userList = ref([]);
    const nortanForm = reactive({});
    const dynamicValidateForm = reactive({
      name: "",
      sfzh: "",
      domains: [
        {
          name: "",
          sfzh: ""
        }
      ]
    });
    const dialogVisible = ref(false);
    const title = ref("反馈公证事项");
    const name = ref("");
    const sfzh = ref("");
    const total = ref(0);
    const roleList = ref([]);
    const fileList = ref([]);
    const index = ref(0);
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
      dynamicValidateForm.domains = dynamicValidateForm.domains.map(item => {
        return { name: item.name, sfzh: item.sfzh };
      });
    }
    function restForm() {
      form.spkssj = undefined;
      form.spjssj = undefined;
      form.deptId = undefined;
      form.content = undefined;
      getList();
    }
    function addForm() {
      dynamicValidateForm.domains.push({
        name: "",
        sfzh: ""
      });
    }
    function dateChange(e) {
      form.spkssj = e[0];
      form.spjssj = e[1];
    }
    function lookFile(id, n, s) {
      name.value = n;
      sfzh.value = s;
      fileDialogVisible.value = !fileDialogVisible.value;
      getMattersDetail(id).then(res => {
        fileDetail.value = res.rows;
      });
    }
    function progress(ix) {
      index.value = ix;
    }
    function handleQuery() {
      queryParams.value.pageNum = 1;
      getList();
    }
    function saveHandler() {
      const nary = dynamicValidateForm.domains.sort();
      for (let i = 0; i < nary.length - 1; i++) {
        if (nary[i].sfzh == nary[i + 1].sfzh) {
          proxy.$modal.msgError(`人员${nary[i].name}数据重复`);
          return;
        }
      }
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          searchMattersPerson(dynamicValidateForm.domains).then(res => {
            if (res.data.code != 500) {
              active.value = 2;
            } else {
              proxy.$modal.msgError(res.data.msg);
            }
          });
        }
      });
    }
    function getDept() {
      listDept({ parentId: 1, deptName: deptName.value }).then(response => {
        roleList.value = response.data;
      });
    }
    getDept();
    function removeDomanis(item) {
      const index = dynamicValidateForm.domains.indexOf(item);
      proxy.$modal.confirm("确认删除?").then(function () {
        if (index !== -1) {
          dynamicValidateForm.domains.splice(index, 1);
        }
      });
    }
    function backFeedback(id, name) {
      proxy.$modal
        .confirm(`确认撤销${name}的公证事项?`)
        .then(function () {})
        .then(() => {
          delFeedback(id).then(() => {
            proxy.$modal.msgSuccess("撤销成功");
            getList();
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    function saveHandlerContain() {
      const { name, sfzh } = dynamicValidateForm;
      dynamicValidateForm.domains.push({ name, sfzh });
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          // 请求
          active.value = 2;

          proxy.resetForm("queryFormRef");
        }
      });
    }
    function saveFeedback() {
      const params = JSON.parse(JSON.stringify(dynamicValidateForm.domains));
      params.forEach(item => {
        item.jwFtFileList =
          item.jwFtFileList && item.jwFtFileList.length > 0
            ? item.jwFtFileList.map(val => {
                return { attachName: val.name, attachPath: val.url };
              })
            : [];
      });
      proxy.$refs.nortanForms.validate(valid => {
        if (valid) {
          addMatters(params).then(res => {
            dialogVisible.value = !dialogVisible.value;
            proxy.$tab.refreshPage();
            proxy.$modal.msgSuccess("反馈成功");
          });
        }
      });
    }
    function getList() {
      loading.value = true;
      form.notarizeDate = undefined;
      const params = Object.assign(queryParams.value, form);
      getMattersList(params).then(res => {
        loading.value = false;
        userList.value = res.rows;
        total.value = res.total;
      });
    }
    function uploadSuccess(e) {
      dynamicValidateForm.domains[index.value].jwFtFileList = Object.values(e);
      proxy.$refs["nortanForms"].clearValidate(
        `domains.${index.value}.jwFtFileList`
      );
    }
    function removeFile(e) {
      dynamicValidateForm.domains[index.value].jwFtFileList = Object.values(e);
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
    return {
      lookFile,
      deptName,
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
      roleList,
      fileList,
      fileDialogVisible,
      name,
      sfzh,
      fileDetail,
      checkRole,
      dateChange,
      backFeedback,
      progress,
      saveFeedback,
      getDept,
      handleQuery,
      getList,
      backOut,
      addForm,
      ...toRefs(data),
      handleImport,
      handleExport,
      handleFileUploadProgress,
      handleFileSuccess,
      saveHandler,
      saveHandlerContain,
      removeDomanis,
      uploadSuccess,
      removeFile,
      restForm
    };
  }
});
</script>

<style scoped lang="scss">
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
</style>
