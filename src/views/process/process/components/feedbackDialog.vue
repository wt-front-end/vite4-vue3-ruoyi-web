<template>
  <el-dialog
    title="反馈人员备案结果"
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
      label-width="120px"
    >
      <div>1-纳管人员</div>
      <el-row>
        <el-col :span="4">
          <el-form-item label="姓名">
            {{ queryParams.name }}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="性别">
            {{ queryParams.gender == 0 ? "男" : "女" }}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="出生日期">
            {{ queryParams.csrq }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号">
            {{ queryParams.sfzh }}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号码">
            {{ queryParams.sjhm }}
          </el-form-item>
        </el-col>
      </el-row>
      <div>2-登记备案</div>
      <el-row>
        <el-col :span="4">
          <el-form-item label="工作单位">{{
            queryParams.newDept
          }}</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="职务">
            {{ queryParams.newPosition }}
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="职级">
            {{ queryParams.isQggb == 0 ? "区管干部" : "非区管干部" }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人事主管单位">
            {{ queryParams.newZgdw }}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="户口所在地">
            {{ queryParams.household }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="登记备案表">
        <span
          v-for="(item, index) in queryParams.jwFtFileList"
          :key="index"
          @click="openImg(item)"
          style="cursor: pointer; margin-right: 30px; color: #409eff"
        >
          {{ item.attachName }}</span
        >
      </el-form-item>
      <div>3-撤销备案</div>
      <el-row>
        <el-col :span="6">
          <el-form-item label="工作单位">{{
            queryParams.oldDept
          }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="人事主管单位">{{
            queryParams.oldZgdw
          }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="户口所在地">
            {{ queryParams.household }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报送单位名称">
            {{ queryParams.oldZgdw }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="报送单位类别">
            {{ deptType[queryParams.createByDeptType] }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报送单位联系人">{{
            queryParams.createBy
          }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报送单位联系电话">
            {{ queryParams.createByPhone }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入库批号">
            {{ queryParams.putStorageNo }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="撤销备案表">
        <span
          v-for="(item, index) in queryParams.jwFtFiles"
          :key="index"
          @click="openImg(item)"
          style="cursor: pointer; margin-right: 30px; color: #409eff"
        >
          {{ item.attachName }}</span
        >
      </el-form-item>
      <div>4-反馈备案结果</div>
      <el-form-item label="换岗备案结果" prop="pass">
        <el-radio-group v-model="queryParams.pass">
          <el-radio :label="'1'">成功</el-radio>
          <el-radio :label="'0'">失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失败原因" prop="remark" v-if="queryParams.pass == 0">
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
import { postApprovalUn } from "@/api/process/index";
const emit = defineEmits(["ok"]);
const { proxy } = getCurrentInstance();
const visible = ref(false);
const queryParams = ref({});
// const approvalObj = ref({});
const deptType = ref({
  1: "纪委监委",
  2: "镇街派驻",
  3: "监督单位",
  4: "街道",
  5: "村社"
});
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
    type: Object,
    default: () => {
      return {};
    }
  }
});
const queryFormRules = ref({
  pass: [
    {
      required: true,
      message: "请选择",
      trigger: ["blur", "change"]
    }
  ],
  remark: [
    {
      required: true,
      message: "请输入",
      trigger: ["blur", "change"]
    }
  ]
});
// 显示弹框
function show() {
  //   getList();
  visible.value = true;
}
function save() {
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      visible.value = false;
      let query = {
        taskId: props.taskId,
        result: queryParams.value.pass
      };
      if (queryParams.value.pass == 0) {
        Object.assign(query, { remark: queryParams.value.remark });
      }
      postApprovalUn(query).then(res => {
        console.log(res);
        emit("ok");
      });
    }
  });
}
function openImg(item) {
  window.open(item.attachPath, item.attachName);
}
watch(
  () => props.detailData,
  val => {
    console.log("id", val);
    queryParams.value = val;
  }
);
defineExpose({
  show
});
</script>
