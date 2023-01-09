<template>
  <el-dialog
    title="接收人员"
    v-model="visible"
    width="1200px"
    top="5vh"
    append-to-body
    center
  >
    <el-form
      :model="queryParams"
      :rules="queryFormRules"
      ref="queryRef"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">
            {{ queryParams.name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">
            {{ queryParams.sfzh }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="换岗结果" prop="pass">
        <el-radio-group v-model="queryParams.pass">
          <el-radio :label="'1'">同意换岗</el-radio>
          <el-radio :label="'0'">驳回换岗</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="queryParams.pass && queryParams.pass == 1">
        <el-row>
          <el-col :span="12">
            <el-form-item label="移入科室" prop="deptOfficeId">
              <el-select
                v-model="queryParams.deptOfficeId"
                placeholder="请选择所在科室"
                clearable
                size="small"
                style="width: 240px"
                value-key="deptId"
                filterable
                @change="officeChange"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="zw">
              <el-input
                v-model="queryParams.zw"
                placeholder="请输入职务"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="证照状态" prop="license" class="type-item">
          <el-table :data="queryParams.licenseList">
            <el-table-column label="证照编号" prop="zjhm" width="120" />
            <el-table-column label="证照类型" prop="hzlx" width="120">
              <template #default="scope">
                {{ zhlxDict[scope.row.hzlx] }}
              </template>
            </el-table-column>
            <el-table-column label="签发地点" prop="signAdress" width="120" />
            <el-table-column label="签发时间" prop="zjqfrq" width="120" />
            <el-table-column label="有效期" prop="validityDate" />
            <el-table-column label="原状态" prop="oldStatus" width="120">
              <template #default="scope">
                {{ licenseStatus[scope.row.oldStatus] }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="newStatus" width="120">
              <template #default="scope">
                <el-form-item
                  :prop="`licenseList.${scope.$index}.newStatus`"
                  :rules="queryFormRules.newStatus"
                  v-if="scope.row.oldStatus == 20"
                >
                  <el-select
                    v-model="scope.row.newStatus"
                    placeholder="请选择状态"
                    size="small"
                  >
                    <el-option
                      v-for="item in statusSelectList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-else>出国(境)中</el-form-item>
                <!-- <el-input v-model='scope.row.newStatus'></el-input> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="登记备案表" prop="djbab">
          <wt-upload
            ref="upload"
            accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.jpep,.jpg,.jpeg"
            :fileList="dataMap.attachmentList"
            @success="dataMap.fileChange"
            @remove="dataMap.fileChange"
          />
        </el-form-item>
      </template>
      <template v-if="queryParams.pass && queryParams.pass == 0">
        <el-form-item label="驳回原因" prop="remark">
          <el-input v-model="queryParams.remark" type="textarea"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { postApprovalUn, getLicenseDetailById } from "@/api/process/index";
import { listDept } from "@/api/system/dept";
import { zhlxDict } from "@/constant/abroad";
const { proxy } = getCurrentInstance();
const visible = ref(false);
const queryParams = ref({});
const licenseStatus = ref({ 10: "未入库", 20: "已入库" });
const statusSelectList = ref([
  { value: 10, label: "未入库" },
  { value: 20, label: "已入库" }
]);
// const licenseList = ref([]);
const queryFormRules = ref({
  pass: [
    {
      required: true,
      message: "请选择",
      trigger: ["blur"]
    }
  ],
  remark: [
    {
      required: true,
      message: "请输入",
      trigger: ["blur", "change"]
    }
  ],
  djbab: [
    {
      required: true,
      type: "array",
      message: "请上传",
      trigger: ["blur", "change"]
    }
  ],
  // deptOfficeId: [
  //   {
  //     required: true,
  //     message: '请选择',
  //     trigger: ['blur', 'change']
  //   }
  // ],
  // license: [
  //   {
  //     required: true,
  //     message: '请选择',
  //     trigger: ['blur', 'change']
  //   }
  // ],
  newStatus: [
    {
      required: true,
      message: "请选择",
      trigger: ["blur", "change"]
    }
  ]
});
const props = defineProps({
  id: {
    type: Number,
    default: 1
  },
  taskId: {
    type: Number,
    default: 1
  },
  // 新单位deptId
  newDeptId: {
    type: String,
    default: ""
  },
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
const deptList = ref([]);
const emit = defineEmits(["ok"]);
// 附件
const uploadRef = ref();
const dataMap = reactive({
  attachmentList: [],
  // 上传附件成功
  fileChange: UploadObject => {
    const fileList = Object.values(UploadObject);
    dataMap.attachmentList = fileList;
    queryParams.value.djbab = fileList;
  },
  clearFileList() {
    uploadRef.value.clearAll();
  }
});
// 显示弹框
function show() {
  //todo
  queryParams.value.pass = null;
  queryParams.value.remark = null;
  queryParams.value.licenseList = [];
  //   getList();
  visible.value = true;
  dataMap.attachmentList = [];
}
function save() {
  let flag = queryParams.value.licenseList.some(function (item, index, array) {
    return item.newStatus == null;
  });
  if (flag && queryParams.value.pass === "1") {
    proxy.$modal.msgError("请选择证照状态");
  }
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      let relieveCertificateList = queryParams.value.licenseList.map(item => {
        let cell = {};
        cell.id = item.id;
        cell.zzId = item.zzId;
        cell.newStatus = item.newStatus;
        return cell;
      });
      let query = {};
      if (queryParams.value.pass == 0) {
        query = {
          taskId: props.taskId,
          result: queryParams.value.pass,
          remark: queryParams.value.remark
        };
      } else {
        if (dataMap.attachmentList.length == 0) {
          proxy.$modal.msgError("请上传登记备案表");
          return;
        }
        let arr = dataMap.attachmentList.map(item => {
          return {
            attachName: item.name,
            attachPath: item.url
          };
        });
        query = {
          taskId: props.taskId,
          result: queryParams.value.pass,
          newPosition: queryParams.value.zw,
          relieveCertificateList: relieveCertificateList,
          files: arr //文件
        };
        if (queryParams.value.deptOfficeId) {
          Object.assign(query, {
            newDepartment: queryParams.value.deptOfficeId.deptName,
            newDepartmentId: queryParams.value.deptOfficeId.deptId
          });
        }
      }
      postApprovalUn(query).then(res => {
        console.log(res);
        visible.value = false;
        emit("ok");
      });
    } else {
      console.log("false");
    }
  });
}
watch(
  () => props.detailData,
  val => {
    console.log("id", val);
    queryParams.value.name = val.name;
    queryParams.value.sfzh = val.sfzh;
    queryParams.value.licenseList = val.jwRelieveCertificateList;
    // queryParams.value.licenseList.map((item)=>{
    //   item.newStatus = null
    // })
  }
);
watch(
  () => props.newDeptId,
  val => {
    listDept({ parentId: val }).then(response => {
      console.log(response);
      deptList.value = response.data;
    });
  }
);

defineExpose({
  show
});
</script>
<style lang="scss" scoped>
.type-item {
  :deep(.el-form-item__label::before) {
    content: "*";
    margin-right: 4px;
    color: var(--el-color-danger);
  }
}
</style>
