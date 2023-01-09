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
  <el-dialog title="上传检查结果" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查结果：">
              <el-radio-group v-model="form.checkResult" @change="change2">
                <el-radio :label="1">存在问题</el-radio>
                <el-radio :label="0">未发现异常</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item, index) in form.problemList" :key="index" v-if="form.checkResult == 1">
          <el-row>
            <el-col :span="10">
              <el-form-item label="问题描述：">
                <el-input type="textarea" :rows="2" v-model="item.problem" placeholder="问题描述" clearable size="small"
                  style="width: 210px" />
              </el-form-item>
            </el-col>
            <el-col :span="2" v-if="index != 0" style="margin-top:2px">
              <el-form-item label="">
                <el-button size="small" type="primary" @click="handleDelet1(index)">删除</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-top:2px">
              <el-form-item label="">
                <el-button size="small" type="primary" @click="handleAddProject1()">添加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="附件：">
                <wt-upload :fileList="item.fileList ? item.fileList : []" list-type="picture-card"
                  accept="image/png,image/jpeg" @success="(e) => uploadSuccesstImageList(e, item)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="反馈给：">
                <el-checkbox-group v-model="item.feedbackParticipantsArea">
                  <el-checkbox label="0" name="">嘉善</el-checkbox>
                  <el-checkbox label="1" name="">吴江</el-checkbox>
                  <el-checkbox label="2" name="">青浦</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="24">
            <el-form-item label="工作场景：">
              <wt-upload :limit="1" :fileList="form.workScene ? form.workScene : []" list-type="picture-card"
                accept="image/png,image/jpeg" @success="uploadSuccesstImageList1" />
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
let { proxy } = getCurrentInstance();
let emit = defineEmits(["update:modelValue", "refresh"]);
let props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  scjcjgObj: {
    type: Object,
    default: () => { }
  },
});
let area = ref(null);
let form = reactive({
  workScene: [],
  checkResult: '',
  problemList: [
    {
      problem: "",
      fileList: [],
      feedbackParticipantsArea: []
    }
  ]
});
let queryRef = ref(null);
onMounted(() => {
  // $api.getPmdCollaborativesupervisionItem().then(response => {
  //   jdlxArr.value = response.data;
  // });
  if (user?.value?.area == "嘉善") {
    area.value = "0";
  } else if (user?.value?.area == "吴江") {
    area.value = "1";
  } else if (user?.value?.area == "青浦") {
    area.value = "2";
  }
});
let store = useStore();
let user = computed(() => store.state.user.user);
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
    queryRef.value?.resetFields()
    form = Object.assign(form)
    form.workScene = []
    form.checkResult = ''
    form.problemList = [
      {
        problem: "",
        fileList: [],
        feedbackParticipantsArea: []
      }
    ]
  }
);
function handleDelet1(i) {
  form.problemList.splice(i, 1);
}
function change2(e) {
  if (e == 0) {
    form.problemList = [{
      problem: "",
      fileList: [],
      feedbackParticipantsArea: []
    }]
  }
}
function handleAddProject1(i) {
  form.problemList.push({
    problem: "",
    fileList: [],
    feedbackParticipantsArea: []
  })
}
function uploadSuccesstImageList1(e) {
  form.workScene = Object.values(e);
}
function uploadSuccesstImageList(e, item) {
  item.fileList = Object.values(e);
}
function cancel1() {
  show.value = false
  form.workScene = []
  form.checkResult = ''
  form.problemList = [
    {
      problem: "",
      fileList: [],
      feedbackParticipantsArea: []
    }
  ]
}
// 字典 lajw_ft_swgz_content
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postCollaborativeSupervisionInfoAddCheckResult({ ...form, collaborativeSupervisionId: props.scjcjgObj.id, checkParticipantsArea: area.value }).then(res => {
        if (res?.code == 200) {
          emit("refresh", true);
          show.value = false;
          form.workScene = []
          form.checkResult = ''
          form.problemList = [
            {
              problem: "",
              fileList: [],
              feedbackParticipantsArea: []
            }
          ]
          proxy.$modal.msgSuccess("操作成功！");
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
</script>
