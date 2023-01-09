<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2022-05-11 09:33:26
 * @LastEditors: xkloveme
 * @Description: 反馈公证结果
 * @FilePath: /la-ft-web/src/views/bulletin/notary/components/fkDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog title="问题列表" v-model="show" width="800px" top="5vh" append-to-body center>
    <wt-table ref="wtTableList" :columns="newColumns" :tableData="wtqdArr" :isDataV="false">
      <template #fileList="{ scope }">
        <el-button size="small" type="text" @click="handleCk(scope.row)">{{ scope.row.fileList ?
            `${scope.row.fileList.length}张` : '无'
        }}</el-button>
      </template>
      <template #action="{ scope }">
        <el-button size="small" type="text" @click="handleDetail(scope.row)">处置明细</el-button>
      </template>
    </wt-table>
  </el-dialog>
  <czmxDialog v-model="showCzmx" :czmxId="czmxId" @refresh="handleQuery" />
  <tpDialog v-model="showTp" :tpArr="tpArr" @refresh="handleQuery" />
</template>
<script setup>
import $api from "@/api";
import { columns3 } from "./table.js";
import czmxDialog from "./czmxDialog";
import tpDialog from "./tpDialog";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  wtqdObj: {
    type: Object,
    default: () => { }
  },
  // wtqdArr: {
  //   type: Array,
  //   default: () => []
  // },
  wtqdId: {
    type: [Number, String],
    default: ""
  },
});
let showCzmx = ref(false);
const zgmxArr = ref([]);
let form = reactive({
  notarizeDate: "",
  result: 1, //0拒绝   1同意
  bz: "", //备注
  list: [],
  jwNotarizeContentList: []
});
const show = computed({
  get: () => {
    if (props.wtqdId) {
      handleJdjc();
    }
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
const newColumns = columns3();

// 字典
const { lajw_ft_swgz_content } = proxy.useDict("lajw_ft_swgz_content");

function changeList(data) {
  form.jwNotarizeContentList = [];
  data.map(item => {
    form.jwNotarizeContentList.push({
      bz: item === "8" ? form.bz : "", //在content为8（其他）时传入
      content: item
    });
  });
}
let tpArr = ref([])
let showTp = ref(false)
function handleCk(row) {
  tpArr.value = row.fileList
  if (row.fileList && row.fileList.length) {
    console.log(2334)
    showTp.value = true
  } else {
    proxy.$modal.msgSuccess("暂无！");
  }
}
function changeInput(data) {
  changeList(form.list);
}
function handleQuery() {
  handleJdjc()
}
const wtqdArr = ref([]);
function handleJdjc() {
  $api.getProjectListProblemProblemList({ area: props.wtqdObj.area, id: props.wtqdId }).then(response => {
    wtqdArr.value = response.data;
  });
}
const name = ref('');
const problemId = ref('');
function handleSczg(row) {
  problemId.value = row.problemId
  name.value = row.remark
  showSc.value = true
}
const czmxId = ref('');
function handleDetail(row) {
  czmxId.value = row.id
  showCzmx.value = true
}
const formRef = ref();
function handleSure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.jwFtNotarizationFeedback({ ...props.row, ...form }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("提交成功");
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
