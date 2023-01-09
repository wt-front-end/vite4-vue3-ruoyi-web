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
      <el-form-item label="姓名">
        {{ queryParams.name }}
      </el-form-item>
      <el-form-item label="证照类型" prop="license" class="type-item">
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
                v-if="item.checked1"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in licenseList"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- <div><el-checkbox label="往来台湾通行证" /></div>
          <div><el-checkbox label="往来港澳通行证" /></div> -->
        <!-- </el-checkbox-group> -->
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
import { listBbzRetry } from "@/api/certificate/index";
const visible = ref(false);
const title = ref("发起办(补)证");
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const licenseList = ref([]);
const checkGroup = ref([
  { name: "普通护照", checked1: false, checked2: false },
  { name: "往来台湾通行证", checked1: false, checked2: false },
  { name: "往来港澳通行证", checked1: false, checked2: false }
]);
const rules = ref({
  // showName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  // employer: [{ required: true, message: '请选择新工作单位', trigger: 'blur' }],
  // isPromote: [
  //   { required: true, message: '请选择是否提拔为区管干部', trigger: 'blur' }
  // ]
  // license: [{ required: true, message: '请选择证照类型', trigger: 'blur' }]
  dwzm: [
    {
      required: true,
      type: "array",
      message: "请上传",
      trigger: ["blur", "change"]
    }
  ]
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
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
  taskId: {
    type: String,
    default: ""
  },
  sqbh: {
    type: String,
    default: ""
  }
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
watch(
  () => props.detailData,
  val => {
    queryParams.value = val.jwFtPerson;
    sfzh.value = val.jwFtPerson.sfzh;
    val.jwBbzs.map(item => {
      if (item.zzlx == 10) {
        checkGroup.value[0].id = item.id;
      } else if (item.zzlx == 20) {
        checkGroup.value[1].id = item.id;
      } else if (item.zzlx == 30) {
        checkGroup.value[2].id = item.id;
      }
    });
    useLicense({ sfzh: queryParams.value.sfzh }).then(res => {
      licenseList.value = res.data.map(item => {
        return item.zjhm;
      });
    });
    // licenseList.value = val.jwBbzs;
    // jwFtFile.value = val.jwFtFile;
  }
);
// 显示弹框
function show() {
  queryParams.value = {};
  checkGroup.value = [
    { name: "普通护照", checked1: false, checked2: false },
    { name: "往来台湾通行证", checked1: false, checked2: false },
    { name: "往来港澳通行证", checked1: false, checked2: false }
  ];
  dataMap.attachmentList = [];
  queryParams.value.dwzm = [];
  visible.value = true;
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
      return item.licenseNo;
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
            id: item.id,
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
        taskId: props.taskId,
        sqbh: props.sqbh,
        jwFtFiles: arr2
      };
      listBbzRetry(obj).then(res => {
        visible.value = false;
        console.log(res);
        emit("ok");
      });
    }
  });
}
function getUploadFile(value) {
  console.log(value);
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
