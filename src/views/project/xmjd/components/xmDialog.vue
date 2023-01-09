<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2022-05-11 09:34:11
 * @LastEditors: xkloveme
 * @Description: 发起
 * @FilePath: /la-ft-web/src/views/bulletin/notary/components/fqDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog :title="title" v-model="show" width="900px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" :rules="rules" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区：" prop="area">
              <el-select :disabled="!isEdit" v-model="form.area" placeholder="地区" size="small" clearable
                style="width: 200px">
                <el-option v-for="dict in dqArr" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input :disabled="!isEdit" v-model="form.projectName" placeholder="项目名称" clearable size="small"
                style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目简介：" prop="projectContent">
              <el-input :disabled="!isEdit" v-model="form.projectContent" placeholder="项目简介" clearable size="small"
                style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="列表图片：">
              <wt-upload :fileList="form.headImg ? [form.headImg] : []" :limit="1" :disabled="!isEdit"
                list-type="picture-card" accept="image/png,image/jpeg" @success="uploadSuccesstImageList" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目图片：">
              <wt-upload :fileList="form.fileList ? form.fileList : []" :disabled="!isEdit" list-type="picture-card"
                accept="image/png,image/jpeg" @success="uploadSuccesstImageList1" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item, index) in form.childList" :key="index">
          <el-row>
            <el-col :span="18">
              <el-form-item label="">
                <el-button type="primary" size="small">项目{{ index + 1 }}：</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="">
                <el-button size="small" :disabled="!isEdit" type="primary" @click="handleAddProject()">添加子项目</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" v-if="form.childList.length>1 && isDelet">
              <el-form-item label="">
                <!-- <div i-ep-close-bold @click="handleDelet(index)"></div> -->
                <el-button size="small" :disabled="!isEdit" type="danger" @click="handleDelet(item, index)">删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'blur'
              }" :prop="'childList.' + index + '.childName'">
                <el-input :disabled="!isEdit" v-model="item.childName" placeholder="项目名称" clearable size="small"
                  style="width: 210px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总投资额（万元）" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'blur'
              }" :prop="'childList.' + index + '.investTotal'">
                <el-input :disabled="!isEdit" v-model="item.investTotal" placeholder="总投资额（万元）" clearable size="small"
                  style="width: 210px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="完成投资（万元）" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'blur'
              }" :prop="'childList.' + index + '.investCompleted'">
                <el-input :disabled="!isEdit" v-model="item.investCompleted" placeholder="完成投资（万元）" clearable
                  size="small" style="width: 210px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="立项计划时间">
                <el-date-picker :disabled="!isEdit" v-model="item.projectPlanTime" type="date" placeholder="立项计划时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="立项进度" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'change'
              }" :prop="'childList.' + index + '.projectPlanProcess'">
                <el-select :disabled="!isEdit" v-model="item.projectPlanProcess" placeholder="立项进度" size="small"
                  clearable style="width: 200px">
                  <el-option v-for="dict in jdArr" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划招标时间">
                <el-date-picker :disabled="!isEdit" v-model="item.invitePlanTime" type="date" placeholder="计划招标时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="招标进度" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'change'
              }" :prop="'childList.' + index + '.invitePlanProcess'">
                <el-select :disabled="!isEdit" v-model="item.invitePlanProcess" placeholder="招标进度" size="small"
                  clearable style="width: 200px">
                  <el-option v-for="dict in jdArr" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划开工时间">
                <el-date-picker :disabled="!isEdit" v-model="item.kickoffPlanTime" type="date" placeholder="计划开工时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开工进度" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'change'
              }" :prop="'childList.' + index + '.kickoffPlanProcess'">
                <el-select :disabled="!isEdit" v-model="item.kickoffPlanProcess" placeholder="开工进度" size="small"
                  clearable style="width: 200px">
                  <el-option v-for="dict in jdArr" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划施工时间">
                <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled="!isEdit"
                  v-model="item.startEndTime" type="daterange" range-separator="至" start-placeholder="开始时间"
                  end-placeholder="结束时间" @change="(e) => changeDaterange(e, item)">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="施工进度" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'change'
              }" :prop="'childList.' + index + '.buildPlanProcess'">
                <el-select :disabled="!isEdit" v-model="item.buildPlanProcess" placeholder="施工进度" size="small" clearable
                  style="width: 200px">
                  <el-option v-for="dict in jdArr" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划竣工时间">
                <el-date-picker :disabled="!isEdit" v-model="item.completedPlanTime" type="date" placeholder="计划开工时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟竣工进度" :rules="{
                required: true, message: '项目名称不能为空', trigger: 'change'
              }" :prop="'childList.' + index + '.completedPlanProcess'">
                <el-select :disabled="!isEdit" v-model="item.completedPlanProcess" placeholder="开工进度" size="small"
                  clearable style="width: 200px">
                  <el-option v-for="dict in jdArr" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef)">确定</el-button>
        <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script setup>
import $api from "@/api";
import { ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    default: ""
  },
  isEdit: {
    type: Boolean,
    default: true
  },
  isDelet: {
    type: Boolean,
    default: true
  },
  title: {
    type: [Number, String],
    default: ""
  },
});
const rules = reactive({
  area: [{ required: true, message: '请选择地区', trigger: 'change' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  projectContent: [{ required: true, message: '请输入项目简介', trigger: 'blur' }],
  // childName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  // investTotal: [{ required: true, message: '请输入总投资额', trigger: 'blur' }],
  // investCompleted: [{ required: true, message: '请输入完成投资', trigger: 'blur' }],
  // projectPlanProcess: [{ required: true, message: '请选择立项进度', trigger: 'blur' }],
  // invitePlanProcess: [{ required: true, message: '请选择招标进度', trigger: 'blur' }],
  // kickoffPlanProcess: [{ required: true, message: '请选择开工进度', trigger: 'blur' }],
  // buildPlanProcess: [{ required: true, message: '请选择施工进度', trigger: 'blur' }],
  // completedPlanProcess: [{ required: true, message: '请选择拟竣工进度', trigger: 'blur' }],
})
let form = reactive({
  area: '',
  projectName: '',
  projectContent: '',
  fileList: null,
  headImg: null,
  childList: [{
    childName: '',
    investTotal: '',
    investCompleted: '',
    projectPlanTime: '',
    projectPlanProcess: '',
    invitePlanTime: '',
    invitePlanProcess: '',
    kickoffPlanTime: '',
    kickoffPlanProcess: '',
    buildPlanProcess: '',
    buildPlanTimeBegin: '',
    buildPlanTimeEnd: '',
    completedPlanTime: '',
    completedPlanProcess: '',
    startEndTime: []
  }]
});
let queryRef = ref(null);
// let startEndTime = ref([]);
function changeDaterange(value, item) {
  console.log(value, 99)
  item.startEndTime = value
  const [startTime, endTime] = value || [];
  item.buildPlanTimeBegin = startTime;
  item.buildPlanTimeEnd = endTime;
};
const dqArr = [
  {
    value: 0,
    label: '嘉善'
  },
  {
    value: 1,
    label: '吴江'
  },
  {
    value: 2,
    label: '青浦'
  }
]
const jdArr = [
  {
    value: 0,
    label: '暂无进度'
  },
  {
    value: 1,
    label: '正常'
  },
  {
    value: 2,
    label: '滞后'
  },
  {
    value: 3,
    label: '严重滞后'
  },
]
let show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
watch(
  () => props.modelValue,
  (val) => {
    queryRef.value?.resetFields()
    if (val && props.projectId) {
      $api.getPmdProjectDetail({ projectId: props.projectId }).then(res => {
        if (res.code == 200) {
          let arr = []
          res.data?.childList.map(n => {
            arr.push({ ...n, startEndTime: [n.buildPlanTimeBegin, n.buildPlanTimeEnd] })
          })
          form = Object.assign(form, { ...res.data, childList: arr })
          console.log(form)
        }
      })
    } else {
      form = Object.assign(form, {
        area: '',
        projectName: '',
        projectContent: '',
        fileList: null,
        headImg: null,
        childList: [{
          childName: '',
          investTotal: '',
          investCompleted: '',
          projectPlanTime: '',
          projectPlanProcess: '',
          invitePlanTime: '',
          invitePlanProcess: '',
          kickoffPlanTime: '',
          kickoffPlanProcess: '',
          buildPlanProcess: '',
          buildPlanTimeBegin: '',
          buildPlanTimeEnd: '',
          startEndTime: [],
          completedPlanTime: '',
          completedPlanProcess: '',
        }]
      })
    }
  }
);
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api[props.projectId ? 'putPmdProjectEdit' : 'postPmdProjectAdd']({ ...form, projectId: props.projectId ? props.projectId : undefined }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          form.area = ""
          form.projectName = ""
          form.projectContent = ""
          form.fileList = null
          form.headImg = null
          form.childList = [{
            childName: '',
            investTotal: '',
            investCompleted: '',
            projectPlanTime: '',
            projectPlanProcess: '',
            invitePlanTime: '',
            invitePlanProcess: '',
            kickoffPlanTime: '',
            kickoffPlanProcess: '',
            buildPlanProcess: '',
            buildPlanTimeBegin: '',
            buildPlanTimeEnd: '',
            startEndTime: [],
            completedPlanTime: '',
            completedPlanProcess: '',
          }]
          emit("refresh", true);
          proxy.$modal.msgSuccess("提交成功");
        } else {
          proxy.$modal.msgError(res?.msg);
        }
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
}

function uploadSuccesstImageList(e) {
  form.headImg = Object.values(e)[0];
}
function uploadSuccesstImageList1(e) {
  form.fileList = Object.values(e);
}
function cancel1() {
  show.value = false
  form.area = ""
  form.projectName = ""
  form.projectContent = ""
  form.fileList = null
  form.headImg = null
  form.childList = [{
    childName: '',
    investTotal: '',
    investCompleted: '',
    projectPlanTime: '',
    projectPlanProcess: '',
    invitePlanTime: '',
    invitePlanProcess: '',
    kickoffPlanTime: '',
    kickoffPlanProcess: '',
    buildPlanProcess: '',
    buildPlanTimeBegin: '',
    buildPlanTimeEnd: '',
    startEndTime: [],
    completedPlanTime: '',
    completedPlanProcess: '',
  }]
}
function handleAddProject() {
  form.childList.push({
    childName: '',
    investTotal: '',
    investCompleted: '',
    projectPlanTime: '',
    projectPlanProcess: '',
    invitePlanTime: '',
    invitePlanProcess: '',
    kickoffPlanTime: '',
    kickoffPlanProcess: '',
    buildPlanProcess: '',
    buildPlanTimeBegin: '',
    buildPlanTimeEnd: '',
    startEndTime: [],
    completedPlanTime: '',
    completedPlanProcess: '',
  })
}
function handleDelet(row,i) {
  let childId = row.childId
  // form.childList.splice(i, 1);
  if (childId) {
    ElMessageBox.alert("确定要删除该子项目?", {
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      title: "温馨提示",
      dangerouslyUseHTMLString: true,
      callback: action => {
        if (action === "confirm") {
          $api
            .deletePmdProjectdeleteChild(childId)
            .then(res => {
              if (res.code == 200) {
                proxy.$modal.msgSuccess("删除成功！");
                form.childList.splice(i, 1);
              }
            });
        }
      }
    })
  } else {
    form.childList.splice(i, 1);
  }

}
</script>
