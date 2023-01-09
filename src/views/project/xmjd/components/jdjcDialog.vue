<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2022-04-24 09:48:07
 * @LastEditors: xkloveme
 * @Description: 审批记录
 * @FilePath: /la-ft-web/src/views/bulletin/notary/components/spjlDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog title="新增监督检查" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" :rules="rules" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查主题：" prop="checkTitle">
              <el-input type="textarea" :rows="2" :maxlength="10" v-model="form.checkTitle" placeholder="检查主题" clearable
                size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查日期：" prop="checkDate">
              <el-date-picker v-model="form.checkDate" type="date" placeholder="检查日期" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查情况：" prop="remark">
              <el-input type="textarea" :rows="2" :maxlength="10" v-model="form.remark" placeholder="检查情况" clearable
                size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <wt-upload :fileList="form.fileList ? form.fileList : []"
                @success="uploadSuccesstImageList" />
            </el-form-item>
          </el-col>
        </el-row>
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
let store = useStore();
let user = computed(() => store.state.user.user);
let area = ref(null);
const queryRef = ref(null);
const show = computed({
  get: () => {
    // queryRef.value?.resetFields()
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
onMounted(() => {
  if (user?.value?.area == "嘉善") {
    area.value = "0";
  } else if (user?.value?.area == "吴江") {
    area.value = "1";
  } else if (user?.value?.area == "青浦") {
    area.value = "2";
  }
});
const rules = reactive({
  checkTitle: [{ required: true, message: '请输入检查主题', trigger: 'blur' }],
  checkDate: [{ required: true, message: '请选择检查日期', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入检查情况', trigger: 'blur' }],
})
let form = reactive({
  area:area.value,
  checkTitle: '',
  checkDate: '',
  fileList: [],
  remark: '',
  problemList: [{ remark: '' }]
});
watch(
  () => props.modelValue,
  () => {
    queryRef.value?.resetFields()
    form = Object.assign(form, props.projectId)
    form.fileList =[]
  }
);
function handleAddProject() {
  form.problemList.push({
    remark: '',
  })
}
function handleDelet(i) {
  form.problemList.splice(i, 1);
}
function uploadSuccesstImageList(e) {
  form.fileList = Object.values(e);
}
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      form.area = area.value
      $api.postPmdProjectAddInfo({ ...form, projectId: props.projectId }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("提交成功");
          form.checkTitle = '',
            form.checkDate = '',
            form.fileList = [],
            form.remark = '',
            form.problemList = [{ remark: '' }]
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
  form.checkTitle = '',
    form.checkDate = '',
    form.fileList = [],
    form.remark = '',
    form.problemList = [{ remark: '' }]
}
</script>
