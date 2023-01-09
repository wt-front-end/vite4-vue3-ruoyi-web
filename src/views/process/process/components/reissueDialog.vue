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
        {{ props.name }}
      </el-form-item>
      <el-form-item label="移交证照" prop="license">
        <el-table :data="licenseList">
          <el-table-column label="证照编号" prop="zjhm" width="120" />
          <el-table-column label="证照类型" prop="hzlx" width="120">
            <template #default="scope">
              {{ zhlxDict[scope.row.hzlx] }}
            </template>
          </el-table-column>
          <el-table-column label="签发地点" prop="signAdress" width="120" />
          <el-table-column label="签发机关" prop="signAdress" width="120" />
          <el-table-column label="签发时间" prop="zjqfrq" width="120" />
          <el-table-column label="有效期" prop="validityDate" />
          <el-table-column label="状态" prop="inStatus" width="120">
            <template #default="scope">
              {{ licenseStatus[scope.row.inStatus] }}
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="新工作单位" prop="employer" :inline="true">
        {{ props.newDept }}
        <!-- <el-select
          v-model="queryParams.employer"
          placeholder="新工作单位"
          clearable
          size="small"
          style="width: 240px"
          value-key="deptId"
          filterable
          @change="employerChange"
        >
          <el-option
            v-for="item in roleList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="提拔为区管干部" prop="isPromote">
        {{ props.isPromote ? "是" : "否" }}
        <!-- <el-radio-group v-model="queryParams.isPromote">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group> -->
      </el-form-item>
      <el-form-item label="撤销备案表" prop="bab">
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
        <el-button type="primary" @click="save">保存换岗</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { getUserInfo, useLicense } from "@/api/abroad/index.js";
import { listDept } from "@/api/system/dept";
import { postChangeReissue } from "@/api/process/index";
import { zhlxDict } from "@/constant/abroad";
const visible = ref(false);
const title = ref("发起人员换岗（非区管干部）");
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const userInfoOptions = ref([]);
const timer = ref("");
const licenseList = ref([]);
const rules = ref({
  bab: [
    { required: true, type: "array", message: "请上传", trigger: ["change"] }
  ]
  // showName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  // employer: [{ required: true, message: '请选择新工作单位', trigger: 'blur' }],
  // isPromote: [
  //   { required: true, message: '请选择是否提拔为区管干部', trigger: 'blur' }
  // ]
});
const roleList = ref([]);
const deptList = ref([]);
const deptName = ref("");
const licenseStatus = ref({ 10: "未入库", 20: "已入库" });
const emit = defineEmits(["ok"]);
const submitObj = reactive({ type: 2 });
const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  sfzh: {
    type: Boolean,
    default: true
  },
  id: {
    type: String,
    default: ""
  },
  taskId: {
    type: String,
    default: ""
  },
  newDept: {
    type: String,
    default: ""
  },
  newDeptId: {
    type: String,
    default: ""
  },
  isPromote: {
    type: Boolean,
    default: null
  },
  oldZgdwId: {
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
    queryParams.value.bab = fileList;
  },
  clearFileList() {
    uploadRef.value.clearAll();
  }
});
// 显示弹框
function show() {
  //   getList();
  visible.value = true;
  licenseList.value = [];
  queryParams.value = {};
  dataMap.attachmentList = [];
}
function save() {
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      if (dataMap.attachmentList.length == 0) {
        proxy.$modal.msgError("请上传撤销备案表");
        return;
      }
      let arr = dataMap.attachmentList.map(item => {
        return {
          attachName: item.name,
          attachPath: item.url
        };
      });
      Object.assign(submitObj, {
        id: props.id,
        isPromote: props.isPromote,
        newDeptId: props.newDeptId, // 新部门id
        newDept: props.newDept, // 新部门id
        oldZgdwId: props.oldZgdwId
      });
      // todo 需要加备案表 bab
      let obj = {
        relieveGuard: submitObj,
        files: arr //文件
      };
      postChangeReissue(obj, { taskId: props.taskId }).then(res => {
        visible.value = false;
        console.log(res);
        emit("ok");
      });
    }
  });
}
// function remoteMethod(query) {
//   if (query) {
//     const params = {
//       userName: query
//     };
//     clearTimeout(timer.value);
//     timer.value = setTimeout(() => {
//       getUserInfo(params).then(res => {
//         userInfoOptions.value = res.data;
//       });
//     }, 1000);
//   }
// }
function getDept() {
  listDept({ parentId: 1, deptName: deptName.value }).then(response => {
    console.log(response);
    roleList.value = response.data;
  });
}
// 选择新单位/部门
function employerChange(value) {
  // queryParams.value.deptOfficeId = null;
  let obj = {
    newDept: value.deptName, // 新部门名称
    newDeptId: value.deptId, // 新部门id
    oldZgdwId: value.zgdwId
  };
  Object.assign(submitObj, obj);
  // listDept({ parentId: value.deptId, deptName: deptName.value }).then(
  //   response => {
  //     console.log(response.data);
  //     deptList.value = response.data;
  //   }
  // );
}
// 选择新科室
// function officeChange(value) {
//   let obj = {
//     newDepartment: value.deptName, //新科室名称
//     newDepartmentId: value.deptId //新科室id
//   };
//   Object.assign(submitObj, obj);
// }
// function userInfoChange(value) {
//   console.log(value);
//   userInfoOptions.value.forEach(item => {
//     if (item.id == value.id) {
//       console.log(item);
//       let obj = {
//         name: item.name,
//         sfzh: item.sfzh,
//         oldDept: item.employer, // 老部门名称
//         oldDeptId: item.deptId, // 老部门id
//         oldDepartment: item.deptOfficeName, // 老科室名称
//         oldDepartmentId: item.deptOfficeId, // 老科室id
//         oldPosition: item.zw
//       };
//       Object.assign(submitObj, obj);
//       queryParams.value.name =
//         item.name +
//         '-' +
//         item.employer +
//         '-' +
//         item.deptOfficeName +
//         '-' +
//         item.zw +
//         '-' +
//         item.sfzh;
//       useLicense({ sfzh: item.sfzh }).then(res => {
//         licenseList.value = res.data;
//         console.log(licenseList.value);
//       });
//     }
//   });
// }
watch(
  () => props.sfzh,
  val => {
    // queryParams.value = {}
    useLicense({ sfzh: val }).then(res => {
      licenseList.value = res.data;
      console.log(licenseList.value);
    });
    // if(val){
    //   submitObj.type = 1
    //   title.value = '发起人员换岗（区管干部）'
    // }else {
    //   submitObj.type = 2
    //   title.value = '发起人员换岗（非区管干部）'
    // }
    console.log("是否区管", val);
  }
);
getDept();
defineExpose({
  show
});
</script>
