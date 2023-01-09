<template>
  <el-dialog
    title="核查信息"
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请编号">{{ props.sqbh }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名">{{ queryParams.name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号">{{ queryParams.sfzh }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="工作单位">{{
            queryParams.employer
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在科室">{{
            queryParams.deptOfficeName
          }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务">{{ queryParams.zw }}</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="办理证照">
        <el-table :data="licenseList">
          <el-table-column label="证照类型" prop="zzlx">
            <template #default="scope">
              {{ zhlxDict[scope.row.zzlx] }}
            </template>
          </el-table-column>
          <el-table-column label="办证类型" prop="czlx">
            <template #default="scope">
              {{ handleLicenseType[scope.row.czlx] }}
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="单位证明">
        <el-link
          v-for="(item, index) in jwFtFile"
          :key="index"
          :icon="Download"
          type="primary"
          @click="openImg(item)"
        >
          {{ item.attachName }}
        </el-link>
      </el-form-item>
      <el-form-item label="核查结果" prop="result">
        <el-radio-group v-model="queryParams.result">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="驳回原因"
        prop="remark"
        v-if="queryParams.result == 0"
      >
        <el-input v-model="queryParams.remark" type="textarea"></el-input>
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
import { postBbzApproval } from "@/api/certificate/index";
import { zhlxDict } from "@/constant/abroad";
import { downloadFileIamge } from "@/utils/download";
import { Download } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
const queryParams = ref({});
const licenseList = ref([]);
const jwFtFile = ref([]);
const visible = ref(false);
const emit = defineEmits(["ok"]);
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
  sqbh: {
    type: String,
    default: ""
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
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      console.log("save提交");
      let obj = {
        taskId: props.taskId,
        result: queryParams.value.result
      };
      if (queryParams.value.result == 0) {
        Object.assign(obj, { remark: queryParams.value.remark });
      }
      postBbzApproval(obj).then(res => {
        visible.value = false;
        emit("ok");
      });
    }
  });
}
function openImg(item) {
  downloadFileIamge(item.attachPath, item.attachName);
}
watch(
  () => props.detailData,
  val => {
    queryParams.value = val.jwFtPerson;
    licenseList.value = val.jwBbzs;
    jwFtFile.value = val.jwFtFile;
  }
);
defineExpose({
  show
});
</script>
