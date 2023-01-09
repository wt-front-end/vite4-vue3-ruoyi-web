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
  <el-dialog title="修改监督检查" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-form-item label="检查日期：" prop="checkDate">
            <el-date-picker v-model="form.checkDate" type="date" placeholder="检查日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查主题：" prop="projecheckTitlectContent">
              <el-input v-model="form.checkTitle" placeholder="检查主题" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查情况：" prop="remark">
              <el-input v-model="form.remark" placeholder="检查情况" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：" prop="headImg">
              <wt-upload :fileList="form.fileList" list-type="picture-card" accept="image/png,image/jpeg"
                @success="uploadSuccesstImageList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-button size="small" type="primary" style="margin-bottom:12px" @click="handleAddProject()">新增问题描述</el-button> -->
      <!-- <div>问题描述</div> -->
      <div v-for="(item, index) in form.problemList" :key="index">
        <el-row>
          <el-col :span="10">
            <el-form-item label="问题描述：">
              <el-input v-model="item.remark" placeholder="问题描述" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
          <el-col :span="2" v-if="index != 0" style="margin-top:2px">
            <el-form-item label="">
              <el-button size="small" type="primary" @click="handleDelet(index)">删除</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-top:2px">
            <el-form-item label="">
              <el-button size="small" type="primary" @click="handleAddProject()">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- <wt-table ref="wtTableList" style="width: 94%;" :columns="newColumns" :tableData="form.problemList"
        :isDataV="false">
        <template #action="{ scope }">
          <el-button size="small" type="text" @click="handleSczg(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelet(scope.row)">删除</el-button>
        </template>
      </wt-table> -->
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef)">确定</el-button>
        <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- <wtmsListDialog v-model="showWtqd" @refresh="handleQuery" /> -->
</template>
<script setup>
import $api from "@/api";
import { columns1 } from "./table.js";
// import wtmsListDialog from "./wtmsListDialog";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editProjectId: {
    type: [Number, String],
    default: ""
  },
  isEdit: {
    type: Boolean,
    default: true
  },
  jdjcDetailObj: {
    type: Object,
    default: () => { }
  },
});
const newColumns = columns1();
let form = reactive({
  checkDate: '',
  checkTitle: '',
  remark: '',
  fileList: []
});
let queryRef = ref(null);
let startEndTime = ref([]);
let showWtqd = ref(false);
let changeDaterange = value => {
  const [startTime, endTime] = value || [];
  form.childList.buildPlanTimeBegin = startTime;
  form.childList.buildPlanTimeEnd = endTime;
};
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
  () => {
    form = Object.assign(form, props.jdjcDetailObj)
  }
);
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postPmdProjectEditInfo({ ...form, projectId: props.editProjectId, infoId: props.jdjcDetailObj.infoId }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("修改成功");
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
  form.fileList = Object.values(e);
}
function cancel1() {
  show.value = false
}
function handleAddProject() {
  form.problemList.push({
    remark: '',
  })
}
function handleDelet(i) {
  form.problemList.splice(i, 1);
}




</script>
