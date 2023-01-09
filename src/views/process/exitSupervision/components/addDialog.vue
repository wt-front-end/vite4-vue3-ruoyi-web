<template>
  <div>
    <el-dialog
      :title="title"
      v-model="visible"
      width="1000px"
      top="5vh"
      append-to-body
      center
    >
      <el-form :model="queryParams" :inline="true" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleDownload"
              :disabled="roleList.length == 0"
              >下载撤销备案表</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="showAddDialog"
              >添加人员</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="roleList">
          <el-table-column label="姓名" prop="name" width="100" />
          <el-table-column label="出生日期" prop="csrq" width="100" />
          <el-table-column label="性别" prop="gender" width="80">
            <template #default="scope">
              {{ scope.row.gender == 0 ? "男" : "女" }}
            </template>
          </el-table-column>
          <el-table-column label="身份证号" prop="sfzh" width="180" />
          <el-table-column label="工作单位" prop="employer" width="120" />
          <el-table-column label="人事主管单位" prop="zgdw" width="120" />
          <el-table-column label="户口所在地" prop="household" width="120" />
          <el-table-column label="报送单位名称" prop="dept_name" width="120" />
          <el-table-column label="报送单位类别" prop="dept_type" width="120">
            <template #default="scope">
              {{ deptType[scope.row.dept_type] }}
            </template>
          </el-table-column>
          <el-table-column
            label="报送单位联系人"
            prop="nick_name"
            width="120"
          />
          <el-table-column
            label="报送单位联系电话"
            prop="phonenumber"
            width="140"
          />
          <el-table-column label="入库批号" prop="in_batth" width="120" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
          <el-button type="primary" @click="temporaryStorage">暂存</el-button>
          <el-button type="primary" @click="save">提交</el-button>
        </div>
      </template>
      <el-dialog
        title="添加人员"
        v-model="personVisible"
        width="600px"
        top="10vh"
        append-to-body
        center
      >
        <el-form
          :model="personParams"
          label-suffix=":"
          ref="queryRef"
          :rules="rules"
        >
          <el-form-item label="人员" prop="showName">
            <el-select
              class="w-100"
              v-model="personParams.showName"
              placeholder="请输入"
              filterable
              remote
              value-key="id"
              :remote-method="remoteMethod"
              @change="userInfoChange"
            >
              <el-option
                v-for="item in userInfoOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            {{ personParams.sfzh }}
          </el-form-item>
          <el-form-item label="性别">
            {{
              personParams.gender == 0
                ? "男"
                : personParams.gender == 1
                ? "女"
                : ""
            }}
          </el-form-item>
          <el-form-item label="手机号码">
            {{ personParams.sjhm }}
          </el-form-item>
          <el-form-item label="工作单位">
            {{ personParams.employer }}
          </el-form-item>
          <el-form-item label="职级">
            {{
              personParams.is_qggb == 1
                ? "非区管干部"
                : personParams.is_qggb == 0
                ? "区管干部"
                : ""
            }}
          </el-form-item>
          <el-form-item label="职务">
            {{ personParams.zw }}
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="addPerson">添加</el-button>
          </div>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script setup>
import {
  getSelectPenson,
  postDraft,
  postAdd
} from "@/api/exitSupervision/index";
import { getUserInfo } from "@/api/abroad/index.js";
import { postExportTempFile } from "@/api/exitSupervision/index";
const { proxy } = getCurrentInstance();
const store = useStore();
const visible = ref(false);
const personVisible = ref(false);
const title = ref("发起退出监察范围");
const queryParams = ref({});
const personParams = ref({});
const roleList = ref([]);
const deptType = ref({
  1: "纪委监委",
  2: "镇街派驻",
  3: "监督单位",
  4: "街道",
  5: "村社"
});
const userInfoOptions = ref([]);
const userInfo = store.state.user.user; //登录用户信息
const timer = ref("");
const emit = defineEmits(["ok"]);
const rules = ref({
  showName: [{ required: true, message: "请输入", trigger: "blur" }],
  bab: [
    { required: true, type: "array", message: "请上传", trigger: ["change"] }
  ]
});
// 附件
const uploadRef = ref();
const dataMap = reactive({
  attachmentList: [
    // {
    // name: "1.png",
    // url:
    //   "https://hltm.jw.linan.gov.cn/linanjiwei/la-ft/8f017d01-25b2-4dd8-9a7f-1719765f0bbf.jpg?Expires=2145887999&OSSAccessKeyId=mZ5ZLpSMBbY1nNU0&Signature=Wk%2B7mXdkIE8dlFJAfiahRJZDOBg%3D",
    // },
  ],
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
  visible.value = true;
  roleList.value = [];
  dataMap.attachmentList = [];
}
function addPerson() {
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      let date = new Date();
      let year = date.getFullYear().toString().substr(2, 2);
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = date.getDate();
      console.log(year, month, day);
      let deptCode = userInfo.dept.deptCode;
      if (deptCode.length > 10) {
        deptCode = deptCode.slice(-10, -1);
      }
      let in_batth = (deptCode || "") + year + month + day;
      console.log("in_batth", in_batth);
      let obj = {
        in_batth: in_batth,
        nick_name: userInfo.userName,
        dept_name: userInfo.dept.deptName,
        dept_type: userInfo.dept.deptType,
        phonenumber: userInfo.phonenumber
      };
      Object.assign(personParams.value, obj);
      console.log(personParams.value);
      let flag = roleList.value.every(function (item, index, array) {
        return item.sfzh != personParams.value.sfzh;
      });
      if (flag) {
        roleList.value.push(personParams.value);
        personVisible.value = false;
      } else {
        proxy.$modal.msgError("已有该人员");
      }
    }
  });
}
function handleDelete(row) {
  for (let i = 0; i < roleList.value.length; i++) {
    if (roleList.value[i].id == row.id) {
      roleList.value.splice(i, 1);
      return;
    }
  }
}
function userInfoChange(val) {
  personParams.value = val;
  personParams.value.showName = val.name + "-" + val.sfzh;
}
function remoteMethod(query) {
  if (query) {
    // const params = {
    //   userName: query
    // };
    const queryParams = {
      page: 1,
      pageSize: 9999,
      personName: query
    };
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      //   getUserInfo(params).then(res => {
      //     userInfoOptions.value = res.data;
      //   });
      getSelectPenson(queryParams).then(res => {
        userInfoOptions.value = res.data;
        console.log(res);
      });
    }, 500);
  }
}
function showAddDialog() {
  personVisible.value = true;
  personParams.value = {};
}
//暂存
function temporaryStorage() {
  if (roleList.value.length == 0) {
    proxy.$modal.msgError("请添加人员");
    return;
  }
  // if (dataMap.attachmentList.length == 0) {
  //   proxy.$modal.msgError('请上传撤销备案表');
  //   return;
  // }
  let pensons = roleList.value.map(item => {
    return {
      personId: item.id,
      deptId: item.dept_id,
      inBatch: item.in_batth
    };
  });
  console.log(roleList.value);
  // let pensons = [{personId: 9,deptId: 64, inBatch: '1234'}]
  let arr = dataMap.attachmentList.map(item => {
    return {
      fileName: item.name,
      url: item.url
    };
  });
  postDraft({ pensons: pensons, ossFile: arr }).then(res => {
    emit("ok");
    visible.value = false;
    console.log(res);
  });
}
function save() {
  if (roleList.value.length == 0) {
    proxy.$modal.msgError("请添加人员");
    return;
  }
  if (dataMap.attachmentList.length == 0) {
    proxy.$modal.msgError("请上传撤销备案表");
    return;
  }
  // let pensons = [{personId: 9,deptId: 64, inBatch: '1234'}]
  let pensons = roleList.value.map(item => {
    return {
      personId: item.id,
      deptId: item.dept_id,
      inBatch: item.in_batth
    };
  });
  let arr = dataMap.attachmentList.map(item => {
    return {
      fileName: item.name,
      url: item.url
    };
  });
  postAdd({ pensons: pensons, ossFile: arr }).then(res => {
    emit("ok");
    visible.value = false;
    console.log(res);
  });
}
async function handleDownload() {
  console.log(roleList.value);
  let arr = roleList.value.map(item => {
    return {
      xm: item.name,
      csrq: item.csrq,
      xb: item.gender == 0 ? "男" : "女",
      sfzh: item.sfzh,
      gzdw: item.employer,
      rszgdw: item.zgdw,
      hkszd: item.household,
      bsdwmc: item.dept_name,
      bsdwlb: deptType.value[item.dept_type],
      bsdwlxr: item.nick_name,
      bsdwlxdh: item.phonenumber,
      rkph: item.in_batth
    };
  });
  let data = await postExportTempFile(arr);
  proxy.$download.link(data.msg);
}
defineExpose({
  show
});
</script>
