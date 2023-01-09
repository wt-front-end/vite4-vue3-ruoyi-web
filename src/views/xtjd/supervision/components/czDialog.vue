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
  <el-dialog title="处置" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" :rules="rules" ref="queryRef1" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述：">
              {{ czObj.problem }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处置结果：" prop="feedbackResult">
              <el-radio-group v-model="form.feedbackResult" @change="change2">
                <el-radio :label="1">查实</el-radio>
                <el-radio :label="0">查否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处置内容：" prop="feedbackContent">
              <el-input type="textarea" :rows="2" v-model="form.feedbackContent" placeholder="处置内容" clearable
                size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="挽回损失：" prop="saveMoney">
              <el-input v-model="form.saveMoney" placeholder="挽回损失" clearable size="small" style="width: 210px" />元
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item, index) in form.resultList" :key="index">
          <el-row>
            <el-col :span="10">
              <el-form-item label="责任追究：">
                <el-select v-model="item.result" placeholder="处置结果" size="small" clearable style="width: 200px"
                  @change="change1">
                  <el-option v-for="dict in czjgArr" :key="dict.value" :label="dict.label" :value="dict.label" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="">
                <el-input v-model="item.number" placeholder="处置人数" clearable size="small" style="width: 210px" />
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
        </div>
        <div v-for="(item, index) in form.systemList" :key="index">
          <el-row>
            <el-col :span="10">
              <el-form-item label="制度建设：">
                <el-input v-model="item.zdmc" placeholder="制度建设" clearable size="small" style="width: 210px" />
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

        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <wt-upload :fileList="form.fileList ? form.fileList : []" list-type="picture-card"
                accept="image/png,image/jpeg" @success="uploadSuccesstImageList1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef1)">确定</el-button>
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
  czObj: {
    type: Object,
    default: () => { }
  },
  czId: {
    type: [Number, String],
    default: ""
  },
});
let area = ref(null);
let store = useStore();
let user = computed(() => store.state.user.user);
let rules = reactive({
  feedbackResult: [{ required: true, message: '请选择处置结果', trigger: 'blur' }],
  feedbackContent: [{ required: true, message: '请输入处置内容', trigger: 'blur' }],
  saveMoney: [{ required: true, message: '请输入挽回损失', trigger: 'blur' }],
})
let form = reactive({
  fileList: [],
  feedbackContent: '',
  saveMoney: '',
  feedbackResult: 1,
  resultList: [{
    result: "",
    number: "",
  }],
  systemList: [{ zdmc: '' }]
});
watch(
  () => props.modelValue,
  () => {
    queryRef1.value?.resetFields()
    form = Object.assign(form, {
      fileList: [],
      feedbackContent: '',
      saveMoney: '',
      feedbackResult: 1,
      resultList: [{
        result: "",
        number: "",
      }],
      systemList: [{ zdmc: '', }]
    })
  }
);
let { feedback_result } = proxy.useDict("feedback_result");

let czjgArr = computed(() => {
  let str = ''
  if (form.resultList.length == 1 && form.resultList?.[0]?.result == '') {
    return feedback_result.value
  } else {
    form.resultList.map((i) => {
      str += i.result;
    });
    return feedback_result.value.filter(
      (i) => !str.includes(i.label)
    );
  }
});

let queryRef1 = ref(null);
let supervisionTypeArr = ref([])
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
let show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
function handleDelet(i) {
  form.systemList.splice(i, 1);
}
function handleAddProject(i) {
  form.systemList.push({
    zdmc: '',
  })
}
function handleDelet1(i) {
  form.resultList.splice(i, 1);
}
function handleAddProject1(i) {
  form.resultList.push({
    result: "",
    number: "",
  })
}
function uploadSuccesstImageList1(e) {
  form.fileList = Object.values(e);
}
function change1(e) {
  console.log(e, 99999)
  supervisionTypeArr.value = e
  form.supervisionType = e.toString();
}
function change2(e) {
  console.log(e, 99999)
  if (e == "1") {
    form.feedbackContent = "";
    form.saveMoney = "";
  } else {
    form.feedbackContent = "经核查，未发现问题";
    form.saveMoney = 0;
  }
}
function cancel1() {
  show.value = false
  form.fileList = []
  form.feedbackContent = ''
  form.saveMoney = ''
  form.feedbackResult = 1
  form.resultList = [{
    result: "",
    number: ""
  }]
  form.systemList = [{ zdmc: '' }]
}
// 字典 lajw_ft_swgz_content
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      let arr = []
      form.systemList.map(item => {
        arr.push(item.zdmc)
      })
      console.log(valid, formEl,9999)
      // { ...form, id: props.czId,systemList: arr, collaborativeSupervisionId: props.czObj.id, area: area.value }
      $api.postCollaborativeSupervisionInfoFeedbackProblem({ ...form, id: props.czObj.id,systemList: arr, collaborativeSupervisionId: props.czId, area: area.value }).then(res => {
        if (res?.code == 200) {
          emit("refresh", true);
          show.value = false;
          form.fileList = []
          form.feedbackContent = ''
          form.saveMoney = ''
          form.feedbackResult = 1
          form.resultList = [{
            result: "",
            number: ""
          }]
          form.systemList = [{ zdmc: '' }]
          proxy.$modal.msgSuccess("发起成功！");
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
