<template>
  <el-card>
    <el-form ref="formRef" :model="queryParams" :inline="true">
      <el-form-item label="全部证照类型">
        <el-select
          v-model="queryParams.hzlx"
          placeholder="全部证照类型"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="dict in lajw_ft_certificate_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="全部入库状态">
        <el-select
          v-model="queryParams.inStatus"
          placeholder="全部入库状态"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="dict in lajw_ft_certificate_in_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="全部证照状态">
        <el-select
          v-model="queryParams.status"
          placeholder="全部证照状态"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="dict in lajw_ft_certificate_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="全部工作单位" v-if="checkRole(['QGGBZGY', 'admin'])">
        <el-select
          v-model="queryParams.deptId"
          placeholder="全部工作单位"
          clearable
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="item in roleList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 300px"
          size="small"
          v-model="queryParams.zjhm"
          placeholder="证照编号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleQuery"
          >查询</el-button
        >
        <el-button type="" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              @click="dialogVisible = !dialogVisible"
              v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
              >添加证照</el-button
            >
            <el-button
              type="success"
              size="small"
              icon="Upload"
              @click="handleImport"
              >导入</el-button
            >
            <el-button
              type="warning"
              size="small"
              icon="Download"
              @click="handleExport"
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
        prop="zjhm"
        label="证照编号"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="hzlxName"
        label="证照类型"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="signAdress"
        label="签发地点"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="zjqfrq"
        label="签发时间"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="validityDate"
        label="有效期至"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="name"
        label="归属人"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            @click="handleNameDetail(scope.row)"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="inStatusName"
        label="入库状态"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="statusName"
        label="证照状态"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createBy"
        label="添加人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="createTime"
        label="添加时间"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            @click="handleReceive(scope.row)"
            v-if="
              checkRole(['QGGBZGY', 'FQGGBZGY']) &&
              scope.row.inStatus === 20 &&
              scope.row.status === 20
            "
            >领取</el-button
          >
          <el-button
            v-if="
              checkRole(['QGGBZGY', 'FQGGBZGY']) &&
              ((scope.row.inStatus === 20 && scope.row.status === 10) ||
                (scope.row.inStatus === 20 && scope.row.status === 20) ||
                (scope.row.inStatus === 10 && scope.row.status === 20))
            "
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
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
        @click="handleDownloadTemplate"
        >下载模板</el-link
      >
      <span>文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得超过10M</span>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
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
    <el-dialog :title="title" v-model="dialogVisible" width="800px">
      <el-form ref="queryFormRef" label-suffix=":" :model="dynamicValidateForm">
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="归属人"
              prop="gsr"
              :rules="[
                {
                  required: true,
                  message: '请输入归属人',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-select
                class="w-100"
                v-model="dynamicValidateForm.gsr"
                placeholder="请输入"
                filterable
                remote
                :remote-method="remoteMethod"
                value-key="id"
                @change="userInfoChange"
              >
                <el-option
                  v-for="item in userInfoOptions"
                  :key="item.id"
                  :label="`${item.name}-${item.employer}-${item.deptOfficeName}-${item.zw}-${item.sfzh}`"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <span>证照1</span> -->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item
              label="证照编号"
              prop="bh"
              :rules="[
                {
                  required: true,
                  message: '请输入证照编号',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-input
                v-model="dynamicValidateForm.bh"
                style="width: 220px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="证照类型"
              prop="lx"
              :rules="[
                {
                  required: true,
                  message: '请选择证照类型',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-select v-model="dynamicValidateForm.lx" style="width: 220px">
                <el-option
                  v-for="item in lajw_ft_certificate_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="签发地点"
              prop="qfdd"
              :rules="[
                {
                  required: true,
                  message: '请输入签发地点',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-input
                v-model="dynamicValidateForm.qfdd"
                style="width: 220px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="签发日期"
              prop="qfrq"
              :rules="[
                {
                  required: true,
                  message: '请选择签发日期',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-date-picker
                v-model="dynamicValidateForm.qfrq"
                type="date"
                placeholder="请选择签发日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="有效期至"
              prop="yxqz"
              :rules="[
                {
                  required: true,
                  message: '请选择有效期至',
                  trigger: ['change', 'blur']
                }
              ]"
            >
              <el-date-picker
                v-model="dynamicValidateForm.yxqz"
                type="date"
                placeholder="请选择有效期至"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
        <div
          v-for="(item, index) in dynamicValidateForm.domains"
          :key="item.key"
        >
          <el-row class="w-100 flex-between">
            <span>证照{{ index + 1 }}</span>
            <el-button
              type="text"
              style="color: red"
              class="mr-80"
              @click="removeDomanis(item)"
              v-if="index != 0"
              >删除</el-button
            >
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="证照编号"
                :prop="`domains.${index}.zjhm`"
                :rules="[
                  {
                    required: true,
                    message: '请输入证照编号',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input
                  v-model="item.zjhm"
                  style="width: 220px"
                  placeholder="请输入证照编号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="证照类型"
                :prop="`domains.${index}.hzlx`"
                :rules="[
                  {
                    required: true,
                    message: '请选择证照类型',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-select
                  v-model="item.hzlx"
                  style="width: 220px"
                  placeholder="请选择证照类型"
                >
                  <el-option
                    v-for="item in lajw_ft_certificate_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="签发地点"
                class="signAdress"
                :prop="`domains.${index}.signAdress`"
                :rules="[
                  {
                    required: true,
                    message: '请输入签发地点',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-input
                  v-model="item.signAdress"
                  style="width: 220px"
                  placeholder="请输入签发地点"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="签发日期"
                class="qfrq"
                :prop="`domains.${index}.zjqfrq`"
                :rules="[
                  {
                    required: true,
                    message: '请选择签发日期',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-date-picker
                  v-model="item.zjqfrq"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择签发日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item
                label="有效期至"
                :prop="`domains.${index}.validityDate`"
                :rules="[
                  {
                    required: true,
                    message: '请选择有效期至',
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <el-date-picker
                  :disabled-date="disabledDate"
                  v-model="item.validityDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择有效期至"
                >
                </el-date-picker>
              </el-form-item>
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
              >保存</el-button
            >
            <el-button type="primary" size="small" @click="saveHandlerContain"
              >保存并继续添加</el-button
            >
          </div>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="归属人" v-model="dialogVisibleOwner" width="500px">
      <el-form :model="ownerForm" label-width="150px" label-position="right">
        <el-form-item label="证照编号">{{ ownerForm.zjhm }}</el-form-item>
        <el-form-item label="姓名">{{ ownerForm.name }}</el-form-item>
        <el-form-item label="身份证号">{{ ownerForm.sfzh }}</el-form-item>
        <el-form-item label="性别">{{
          ownerForm?.jwFtPersonVo?.genderName
        }}</el-form-item>
        <el-form-item label="出生日期">{{
          ownerForm?.jwFtPersonVo?.csrq
        }}</el-form-item>
        <el-form-item label="手机号码">{{
          ownerForm?.jwFtPersonVo?.sjhm
        }}</el-form-item>
        <el-form-item label="工作单位">{{
          ownerForm?.jwFtPersonVo?.employer
        }}</el-form-item>
        <el-form-item label="所在科室">{{
          ownerForm?.jwFtPersonVo?.deptOfficeName
        }}</el-form-item>
        <el-form-item label="职务">{{
          ownerForm?.jwFtPersonVo?.zw
        }}</el-form-item>
      </el-form>
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
import { getToken } from "@/utils/auth";
import { getUserInfo } from "@/api/abroad/index.js";
import { checkRole } from "@/utils/permission.js";
import { listDept } from "@/api/system/dept";
import {
  getLicenseList,
  getPersonList,
  postLicenseSave,
  receiveLicense,
  deleteLicense,
  downloadTemplate
} from "@/api/license/index";
import { ElMessageBox } from "element-plus";
import { queryParams2FormData } from "@/utils/ruoyi";
import { downloadFile } from "@/utils/download";
export default defineComponent({
  name: "index",
  props: {},
  components: {},
  setup() {
    // const form = reactive({});
    const roleList = ref([]);
    const loading = ref(false);
    const userList = ref([]);
    const dynamicValidateForm = reactive({
      gsr: "",
      zjhm: "",
      hzlx: "",
      signAdress: "",
      zjqfrq: "",
      validityDate: "",
      personId: "",
      name: "",
      sfzh: "",
      domains: [
        {
          personId: "",
          name: "",
          sfzh: ""
        }
      ]
    });
    const dialogVisible = ref(false);
    const dialogVisibleOwner = ref(false);
    const title = ref("添加证照");
    const total = ref(0);
    const userInfoOptions = ref([]);
    const timer = ref("");
    const { proxy } = getCurrentInstance();
    const data = reactive({
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: {},
      queryFormRules: {},
      ownerForm: {}
    });
    const { status } = queryParams2FormData("status");
    data.queryParams.status = status;

    const { queryParams, queryForm, ownerForm } = toRefs(data);
    const { lajw_ft_certificate_type } = proxy.useDict(
      "lajw_ft_certificate_type"
    ); //证照类型
    const { sys_normal_disable } = proxy.useDict("sys_normal_disable"); //
    const { lajw_ft_certificate_in_status } = proxy.useDict(
      "lajw_ft_certificate_in_status"
    );
    const { lajw_ft_certificate_status } = proxy.useDict(
      "lajw_ft_certificate_status"
    );
    const statusOption = { 10: "正常", 20: "已作废" };
    /*** 导入参数 */
    const upload = reactive({
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "证照导入",
      // 是否禁用上传
      isUploading: false,
      // 是否更新已经存在的用户数据
      updateSupport: 1,
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      // 上传的地址
      url: import.meta.env.VITE_APP_BASE_API + "/jwFtCertificate/importData"
    });
    function addForm() {
      dynamicValidateForm.domains.push({
        zjhm: "", // 证照编号
        hzlx: "", // 证照类型
        signAdress: "", // 签发地点
        zjqfrq: "", // 签发日期
        validityDate: "" // 有效期
      });
    }
    function removeDomanis(item) {
      const index = dynamicValidateForm.domains.indexOf(item);
      proxy.$modal.confirm("确认删除?").then(function () {
        if (index !== -1) {
          dynamicValidateForm.domains.splice(index, 1);
        }
      });
    }
    function getDept() {
      listDept({ parentId: 1, deptName: "" }).then(response => {
        roleList.value = response.data;
      });
    }
    getDept();
    function saveHandler() {
      let flag2 = dynamicValidateForm.domains.every(item => {
        let date1 = new Date(item.zjqfrq);
        let date2 = new Date(item.validityDate);
        return date1.getTime() < date2.getTime();
      });
      if (!flag2) {
        proxy.$modal.msgError("有效期至应大于签发日期");
        return;
      }
      proxy.$refs["queryFormRef"].validate(valid => {
        dynamicValidateForm.domains.map(item => {
          item.personId = dynamicValidateForm.personId;
          item.name = dynamicValidateForm.name;
          item.sfzh = dynamicValidateForm.sfzh;
        });
        if (valid) {
          // 请求
          postLicenseSave(dynamicValidateForm.domains).then(res => {
            dynamicValidateForm.gsr = "";
            dynamicValidateForm.domains = [{}];
            dialogVisible.value = false;
            getList();
          });
        }
      });
    }
    function saveHandlerContain() {
      proxy.$refs["queryFormRef"].validate(valid => {
        dynamicValidateForm.domains.map(item => {
          item.personId = dynamicValidateForm.personId;
          item.name = dynamicValidateForm.name;
          item.sfzh = dynamicValidateForm.sfzh;
        });
        if (valid) {
          // 请求
          postLicenseSave(dynamicValidateForm.domains).then(res => {
            dynamicValidateForm.gsr = "";
            dynamicValidateForm.domains = [{}];
            getList();
            // proxy.resetForm('queryFormRef');
          });
        }
      });
    }
    function getList() {
      loading.value = true;
      getLicenseList(queryParams.value)
        .then(res => {
          userList.value = res.rows;
          loading.value = false;
          total.value = res.total;
        })
        .catch(err => {
          loading.value = false;
        });
      //   listRyFt(queryParams.value).then(res => {
      //     loading.value = false;
      //     userList.value = res.rows;
      //     total.value = res.total;
      //   });
    }

    const handleDownloadTemplate = () => {
      downloadFile(downloadTemplate, "证照管理导入模板");
    };
    function handleImport() {
      upload.open = true;
    }
    // 导出
    function handleExport() {
      proxy.download("jwFtCertificate/export", {
        params: {
          ...queryParams.value,
          pageNum: null,
          pageSize: null
        }
      });
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
        {
          dangerouslyUseHTMLString: true,
          callback: handleQuery
        }
      );
    };
    /** 搜索按钮操作 */
    function handleQuery() {
      queryParams.value.pageNum = 1;
      getList();
    }
    /** 重置按钮操作 */
    function resetQuery() {
      queryParams.value = {
        pageNum: 1,
        pageSize: 10
      };
      handleQuery();
    }
    function handleDetail(row) {
      // router.push({ path: '/process/detail', query: { id: row.id } });
    }
    function handleReceive(row) {
      proxy.$modal
        .confirm(`确认领取(证照编号为${row.zjhm})?`)
        .then(function () {})
        .then(() => {
          receiveLicense(row.id).then(() => {
            proxy.$modal.msgSuccess("领取成功");
            getList();
          });
        })
        .catch(() => {});
    }
    function handleNameDetail(row) {
      getPersonList({ id: row.id }, row.id).then(res => {
        ownerForm.value = res.data;
        // userList.value.map((item)=>{
        //   return item.status = 20
        // })
        // loading.value = false;
      });
      dialogVisibleOwner.value = true;
    }
    function handleDelete(row) {
      ElMessageBox.alert(`确定删除${row.hzlxName}(证照编号为${row.zjhm})?`, {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        title: "温馨提示",
        callback: action => {
          if (action === "confirm") {
            deleteLicense({}, row.id).then(res => {
              getList();
            });
          }
        }
      });
    }
    function disabledDate() {}
    function remoteMethod(query) {
      if (query) {
        const params = {
          userName: query
        };
        clearTimeout(timer.value);
        timer.value = setTimeout(() => {
          getUserInfo(params).then(res => {
            userInfoOptions.value = res.data;
          });
        }, 500);
      }
    }
    function userInfoChange(value) {
      userInfoOptions.value.forEach(item => {
        if (item.id == value.id) {
          dynamicValidateForm.personId = item.id;
          dynamicValidateForm.name = item.name;
          dynamicValidateForm.sfzh = item.sfzh;
          dynamicValidateForm.gsr = item.name;
          if (item.employer != null) {
            dynamicValidateForm.gsr += "-" + item.employer;
          }
          if (item.deptOfficeName != null) {
            dynamicValidateForm.gsr += "-" + item.deptOfficeName;
          }
          if (item.zw != null) {
            dynamicValidateForm.gsr += "-" + item.zw;
          }
          if (item.sfzh != null) {
            dynamicValidateForm.gsr += "-" + item.sfzh;
          }
        }
      });
    }
    getList();
    return {
      dialogVisible,
      queryParams,
      queryForm,
      userList,
      title,
      total,
      loading,
      lajw_ft_certificate_type,
      lajw_ft_certificate_in_status,
      sys_normal_disable,
      lajw_ft_certificate_status,
      upload,
      dynamicValidateForm,
      statusOption,
      dialogVisibleOwner,
      ownerForm,
      userInfoOptions,
      timer,
      addForm,
      ...toRefs(data),
      handleDownloadTemplate,
      handleImport,
      handleExport,
      handleFileUploadProgress,
      handleFileSuccess,
      saveHandler,
      saveHandlerContain,
      removeDomanis,
      handleQuery,
      handleDetail,
      handleNameDetail,
      resetQuery,
      remoteMethod,
      userInfoChange,
      handleReceive,
      handleDelete,
      getList,
      checkRole,
      disabledDate,
      roleList
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
</style>
