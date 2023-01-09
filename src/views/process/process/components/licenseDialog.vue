<template>
  <el-dialog
    title="证照入库"
    v-model="visible"
    width="1200px"
    top="5vh"
    append-to-body
    center
  >
    <el-form
      :model="queryParams"
      :rules="queryFormRules"
      ref="queryRef"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请编号">
            {{ queryParams.applyNo }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名">
            {{ queryParams.name }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="证照状态" prop="license">
        <el-table :data="queryParams.licenseList">
          <el-table-column label="证照编号" prop="zjhm" width="120" />
          <el-table-column label="证照类型" prop="hzlx" width="120">
            <template #default="scope">
              {{ zhlxDict[scope.row.hzlx] }}
            </template>
          </el-table-column>
          <el-table-column label="签发地点" prop="signAdress" width="120" />
          <el-table-column label="签发时间" prop="zjqfrq" width="120" />
          <el-table-column label="有效期" prop="validityDate" />
          <el-table-column label="原状态" prop="oldStatus" width="120">
            <template #default="scope">
              {{ licenseStatus[scope.row.oldStatus] }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="newStatus" width="120">
            <template #default="scope">
              <el-form-item
                :prop="`licenseList.${scope.$index}.newStatus`"
                :rules="queryFormRules.newStatus"
              >
                <el-select
                  v-model="scope.row.newStatus"
                  placeholder="请选择状态"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in statusSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
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
import { getLicenseById, updateRelieveGuard } from "@/api/process/index";
import { zhlxDict } from "@/constant/abroad";
const visible = ref(false);
const queryParams = ref({});
const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);
const props = defineProps({
  id: {
    type: Number,
    default: 1
  },
  taskId: {
    type: Number,
    default: 1
  },
  detailData: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
// const licenseList = ref([]);
const statusOption = [
  { label: "已入库", value: 0 },
  { label: "未入库", value: 1 }
];
const licenseStatus = ref({ 10: "未入库", 20: "已入库" });
const statusSelectList = ref([
  { value: 10, label: "未入库" },
  { value: 20, label: "已入库" }
]);
const queryFormRules = ref({
  // license: [
  //   {
  //     required: true,
  //     message: '请选择',
  //     trigger: ['blur', 'change']
  //   }
  // ],
  newStatus: [
    {
      required: true,
      message: "请选择",
      trigger: ["blur", "change"]
    }
  ]
});
// 显示弹框
function show() {
  //   queryParams.roleId = props.roleId;
  //   getList();
  visible.value = true;
}
function save() {
  let flag = queryParams.value.licenseList.some(function (item, index, array) {
    return item.newStatus == null;
  });
  if (flag) {
    proxy.$modal.msgError("请选择证照状态");
  }
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      visible.value = false;
      let obj = {
        relieveCertificateList: queryParams.value.licenseList,
        taskId: props.taskId,
        result: 1
      };
      updateRelieveGuard(obj).then(res => {
        console.log(res);
        emit("ok");
      });
    } else {
      console.log("false");
    }
  });
}
watch(
  () => props.detailData,
  val => {
    queryParams.value = val;
    queryParams.value.licenseList = val.jwRelieveCertificateList;
    // queryParams.value.licenseList.map((item)=>{
    //   item.newStatus = null
    // })
  }
);
defineExpose({
  show
});
</script>
