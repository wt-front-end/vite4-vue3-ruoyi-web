<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2022-04-20 10:20:02
 * @LastEditors: xkloveme
 * @Description: 审批
 * @FilePath: /la-ft-web/src/views/bulletin/notary/components/spDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog title="监督检查详情" v-model="show" width="1000px" top="5vh" append-to-body center>
    <el-form style="height:700px;overflow-y:scroll" ref="formRefsp" :model="form" label-width="100px">
      <div v-for="(item, index) in jdjcArr" :key="index" style="margin-top:15px">
        <el-row>
          <el-col :span="18" style="margin-left:-100px">
            <el-form-item label="">
              <div>监督检查{{ index + 1 }}:</div>
            </el-form-item>
          </el-col>
          <el-col :span="2" v-if="area==item.userArea">
            <el-form-item label="">
              <!-- i-ep-close-bold -->
              <!-- <div @click="handleDelet(index)">删除</div> -->
              <el-button size="small" type="primary" @click="handleDelet(item)">删除</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2" v-if="area==item.userArea">
            <el-form-item label="">
              <el-button size="small" type="primary" @click="handleEdit(item)">修改</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="检查日期：">
          {{ item.checkDate }}
        </el-form-item>
        <el-form-item label="检查主题：">
          {{ item.checkTitle }}
        </el-form-item>
        <el-form-item label="检查情况：">
          {{ item.remark }}
        </el-form-item>
        <el-form-item label="添加方：">
          {{ ['嘉善','吴江', '青浦', ][item.userArea] }}/{{ item.createTime }}
        </el-form-item>
        <el-form-item label="附件：">
          <!-- <img v-for="(k, index) in item.fileList" :key="index" :src="k.url" alt="" style="width: 100px;height: 100px;margin-left: 10px;margin-right: 8px;
            " /> -->
          <wt-upload :fileList="item.fileList || []" disabled list-type="picture-card"
            @success="uploadSuccesstImageList" />
        </el-form-item>
        <el-form-item label="问题清单：">
          <!-- <div>问题清单：</div> -->
          <wt-table ref="wtTableList" style="width: 94%;" :isPagination="true" :columns="newColumns"
            :tableData="item.problemList" :isDataV="false">
            <template #action="{ scope }">
              <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
              <el-button size="small" v-if="(scope.row.status==0)" type="text" @click="handleSczg(scope.row)">上传</el-button>
            </template>
          </wt-table>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="handleAddJdjc()">新增监督检查</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <jdjcDialog v-model="showJdjc" :projectId="props.projectId" @refresh="handleQuery1" />
  <sczgDialog v-model="showSc" :name="name" :problemId="problemId" @refresh="handleQuery1" />
  <zgmx v-model="showZg" :zgmxArr="zgmxArr" @refresh="handleQuery" />
  <editJdjcDialog :jdjcDetailObj="jdjcDetailObj" :editProjectId="props.projectId" v-model="showEdit"
    @refresh="handleQuery" />
</template>
<script setup>
import $api from "@/api";
import jdjcDialog from "./jdjcDialog";
import editJdjcDialog from "./editJdjcDialog";
import { columns1 } from "./table.js";
import { ElMessageBox } from "element-plus";
import sczgDialog from "./sczgDialog";
import zgmx from "./zgmx";
const emit = defineEmits(["update:modelValue", "refresh"]);
const { proxy } = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // jdjcArr: {
  //   type: Array,
  //   default: () => []
  // },
  projectId: {
    type: [Number, String],
    default: ""
  },
  jdarea: {
    type: [Number, String],
    default: ""
  },
});
let area = ref(null);
let store = useStore();
let user = computed(() => store.state.user.user);
let showJdjc = ref(false);
let showEdit = ref(false);
const newColumns = columns1();
let form = reactive({
  taskId: "",
  remark: "",
  result: 1 //0拒绝   1同意
});
let showSc = ref(false);
let showZg = ref(false);
const zgmxArr = ref([]);
const jdjcArr = ref([]);
const show = computed({
  get: () => {
    handleJdjc();
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
const formRefsp = ref();
function handleSure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.getjwFtNotarization({ ...form, taskId: props.taskId }).then(res => {
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
function handleJdjc() {
  $api.getProjectListInfoByProjectId({ projectId: props.projectId }).then(response => {
    jdjcArr.value = response.data;
  });
}
onMounted(() => {
  if (user?.value?.area == "嘉善") {
    area.value = "0";
  } else if (user?.value?.area == "吴江") {
    area.value = "1";
  } else if (user?.value?.area == "青浦") {
    area.value = "2";
  }
});
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
function handleQuery() {
  handleJdjc();
}
function handleQuery1() {
  handleJdjc();
}
function handleDelet(row) {
  ElMessageBox.alert("确定要删除该条数据?", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        $api
          .deleteInfoPmdProject({ infoId: row.infoId })
          .then(res => {
            if (res.code == 200) {
              proxy.$modal.msgSuccess("删除成功");
              emit("refresh", true);
              // wtTableList.value.refreshData();
              handleJdjc();
            }
          });
      }
    }
  });
}
function handleAddJdjc() {
  showJdjc.value = true;
}
const jdjcDetailObj = ref({});
function handleEdit(item) {
  jdjcDetailObj.value = item
  showEdit.value = true
}
</script>
