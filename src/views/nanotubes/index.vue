<template>
  <el-card>
    <el-form ref="formRef" :model="queryParams" :inline="true">
      <el-form-item label="全部职级" v-if="checkRole(['admin'])">
        <el-select
          v-model="queryParams.isQggb"
          placeholder="全部职级"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="dict in isQggbOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="全部备案状态">
        <el-select
          v-model="queryParams.baType"
          placeholder="全部备案状态"
          clearable
          size="small"
          style="width: 200px"
        >
          <template v-if="checkRole(['admin'])">
            <el-option
              v-for="dict in lajw_ft_person_ba_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </template>
          <template v-else>
            <el-option
              v-for="dict in lajw_ft_ba_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="全部工作单位" v-if="checkRole(['QGGBZGY', 'admin'])">
        <el-select
          v-model="queryParams.deptId"
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
          style="width: 400px"
          size="small"
          v-model="queryParams.mixSearchText"
          placeholder="姓名/手机号码/身份证号"
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
              v-if="checkRole(['QGGBZGY', 'FQGGBZGY'])"
              size="small"
              icon="Plus"
              type="primary"
              @click="handleAdd"
              >新增</el-button
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
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="genderName"
        label="性别"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="sfzh"
        label="身份证号"
        width="200"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="qggbName"
        label="职级"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="employer"
        label="工作单位"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="deptOfficeName"
        label="科室"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="zw"
        label="职务"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="baTypeName"
        label="备案状态"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="200"
      >
        <template #default="scope">
          <el-button size="small" type="text" @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            v-if="
              checkRole(['QGGBZGY', 'FQGGBZGY', 'ZZGY']) &&
              scope.row.baType != 40
            "
            size="small"
            type="text"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="
              checkRole(['QGGBZGY', 'FQGGBZGY', 'admin']) &&
              scope.row.baType == 10
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
    <!-- 添加 -->
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      append-to-body
      width="800px"
    >
      <el-form
        :model="queryForm"
        :rules="queryFormRules"
        ref="queryFormRef"
        label-width="150px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="queryForm.name"
                maxlength="100"
                :disabled="queryForm.baType === 20 || queryForm.baType === 30"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="sfzh">
              <el-input
                v-model="queryForm.sfzh"
                :disabled="queryForm.baType === 20 || queryForm.baType === 30"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职级" prop="isQggb">
              <el-select
                v-model="queryForm.isQggb"
                placeholder="请选择职级"
                class="inner-input"
                @change="handleZjChange"
                :disabled="
                  (checkRole(['QGGBZGY']) && queryForm.isQggb == '0') ||
                  (checkRole(['FQGGBZGY']) && queryForm.isQggb == '1') ||
                  checkRole(['ZZGY'])
                "
              >
                <el-option
                  v-for="item in lajw_ft_qggb"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- <el-input v-model="queryForm.qggbName" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="queryForm.isQggb != null">
            <el-form-item
              label="纳管类型"
              prop="ngTypeDown"
              v-if="queryForm.isQggb == 0"
            >
              <el-select
                v-model="queryForm.ngTypeDown"
                placeholder="请选择纳管类型"
                class="inner-input"
              >
                <el-option
                  v-for="item in lajw_ft_qg_ng_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="纳管类型" prop="ngTypeDown" v-else>
              <el-select
                v-model="queryForm.ngTypeDown"
                placeholder="请选择纳管类型"
                class="inner-input"
              >
                <el-option
                  v-for="item in lajw_ft_fqg_ng_type"
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
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="queryForm.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="csrq">
              <el-date-picker
                class="inner-input"
                v-model="queryForm.csrq"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择出生日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politicsStatus">
              <el-select
                v-model="queryForm.politicsStatus"
                placeholder="政治面貌"
                class="inner-input"
              >
                <el-option
                  v-for="item in lajw_ft_politics_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-select
                v-model="queryForm.nation"
                placeholder="请选择民族"
                class="inner-input"
              >
                <el-option
                  v-for="item in lajw_ft_nation"
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
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input
                maxlength="100"
                v-model="queryForm.nativePlace"
                placeholder="请输入籍贯"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户口所在地" prop="household">
              <el-input
                maxlength="100"
                v-model="queryForm.household"
                placeholder="请输入户口所在地"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="sjhm">
              <el-input
                v-model="queryForm.sjhm"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭地址" prop="homeAdress">
              <el-input
                v-model="queryForm.homeAdress"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="employer">
              <el-select
                v-model="queryForm.employer"
                placeholder="工作单位"
                class="inner-input"
                value-key="deptId"
                :disabled="disabledEmployer"
                @change="employerChange"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所在科室"
              prop="deptOfficeId"
              v-if="queryForm.employer"
            >
              <el-select
                v-model="queryForm.deptOfficeId"
                placeholder="请选择所在科室"
                class="inner-input"
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职务" prop="zw">
              <el-input v-model="queryForm.zw" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="纳管类型" prop="nglx">
              <el-checkbox-group v-model="queryForm.nglx">
                <el-checkbox label="0">公务员（参公）</el-checkbox>
                <el-checkbox label="1">事业编制人员</el-checkbox>
                <el-checkbox label="2">国有企业管理及重要岗位人员 </el-checkbox>
                <el-checkbox label="3"
                  >公办医疗/教育单位从事管理人员</el-checkbox
                >
                <el-checkbox label="4"
                  >基层群众自治组织中从事管理及重要岗位人员</el-checkbox
                >
                <el-checkbox label="99">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row v-for="(item, index) in overseaList" :key="index">
          <el-col :span="4">
            <el-form-item :label="index == 0 ? '拥有海外经历' : ''">
              <el-checkbox
                :label="item.label"
                v-model="item.checked"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item v-if="item.checked">
              <el-input
                placeholder="情况说明"
                v-model="item.remark"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="flex-center">
          <div v-if="title == '新增纳管人员'">
            <el-button type="primary" size="small" @click="saveInfo"
              >保存</el-button
            >
            <el-button type="primary" size="small" @click="saveInfoAndClear"
              >保存并继续添加</el-button
            >
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="saveInfo"
              >保存编辑</el-button
            >
          </div>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="人员详情" v-model="detailVisible" width="1200px">
      <el-form ref="detailFormRef" label-suffix=":" :model="detailForm">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <span class="fs-16 font-weight-600">1-基本信息</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              {{ detailForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              {{ detailForm.sfzh }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别">
              {{ detailForm.genderName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出生日期">
              {{ detailForm.csrq }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="政治面貌">
              {{ detailForm.politicsStatusName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="民族">
              {{ detailForm.nationName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="籍贯">
              {{ detailForm.nativePlace }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="户口所在地">
              {{ detailForm.household }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="手机号码">
              {{ detailForm.sjhm }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="家庭地址">
              {{ detailForm.homeAdress }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职级">
              {{ detailForm.qggbName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纳管类型">
              {{ detailForm.ngType }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="工作单位">
              {{ detailForm.employer }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在科室">
              {{ detailForm.deptOfficeName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务">
              {{ detailForm.zw }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备案状态">
              {{ detailForm.baTypeName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="添加时间">
              {{ detailForm.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="拥有海外经历">
              <span
                v-for="(item, index) in detailForm.personOverseasList"
                :key="index"
              >
                <span v-if="detailForm.personOverseasList.length > 1">
                  {{ index + 1 }}.
                </span>
                {{ overseaList2[item.overseasType] }}({{ item.remark }})；
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span class="fs-16 font-weight-600">2-证照信息</span>
      <el-table :data="licenseList" style="width: 100%" class="my-4">
        <el-table-column prop="zjhm" label="证照编号" width="width">
        </el-table-column>
        <el-table-column prop="hzlxName" label="证照类型" width="width">
        </el-table-column>
        <el-table-column prop="signAdress" label="签发地点" width="width">
        </el-table-column>
        <el-table-column prop="zjqfrq" label="签发时间" width="width">
        </el-table-column>
        <el-table-column prop="validityDate" label="有效期至" width="width">
        </el-table-column>
        <el-table-column prop="inStatusName" label="状态" width="width">
        </el-table-column>
      </el-table>
      <span class="fs-16 font-weight-600">3-出国（境）审批</span>
      <el-table :data="abroadList" style="width: 100%" class="mt-4">
        <el-table-column prop="startEndDate" label="起止时间" width="width">
        </el-table-column>
        <el-table-column prop="spmdd" label="目的地" width="width">
        </el-table-column>
        <el-table-column prop="cgsy" label="出国（境）事由" width="width">
        </el-table-column>
        <el-table-column prop="applyStatusName" label="状态" width="width">
        </el-table-column>
      </el-table>
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
import { checkRole } from "@/utils/permission.js";
import { useStore } from "vuex";
import {
  getNanotubesList,
  postNanotubesAdd,
  postNanotubesEdit,
  getPersonDetailList,
  postNanotubesDelete,
  downloadTemplateQg,
  downloadTemplateFqg
} from "@/api/nanotubes/index";
import { listDept } from "@/api/system/dept";
import { queryParams2FormData } from "@/utils/ruoyi";
import { downloadFile } from "@/utils/download";
export default defineComponent({
  name: "index",
  props: {},
  components: {},
  setup() {
    const store = useStore();
    const form = reactive({});
    const loading = ref(false);
    const userList = ref([]);
    const licenseList = ref([]);
    const abroadList = ref([]);
    const dialogVisible = ref(false); //新增\编辑按钮弹窗
    const detailVisible = ref(false); //详情弹窗
    // const detailForm = ref({});
    const title = ref("新增纳管人员");
    const total = ref(0);
    const deptName = ref("");
    const roleList = ref([]);
    const deptList = ref([]);
    const overseaList = ref([
      { label: "海外身份", checked: false, remark: "", overseasType: "10" },
      { label: "海外资产", checked: false, remark: "", overseasType: "20" },
      { label: "海外求学经历", checked: false, remark: "", overseasType: "30" },
      { label: "海外就业经历", checked: false, remark: "", overseasType: "40" }
    ]);
    const overseaList2 = ref({
      10: "海外身份",
      20: "海外资产",
      30: "海外求学经历",
      40: "海外就业经历"
    });
    const { proxy } = getCurrentInstance();
    const data = reactive({
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryForm: { isQggb: "0" },
      detailForm: {},
      queryFormRules: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: ["blur", "change"]
          }
        ],
        csrq: [
          {
            required: true,
            message: "出生日期不能为空",
            trigger: ["blur", "change"]
          }
        ],
        sfzh: [
          {
            pattern:
              /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            required: true,
            message: "请输入正确的身份证号",
            trigger: ["blur", "change"]
          }
        ],
        gender: [
          {
            required: true,
            message: "性别不能为空",
            trigger: ["blur", "change"]
          }
        ],
        politicsStatus: [
          {
            required: true,
            message: "政治面貌不能为空",
            trigger: ["blur", "change"]
          }
        ],
        isQggb: [
          {
            required: true,
            message: "职级不能为空",
            trigger: ["blur", "change"]
          }
        ],
        nation: [
          {
            required: true,
            message: "民族不能为空",
            trigger: ["blur", "change"]
          }
        ],
        nativePlace: [
          {
            required: true,
            message: "籍贯不能为空",
            trigger: ["blur", "change"]
          }
        ],
        household: [
          {
            required: true,
            message: "户口所在地不能为空",
            trigger: ["blur", "change"]
          }
        ],
        sjhm: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
            required: true,
            message: "请输入正确的手机号",
            trigger: ["blur", "change"]
          }
        ],
        homeAdress: [
          {
            required: true,
            message: "家庭地址不能为空",
            trigger: ["blur", "change"]
          }
        ],
        employer: [
          {
            required: true,
            message: "工作单位不能为空",
            trigger: ["blur", "change"]
          }
        ],
        ngTypeDown: [
          {
            required: true,
            message: "纳管类型不能为空",
            trigger: ["blur", "change"]
          }
        ]
      }
    });
    // 待办页面入口 自动条件过滤
    const { baType, mixSearchText } = queryParams2FormData(
      "baType",
      "mixSearchText"
    );
    data.queryParams.baType = baType;
    data.queryParams.mixSearchText = mixSearchText;

    const { queryParams, queryForm, detailForm } = toRefs(data);
    const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
    const { lajw_ft_person_ba_type } = proxy.useDict("lajw_ft_person_ba_type");
    const { lajw_ft_ba_status } = proxy.useDict("lajw_ft_ba_status");
    const isQggbOption = [
      { value: 0, label: "区管干部" },
      { value: 1, label: "非区管干部" }
    ];
    const { lajw_ft_qggb } = proxy.useDict("lajw_ft_qggb"); //职级
    const { lajw_ft_politics_status } = proxy.useDict(
      "lajw_ft_politics_status"
    );
    const { lajw_ft_nation } = proxy.useDict("lajw_ft_nation"); // 民族
    const { lajw_ft_qg_ng_type } = proxy.useDict("lajw_ft_qg_ng_type");
    const { lajw_ft_fqg_ng_type } = proxy.useDict("lajw_ft_fqg_ng_type");
    const { lajw_ft_overseas_type } = proxy.useDict("lajw_ft_overseas_type");
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
      url:
        import.meta.env.VITE_APP_BASE_API +
        `/jwFtPerson/import/${checkRole(["QGGBZGY"]) ? 0 : 1}`
    });

    function saveInfo() {
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          // 请求
          // delete queryForm.value.employer;
          let arr = overseaList.value
            .filter(item => {
              return item.checked == true;
            })
            .map(cell => {
              return {
                overseasType: cell.overseasType,
                remark: cell.remark
              };
            });
          queryForm.value.personOverseasList = arr;
          queryForm.value.personOverseasList.forEach(item => {
            item.label = undefined;
            item.checked = undefined;
          });
          const params = {
            ...queryForm.value,
            deptId: queryForm.value.employer.deptId,
            employer: undefined
          };
          // overseaList
          if (title.value == "新增纳管人员") {
            postNanotubesAdd(params).then(res => {
              getList();
              dialogVisible.value = false;
            });
          } else {
            postNanotubesEdit(params).then(res => {
              getList();
              dialogVisible.value = false;
            });
          }
        }
      });
    }
    function handleZjChange() {
      queryForm.value.ngTypeDown = "";
    }
    function saveInfoAndClear() {
      proxy.$refs["queryFormRef"].validate(valid => {
        if (valid) {
          // 请求
          // delete queryForm.value.employer;
          let arr = overseaList.value
            .filter(item => {
              return item.checked == true;
            })
            .map(cell => {
              return {
                overseasType: cell.overseasType,
                remark: cell.remark
              };
            });
          queryForm.value.personOverseasList = arr;
          queryForm.value.personOverseasList.forEach(item => {
            item.label = undefined;
            item.checked = undefined;
          });
          const params = {
            ...queryForm.value,
            deptId: queryForm.value.employer.deptId,
            employer: undefined
          };
          if (title.value == "新增纳管人员") {
            postNanotubesAdd(params).then(res => {
              getList();
              proxy.resetForm("queryFormRef");
              overseaList.value = [
                {
                  label: "海外身份",
                  checked: false,
                  remark: "",
                  overseasType: "10"
                },
                {
                  label: "海外资产",
                  checked: false,
                  remark: "",
                  overseasType: "20"
                },
                {
                  label: "海外求学经历",
                  checked: false,
                  remark: "",
                  overseasType: "30"
                },
                {
                  label: "海外就业经历",
                  checked: false,
                  remark: "",
                  overseasType: "40"
                }
              ];
            });
          } else {
            postNanotubesEdit(params).then(res => {
              getList();
              proxy.resetForm("queryFormRef");
              overseaList.value = [
                {
                  label: "海外身份",
                  checked: false,
                  remark: "",
                  overseasType: "10"
                },
                {
                  label: "海外资产",
                  checked: false,
                  remark: "",
                  overseasType: "20"
                },
                {
                  label: "海外求学经历",
                  checked: false,
                  remark: "",
                  overseasType: "30"
                },
                {
                  label: "海外就业经历",
                  checked: false,
                  remark: "",
                  overseasType: "40"
                }
              ];
            });
          }
        }
      });
    }
    function getList() {
      loading.value = true;
      getNanotubesList(queryParams.value)
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
      if (checkRole(["QGGBZGY"])) {
        downloadFile(downloadTemplateQg, "纳管人员导入模板_区管");
      } else if (checkRole(["FQGGBZGY"])) {
        downloadFile(downloadTemplateFqg, "纳管人员导入模板_非区管");
      } else {
        proxy.$modal.msgWarning("暂无下载模板权限，请联系管理员！");
      }
    };
    function handleImport() {
      upload.title = "用户导入";
      upload.open = true;
    }
    // 导出
    function handleExport() {
      proxy.download("jwFtPerson/export", {
        params: {
          ...data.queryParams,
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
      getPersonDetailList({ id: row.id }, row.id).then(res => {
        detailVisible.value = true;
        detailForm.value = res.data;
        licenseList.value = res.data.certificateVoList;
        abroadList.value = res.data.leaveCountryVoList;
      });
      // router.push({ path: '/process/detail', query: { id: row.id } });
    }
    function handleAdd() {
      queryForm.value = {};
      if (store.state.user.roles.indexOf("QGGBZGY") !== -1) {
        queryForm.value.isQggb = "0";
      } else if (store.state.user.roles.indexOf("FQGGBZGY") !== -1) {
        queryForm.value.isQggb = "1";
        queryForm.value.employer = store.state.user.user.dept;
        listDept({
          parentId: queryForm.value.employer.deptId,
          deptName: deptName.value
        }).then(response => {
          deptList.value = response.data;
        });
      }
      dialogVisible.value = !dialogVisible.value;

      title.value = "新增纳管人员";
      proxy.resetForm("queryFormRef");
      overseaList.value = [
        { label: "海外身份", checked: false, remark: "", overseasType: "10" },
        { label: "海外资产", checked: false, remark: "", overseasType: "20" },
        {
          label: "海外求学经历",
          checked: false,
          remark: "",
          overseasType: "30"
        },
        {
          label: "海外就业经历",
          checked: false,
          remark: "",
          overseasType: "40"
        }
      ];
    }
    function handleEdit(row) {
      if (store.state.user.roles.indexOf("QGGBZGY") !== -1) {
        queryForm.value.isQggb = "0";
      } else if (store.state.user.roles.indexOf("FQGGBZGY") !== -1) {
        queryForm.value.isQggb = "1";
        queryForm.value.employer = store.state.user.user.dept;
      }
      getPersonDetailList({ id: row.id }, row.id).then(res => {
        queryForm.value = res.data;
        queryForm.value.isQggb = res.data.isQggb.toString();
        queryForm.value.politicsStatus = res.data.politicsStatus.toString();
        queryForm.value.nation = res.data.nation.toString();
        queryForm.value.ngTypeDown = res.data.ngTypeDown.toString();
        // 获取科室回显
        listDept({ parentId: res.data.deptId, deptName: deptName.value }).then(
          response => {
            deptList.value = response.data;
          }
        );

        for (let i = 0; i < res.data.personOverseasList.length; i++) {
          if (res.data.personOverseasList[i].overseasType == 10) {
            overseaList.value[0].checked = true;
            overseaList.value[0].remark = res.data.personOverseasList[i].remark;
          } else if (res.data.personOverseasList[i].overseasType == 20) {
            overseaList.value[1].checked = true;
            overseaList.value[1].remark = res.data.personOverseasList[i].remark;
          } else if (res.data.personOverseasList[i].overseasType == 30) {
            overseaList.value[2].checked = true;
            overseaList.value[2].remark = res.data.personOverseasList[i].remark;
          } else if (res.data.personOverseasList[i].overseasType == 40) {
            overseaList.value[3].checked = true;
            overseaList.value[3].remark = res.data.personOverseasList[i].remark;
          }
        }
        // overseaList.value = [

        // ]
        // res.data.personOverseasList
      });
      dialogVisible.value = true;
      title.value = "编辑纳管人员";
    }
    function handleDelete(row) {
      proxy.$modal
        .confirm("确认删除?")
        .then(function () {})
        .then(() => {
          postNanotubesDelete({ id: row.id }, row.id).then(res => {
            getList();
          });
        })
        .catch(() => {});
    }
    function getDept() {
      listDept({ parentId: 1, deptName: deptName.value }).then(response => {
        roleList.value = response.data;
      });
    }
    function employerChange(value) {
      queryForm.value.deptId = value.deptId;
      queryForm.value.deptOfficeId = "";
      listDept({ parentId: value.deptId, deptName: deptName.value }).then(
        response => {
          deptList.value = response.data;
          // total.value = response.total;
          // loading.value = false;
        }
      );
    }
    getDept();
    getList();

    const disabledEmployer = computed(() => {
      if (checkRole(["QGGBZGY"])) {
        if (title.value === "编辑纳管人员" && queryForm.value.baType === 10) {
          return false;
        } else if (title.value === "新增纳管人员") {
          return false;
        }
      }
      return true;
    });

    return {
      lajw_ft_ba_status,
      store,
      dialogVisible,
      queryParams,
      queryForm,
      userList,
      title,
      total,
      loading,
      form,
      sys_normal_disable,
      lajw_ft_person_ba_type,
      lajw_ft_qggb,
      lajw_ft_politics_status,
      lajw_ft_nation,
      lajw_ft_qg_ng_type,
      lajw_ft_fqg_ng_type,
      lajw_ft_overseas_type,
      upload,
      detailVisible,
      detailForm,
      licenseList,
      abroadList,
      isQggbOption,
      roleList,
      deptList,
      handleQuery,
      resetQuery,
      ...toRefs(data),
      handleDownloadTemplate,
      handleImport,
      handleExport,
      handleFileUploadProgress,
      handleFileSuccess,
      saveInfo,
      saveInfoAndClear,
      getList,
      getDept,
      employerChange,
      handleDetail,
      handleEdit,
      overseaList,
      overseaList2,
      handleAdd,
      handleDelete,
      handleZjChange,
      checkRole,
      disabledEmployer
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
