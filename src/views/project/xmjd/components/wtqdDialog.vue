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
  <el-dialog title="问题清单" v-model="show" width="800px" top="5vh" append-to-body center>
    <wt-table ref="wtTableList" :isPagination="true" :columns="newColumns" :tableData="wtqdArr" :isDataV="false">
      <template #action="{ scope }">
        <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
        <el-button size="small" v-if="(scope.row.status==0)" type="text" @click="handleSczg(scope.row)">上传</el-button>
      </template>
    </wt-table>
  </el-dialog>
  <sczgDialog v-model="showSc" :name="name" :problemId="problemId" @refresh="handleQuery" />
  <zgmx v-model="showZg" :zgmxArr="zgmxArr" @refresh="handleQuery" />
</template>
<script setup>
import $api from "@/api";
import { columns1 } from "./table.js";
import sczgDialog from "./sczgDialog";
import zgmx from "./zgmx";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // row: {
  //   type: Object,
  //   default: () => {}
  // }
  // wtqdArr: {
  //   type: Array,
  //   default: () => []
  // },
  wtqdId: {
    type: [Number, String],
    default: ""
  },
});
let showSc = ref(false);
let showZg = ref(false);
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
    let arr = [];
    props.row?.jwNotarizeContentList?.map(item => {
      arr.push(String(item.content));
      if (item.content == 8) {
        form.bz = item.bz;
      }
    });
    form.list = arr;
    form.jwNotarizeContentList = props.row?.jwNotarizeContentList;
    handleJdjc();
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
const newColumns = columns1();

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
function changeInput(data) {
  changeList(form.list);
}
function handleQuery() {
  handleJdjc()
}
const wtqdArr = ref([]);
function handleJdjc() {
  $api.getProjectListProblemByProjectId({ projectId: props.wtqdId }).then(response => {
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
function handleDetail(row) {
  zgmxArr.value = row.rectifyList
  if (row.rectifyList.length == 0) {
    proxy.$modal.msgSuccess("暂无整改明细！");
  } else {
    showZg.value = true
  }
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
