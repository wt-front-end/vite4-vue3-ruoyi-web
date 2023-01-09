<template>
  <el-dialog
    :title="title"
    v-model="visible"
    width="1000px"
    top="5vh"
    append-to-body
    center
  >
    <el-form
      :model="queryParams"
      :rules="rules"
      ref="queryRef"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="showName">
        <el-select
          class="w-100"
          v-model="queryParams.showName"
          placeholder="请输入姓名"
          filterable
          remote
          value-key="id"
          :remote-method="remoteMethod"
          @change="userInfoChange"
        >
          <el-option
            v-for="item in userInfoOptions"
            :key="item.id"
            :label="`${item.name}-${item.employer}${
              item.deptOfficeName || '-'
            }${item.zw}-${item.sfzh}`"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证照类型" class="type-item">
        <!-- <el-checkbox-group v-model="queryParams.checkList"> -->
        <div style="disaply: block">
          <div v-for="(item, index) in checkGroup" :key="index">
            <el-form-item>
              <el-checkbox :label="item.name" v-model="item.checked1" />
              <el-checkbox
                label="补证"
                v-model="item.checked2"
                v-if="item.checked1"
                style="margin-right: 30px"
              />
              <el-select
                v-model="item.licenseNo"
                v-if="item.checked1 && item.checked2"
                placeholder="请选择原证照"
                clearable
              >
                <el-option
                  v-for="(itemSelect, index) in item.licenseList"
                  :key="index"
                  :label="itemSelect.label"
                  :value="itemSelect.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="单位证明" prop="dwzm">
        <wt-upload
          ref="upload"
          accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.jpep,.jpg,.jpeg"
          :fileList="dataMap.attachmentList"
          @success="dataMap.fileChange"
          @remove="dataMap.fileChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { getUserInfo, useLicense } from "@/api/abroad/index.js";
import { listBbzAdd } from "@/api/certificate/index";
const visible = ref(false);
const title = ref("发起办(补)证");
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const userInfoOptions = ref([]);
const timer = ref("");
const checkGroup = ref([
  { name: "普通护照", checked1: false, checked2: false },
  { name: "往来台湾通行证", checked1: false, checked2: false },
  { name: "往来港澳通行证", checked1: false, checked2: false }
]);
const rules = ref({
  showName: [
    { required: true, message: "姓名不能为空", trigger: ["blur", "change"] }
  ],
  dwzm: [
    {
      required: true,
      type: "array",
      message: "请上传",
      trigger: ["blur", "change"]
    }
  ],
  license: [{ required: true, message: "请选择证照类型", trigger: "blur" }]
});
// const roleList = ref([]);
const deptList = ref([]);
const deptName = ref("");
const licenseType = ref({
  10: "普通护照",
  20: "往来台湾通行证",
  30: "往来港澳通行证"
});
// const licenseStatus = ref({ 10: '未入库', 20: '已入库' });
const emit = defineEmits(["ok"]);
const sfzh = ref("");
const submitObj = reactive({});
const props = defineProps({
  //   isQg: {
  //     type: Boolean,
  //     default: true
  //   }
});
// 附件
const uploadRef = ref();
const dataMap = reactive({
  attachmentList: [],
  // 上传附件成功
  fileChange: UploadObject => {
    const fileList = Object.values(UploadObject);
    dataMap.attachmentList = fileList;
    queryParams.value.dwzm = fileList;
  },
  clearFileList() {
    uploadRef.value.clearAll();
  }
});
// 显示弹框
function show() {
  queryParams.value = {};
  checkGroup.value = [
    { name: "普通护照", checked1: false, checked2: false },
    { name: "往来台湾通行证", checked1: false, checked2: false },
    { name: "往来港澳通行证", checked1: false, checked2: false }
  ];
  visible.value = true;
  dataMap.attachmentList = [];
}
function save() {
  let flag = checkGroup.value.some(function (item, index, array) {
    return item.checked1;
  });
  let flag2 = checkGroup.value
    .filter(item => {
      return item.checked2;
    })
    .every(function (item, index, array) {
      return item.licenseNo || item.licenseNo === null;
    });
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      // 是否勾选证照
      if (!flag) {
        proxy.$modal.msgError("请选择证照类型");
        return;
      }
      if (!flag2) {
        proxy.$modal.msgError("请选择证号");
        return;
      }
      if (dataMap.attachmentList.length == 0) {
        proxy.$modal.msgError("请上传单位证明");
        return;
      }
      let arr = [];
      arr = checkGroup.value
        .filter(item => {
          return item.checked1;
        })
        .map(item => {
          return {
            czlx: item.checked2 ? 2 : 1,
            sfzh: sfzh.value,
            zjh: item.licenseNo,
            zzlx:
              item.name == "普通护照"
                ? 10
                : item.name == "往来台湾通行证"
                ? 20
                : 30
          };
        });
      let arr2 = dataMap.attachmentList.map(item => {
        return {
          attachName: item.name,
          attachPath: item.url
        };
      });
      let obj = {
        jwBbzs: arr,
        jwFtFiles: arr2
      };
      listBbzAdd(obj).then(res => {
        visible.value = false;
        emit("ok", submitObj);
      });
    }
  });
}
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
    }, 1000);
  }
}
function userInfoChange(value) {
  userInfoOptions.value.forEach(item => {
    if (item.id == value.id) {
      let obj = {
        name: item.name,
        sfzh: item.sfzh,
        oldDept: item.employer, // 老部门名称
        oldDeptId: item.deptId, // 老部门id
        oldDepartment: item.deptOfficeName, // 老科室名称
        oldDepartmentId: item.deptOfficeId, // 老科室id
        oldPosition: item.zw
      };
      Object.assign(submitObj, obj);
      queryParams.value.showName = item.name;
      if (item.employer != null) {
        queryParams.value.showName += "-" + item.employer;
      }
      if (item.deptOfficeName != null) {
        queryParams.value.showName += "-" + item.deptOfficeName;
      }
      if (item.zw != null) {
        queryParams.value.showName += "-" + item.zw;
      }
      if (item.sfzh != null) {
        queryParams.value.showName += "-" + item.sfzh;
      }
      sfzh.value = item.sfzh;
      useLicense({ sfzh: item.sfzh }).then(res => {
        checkGroup.value[0].licenseList = res.data
          .filter(item => {
            return item.hzlx == 10;
          })
          .map(item => {
            return {
              label: item.zjhm,
              value: item.zjhm
            };
          });
        checkGroup.value[0].licenseList.unshift({
          label: "无",
          value: null
        });
        checkGroup.value[0].licenseNo = "";

        checkGroup.value[1].licenseList = res.data
          .filter(item => {
            return item.hzlx == 20;
          })
          .map(item => {
            return {
              label: item.zjhm,
              value: item.zjhm
            };
          });
        checkGroup.value[1].licenseList.unshift({
          label: "无",
          value: null
        });
        checkGroup.value[1].licenseNo = "";

        checkGroup.value[2].licenseList = res.data
          .filter(item => {
            return item.hzlx == 30;
          })
          .map(item => {
            return {
              label: item.zjhm,
              value: item.zjhm
            };
          });
        checkGroup.value[2].licenseList.unshift({
          label: "无",
          value: null
        });
        checkGroup.value[2].licenseNo = "";
      });
    }
  });
}
function getUploadFile(value) {
  // console.log(value);
  // let fileName = getFileName(value)
  // let fileSuffix = fileName.split('.')[1]
  // signFile.fileName = fileName
  // signFile.fileSuffix = fileSuffix
  // signFile.url = value
}
// getDept();
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
