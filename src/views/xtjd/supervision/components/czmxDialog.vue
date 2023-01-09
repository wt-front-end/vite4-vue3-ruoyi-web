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
  <el-dialog title="明细" v-model="show" width="800px" top="5vh" append-to-body center>
    <wt-table ref="wtTableList" :columns="newColumns" :tableData="czmxArr" :isDataV="false">
      <template #resultList="{ scope }">
        <el-button size="small" type="text" @click="handleZrzj(scope.row.resultList)">{{ scope.row.resultList ?
            `${scope.row.resultList.length}条` : '无'
        }}</el-button>
      </template>
      <template #systemList="{ scope }">
        <el-button size="small" type="text" @click="handleZdjs(scope.row.systemList)">{{ scope.row.systemList ?
            `${scope.row.systemList.length}条` : '无'
        }}</el-button>
      </template>
      <template #fileList="{ scope }">
        <el-button size="small" type="text" @click="handleCk(scope.row)">查看</el-button>
      </template>
    </wt-table>
  </el-dialog>
  <zdjsDialog v-model="showZdjs" :zdjsArr="zdjsArr" @refresh="handleQuery" />
  <zrzjDialog v-model="showZrzj" :zrzjArr="zrzjArr" @refresh="handleQuery" />
  <tpDialog v-model="showTp" :tpArr="tpArr" @refresh="handleQuery" />
</template>
<script setup>
import $api from "@/api";
import { columns4 } from "./table.js";
import zdjsDialog from "./zdjsDialog";
import zrzjDialog from "./zrzjDialog";
import tpDialog from "./tpDialog";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // wtqdArr: {
  //   type: Array,
  //   default: () => []
  // },
  czmxId: {
    type: [Number, String],
    default: ""
  },
});
let showZdjs = ref(false);
let showZrzj = ref(false);
let showTp = ref(false);
const zdjsArr = ref([]);
const zrzjArr = ref([]);
const tpArr = ref([]);
const show = computed({
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
    if (props.czmxId) {
      handlemxDetail()
    }
  }
);
const newColumns = columns4();

// 字典
const { lajw_ft_swgz_content } = proxy.useDict("lajw_ft_swgz_content");
const czmxArr = ref([]);
function handlemxDetail() {
  $api.getCollaborativeSupervisionProblemDetail({ problemId: props.czmxId }).then(response => {
    czmxArr.value = response.data.feedBackList;
    czmxArr.value.map(item => {
      item.systemList = item.systemList.filter(function (el) {
        return el != null;
      })
      item.resultList = item.resultList.filter(function (el) {
        return el.result != null;
      })
    }
    )
  });
}
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
function handleCk(row) {
  console.log(row, 99999)
  if (row.fileList) {
    tpArr.value = row.fileList
    showTp.value = true
  } else {
    proxy.$modal.msgSuccess("暂无附件！");
  }
}
function handleZrzj(row) {
  if (row.length) {
    zrzjArr.value = row
    showZrzj.value = true
  } else {
    proxy.$modal.msgSuccess("暂无责任追究！");
  }
}
function handleZdjs(row) {
  if (row.length) {
    let arr = []
    row.map(m => {
      arr.push({ zdmc: m })
    })
    zdjsArr.value = arr
    showZdjs.value = true
  } else {
    proxy.$modal.msgSuccess("暂无制度建设！");
  }
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
