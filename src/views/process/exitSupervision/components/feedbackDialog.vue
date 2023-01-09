<template>
  <el-dialog
    :title="title"
    v-model="visible"
    width="1200px"
    top="5vh"
    append-to-body
    center
  >
    <el-form :model="queryParams" :rules="rules" ref="queryRef">
      <el-table :data="queryParams.list">
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
        <el-table-column label="报送单位联系人" prop="nick_name" width="120" />
        <el-table-column
          label="报送单位联系电话"
          prop="phonenumber"
          width="140"
        />
        <el-table-column label="入库批号" prop="in_batth" width="120" />
        <el-table-column
          label="撤销备案结果"
          prop="apply_status"
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <el-form-item
              :prop="`list.${scope.$index}.status`"
              :rules="rules.status"
            >
              <el-select
                v-model="scope.row.status"
                placeholder="请选择"
                size="small"
                clearable
              >
                <el-option
                  v-for="dict in licenseExitOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="reason" width="120" fixed="right">
          <template #default="scope">
            <el-form-item
              :prop="`list.${scope.$index}.reason`"
              :rules="scope.row.status == 1 ? rules.reason : rules.reason2"
            >
              <el-input v-model="scope.row.reason"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">提交反馈</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { postApply } from "@/api/exitSupervision/index";
const title = ref("反馈撤销备案结果");
const { proxy } = getCurrentInstance();
const visible = ref(false);
const emit = defineEmits(["ok"]);
// const roleList = ref([])
const deptType = ref({
  1: "纪委监委",
  2: "镇街派驻",
  3: "监督单位",
  4: "街道",
  5: "村社"
});
const licenseExitOption = ref([
  { label: "已撤销备案", value: 0 },
  { label: "撤销备案失败", value: 1 }
]);
const rules = ref({
  status: [{ required: true, message: "请选择", trigger: "blur" }],
  reason: [{ required: true, message: "请输入", trigger: "blur" }],
  reason2: [{ required: false, message: "请输入", trigger: "blur" }]
});
const queryParams = ref({});
const props = defineProps({
  // 数据
  list: {
    type: Array,
    default: () => []
  },
  id: {
    type: String,
    default: ""
  }
});
watch(
  () => props.list,
  val => {
    queryParams.value.list = val.map(item => {
      Object.assign(item, { reason: "", status: null });
      return item;
    });
  }
);

function show() {
  // queryParams.value.list = [];
  visible.value = true;
}
function save() {
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      let arr = queryParams.value.list.map(item => {
        return {
          id: item.id,
          status: item.status,
          reason: item.reason
        };
      });
      postApply({ id: props.id, pensons: arr }).then(res => {
        console.log(res);
        visible.value = false;
        emit("ok");
      });
    }
  });
}
defineExpose({
  show
});
</script>
