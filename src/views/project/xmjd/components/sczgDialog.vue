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
  <el-dialog title="上传整改情况" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述：" prop="area">
              {{ props.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- <el-form-item label="整改状态：" prop="projectName">

            </el-form-item> -->
            <el-form-item label="整改状态：" prop="status" :rules="{
              required: true,
              message: '请选择整改状态',
              trigger: 'blur'
            }">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">整改中</el-radio>
                <el-radio :label="1">已整改</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改情况：" prop="projectContent">
              <el-input type="textarea" :rows="2" v-model="form.content" placeholder="整改情况" clearable size="small"
                style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：" prop="area">
              <wt-upload :fileList="form.fileList ? form.fileList : []" @success="uploadSuccesstImageList1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef)">上传</el-button>
        <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  problemId: {
    type: [Number, String],
    default: ""
  },
  name: {
    type: [Number, String],
    default: null
  }
});
const form = reactive({
  content: '',
  fileList: [],
  status: ''
});
const queryRef = ref(null);
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postPmdProjectAddRectify({ ...form, problemId: props.problemId }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          form.content = '',
            form.fileList = [],
            form.status = ''
          proxy.$modal.msgSuccess("上传成功");
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
function uploadSuccesstImageList1(e) {
  form.fileList = Object.values(e);
}
function cancel1() {
  show.value = false
  form.content = '',
    form.fileList = [],
    form.status = ''
}




</script>
