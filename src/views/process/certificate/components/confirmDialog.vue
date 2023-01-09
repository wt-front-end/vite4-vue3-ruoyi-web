<template>
  <el-dialog
    title="确认制作完成"
    v-model="visible"
    width="600px"
    top="5vh"
    append-to-body
    center
  >
    <el-form
      :model="queryParams"
      :rules="rules"
      ref="queryRef"
      label-width="80px"
      label-position="left"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">{{ queryParams.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">{{ queryParams.sfzh }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="color: #f00">请选择已制作完成的证照：</div>
    <div
      v-for="(item, index) in licenseList"
      :key="index"
      class="license-check-box"
    >
      {{ item.name }}
      <el-checkbox v-model="item.checked" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { postBbzAffirm } from "@/api/certificate/index";
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const licenseList = ref([]);
const visible = ref(false);
const emit = defineEmits(["ok"]);
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
  }
});
const rules = ref({
  result: [{ required: true, message: "请选择核查结果", trigger: "blur" }],
  remark: [{ required: true, message: "请输入", trigger: "blur" }]
});
const handleLicenseType = ref({
  1: "新办证",
  2: "补证"
});
// 显示弹框
function show() {
  visible.value = true;
}
function save() {
  console.log("save提交", licenseList.value);
  let flag = licenseList.value.some(function (item, index, array) {
    return item.checked;
  });
  if (!flag) {
    proxy.$modal.msgError("请选择制作完成的证照");
    return;
  }
  let idList = [];
  licenseList.value.map(item => {
    if (item.checked) {
      idList.push(item.id);
    }
  });
  console.log(idList);
  let obj = {
    param: idList.toString(),
    taskId: props.taskId
  };
  console.log("okok");
  postBbzAffirm(obj).then(res => {
    visible.value = false;
    console.log(res);
    emit("ok");
  });
}
watch(
  () => props.detailData,
  val => {
    queryParams.value = val.jwFtPerson;
    licenseList.value = val.jwBbzs.filter(item => {
      return item.zhzt == 3;
    });
    licenseList.value.map(item => {
      item.checked = false;
      if (item.zzlx == 10) {
        item.name = "普通护照";
      }
      if (item.zzlx == 20) {
        item.name = "往来台湾通行证";
      }
      if (item.zzlx == 30) {
        item.name = "往来港澳通行证";
      }
    });
  }
);
defineExpose({
  show
});
</script>
<style lang="scss" scoped>
.license-check-box {
  display: flex;
  justify-content: space-between;
}
</style>
