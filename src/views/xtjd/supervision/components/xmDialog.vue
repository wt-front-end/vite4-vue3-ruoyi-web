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
  <el-dialog title="发起监督" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" :rules="rules" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督类型：" prop="supervisionType">
              <el-select v-model="supervisionTypeArr" multiple placeholder="监督类型" size="small" clearable
                style="width: 200px" @change="change1">
                <el-option v-for="dict in jdlxArr" :key="dict.dictValue" :label="dict.dictLabel"
                  :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="我方参与人数：" prop="number">
              <el-input v-model="form.number" placeholder="我方参与人数" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督主题：" prop="theme">
              <el-input type="textarea" :rows="2" v-model="form.theme" placeholder="监督主题" clearable size="small"
                style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督日期（起）：" prop="dateBegin">
              <el-date-picker v-model="form.dateBegin" type="date" placeholder="监督日期（起）" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督日期（止）：" prop="dateEnd">
              <el-date-picker v-model="form.dateEnd" type="date" placeholder="监督日期（止）" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参与方：" prop="participantsList">
              <el-checkbox-group v-model="form.participantsList" @change="change2">
                <el-checkbox v-if="area != 0" label="0" name="">嘉善</el-checkbox>
                <el-checkbox v-if="area != 1" label="1" name="">吴江</el-checkbox>
                <el-checkbox v-if="area != 2" label="2" name="">青浦</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  }
});
let store = useStore();
let user = computed(() => store.state.user.user);
let area = ref(null);
let rules = reactive({
  supervisionType: [{ required: true, message: '请选择监督类型', trigger: 'blur' }],
  number: [{ required: true, message: '请输入我方参与人数', trigger: 'blur' }],
  theme: [{ required: true, message: '请输入监督主题', trigger: 'blur' }],
  dateBegin: [{ required: true, message: '请选择监督日期（起）', trigger: 'blur' }],
  dateEnd: [{ required: true, message: '请选择监督日期（止）', trigger: 'blur' }],
  participantsList: [{ required: true, message: '请选择参与方', trigger: 'blur' }],
})
let form = reactive({
  area: area.value,
  supervisionType: "",
  theme: "",
  number: null,
  dateBegin: "",
  dateEnd: "",
  participantsList: [],
  fileList: [],
});
let jdlxArr = ref([])
let queryRef = ref(null);
let supervisionTypeArr = ref([])
onMounted(() => {
  $api.getPmdCollaborativesupervisionItem().then(response => {
    jdlxArr.value = response.data;
  });
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
watch(
  () => props.modelValue,
  () => {
    queryRef.value?.resetFields()
    form = Object.assign(form)
    supervisionTypeArr.value = []
  }
);
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
}
function cancel1() {
  show.value = false
  form.area = area.value,
    form.supervisionType = '',
    form.theme = '',
    form.number = '',
    form.dateBegin = '',
    form.dateEnd = '',
    form.participantsList = [],
    form.fileList = []
  supervisionTypeArr.value = []
}
let formRef1 = ref();

function changeList(data, people) {
  people.jwNotarizeContentList = [];
  data.map(item => {
    people.jwNotarizeContentList.push({
      bz: item === "8" ? people.bz : "", //在content为8（其他）时传入
      content: item
    });
  });
}
function changeInput(data, people) {
  changeList(people.list, people);
}

// 字典 lajw_ft_swgz_content
let { lajw_ft_swgz_content } = proxy.useDict("lajw_ft_swgz_content");
function compareDate(dateTime1, dateTime2) {
  var formatDate1 = new Date(dateTime1);
  var formatDate2 = new Date(dateTime2);
  if (formatDate1 > formatDate2) {
    return false;
  } else {
    return true;
  }
}
function sure(formEl) {
  let date = compareDate(
    form.dateBegin,
    form.dateEnd
  );
  if (!date) {
    return proxy.$modal.msgError("监督日期(止)需大于等于督日期(起)！");
  } else {
    formEl.validate(valid => {
      if (valid) {
        form.area = area.value,
          $api.postCollaborativeSupervisionInfo(form).then(res => {
            if (res?.code == 200) {
              emit("refresh", true);
              show.value = false;
              form.area = area.value,
                form.supervisionType = '',
                form.theme = '',
                form.number = '',
                form.dateBegin = '',
                form.dateEnd = '',
                form.participantsList = [],
                form.fileList = [],
                supervisionTypeArr.value = [],
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
}
</script>
