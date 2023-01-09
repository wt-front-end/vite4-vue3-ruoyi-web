<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2023-01-09 10:12:51
 * @LastEditors: xkloveme
 * @Description: 审批记录
 * @FilePath: /RuoYi-Vue3/src/views/project/xmjd/components/wtmsListDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog title="新增问题清单" v-model="show" width="600px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="10">
            <el-form-item label="问题描述：">
              <el-input v-model="form.remark" placeholder="问题描述" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
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
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: [Number, String],
    default: ""
  },
  name: {
    type: [Number, String],
    default: null
  }
});
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
const queryRef = ref(null);
let form = reactive({
  checkTitle: '',
  checkDate: '',
  fileList: [],
  remark: '',
  problemList: [{ remark: '' }]
});
function handleAddProject() {
  form.problemList.push({
    remark: '',
  })
}
function uploadSuccesstImageList(e) {
  form.fileList = Object.values(e);
}
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postPmdProjectAddInfo({ ...form, projectId: props.projectId }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("提交成功");
          form = {
            checkTitle: '',
            checkDate: '',
            fileList: [],
            remark: '',
            problemList: [{ remark: '' }]
          };
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
function cancel1() {
  show.value = false;
  form = {
    checkTitle: '',
    checkDate: '',
    fileList: [],
    remark: '',
    problemList: [{ remark: '' }]
  };
}
</script>
