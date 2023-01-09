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
  <el-dialog title="发起监督详情" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督类型：">
              <!-- <el-select v-model="supervisionTypeArr" multiple placeholder="监督类型" size="small" clearable
                style="width: 200px" @change="change1">
                <el-option v-for="dict in jdlxArr" :key="dict.dictValue" :label="dict.dictLabel"
                  :value="dict.dictValue" />
              </el-select> -->
              {{ form.supervisionTypeName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="我方参与人数：">
              <div>
                <!-- {{ form.countNumber }}人 ( -->
                <span v-for="(k, index) in form.numberInfoList" :key="index">
                  {{ k.areaName }}{{ k.number }}人<span v-if="form.numberInfoList.length !== ++index">,</span>
                </span>
                <!-- ) -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督主题：">
              <el-input type="textarea" disabled :rows="2" v-model="form.theme" placeholder="监督主题" clearable
                size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督日期（起）：">
              <el-date-picker disabled v-model="form.dateBegin" type="date" placeholder="监督日期（起）" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="监督日期（止）：">
              <el-date-picker disabled v-model="form.dateEnd" type="date" placeholder="监督日期（止）" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发起方：">
              {{ form.areaName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参与方：">
              <div v-for="(k, index) in form.participantsList" :key="index">
                <span>{{ k.areaName }}</span>
                <span style="font-size: 10px;
                  background: #d9001b;
                  padding: 2px 5px;
                  color: #fff;
                  margin-left: 5px;
                  position: relative;
                  top: -8px;
                " v-if="k.participateIn == null">确认中</span>
                <span style="
                  font-size: 10px;
                  background: #ffb63b;
                  padding: 2px 5px;
                  color: #fff;
                  margin-left: 5px;
                  position: relative;
                  top: -8px;
                " v-if="k.participateIn == 0">拒绝参与</span>
                <span style="
                  font-size: 10px;
                  background: #25ac87;
                  padding: 2px 5px;
                  color: #fff;
                  margin-left: 5px;
                  position: relative;
                  top: -8px;
                " v-if="k.participateIn == 1">同意参与</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发起人：">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起时间：">
              {{ form.launchTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <wt-upload disabled :fileList="form.fileList ? form.fileList : []" list-type="picture-card"
                accept="image/png,image/jpeg" @success="uploadSuccesstImageList1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作场景：">
              <wt-upload disabled :fileList="form.workScene ? form.workScene : []" list-type="picture-card"
                accept="image/png,image/jpeg" @success="uploadSuccesstImageList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="font-size: 16px;font-weight:600;margin-bottom:8px">检查结果</div>
      <wt-table :isPagination="true" ref="wtTableList" :columns="newColumns" :tableData="form.checkCountList"
        :isDataV="false">
        <template #problemNum="{ scope }">
          <el-button size="small" type="text" @click="handleWtlb(scope.row)">{{ scope.row.problemNum || 0 }}个
          </el-button>
        </template>
        <template #workScene="{ scope }">
          <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </wt-table>
      <div style="font-size: 16px;font-weight:600;margin-bottom:8px">处置问题</div>
      <wt-table v-if="loadingTable" :isPagination="true" ref="wtTableList" :columns="newColumns1"
        :tableData="form.problemDetailVoList || []" :isDataV="false">
        <template #fileList="{ scope }">
          <el-button size="small" type="text" @click="handleTpck(scope.row)">{{ scope.row.fileList ?
              `${scope.row.fileList.length}张` : '无'
          }}</el-button>
        </template>
        <template #action="{ scope }">
          <el-button size="small" type="text" @click="handleMxDetail(scope.row)">明细</el-button>
          <el-button v-if="area == scope.row.feedbackParticipantsArea" size="small" type="text"
            @click="handleCz(scope.row)">处置</el-button>
        </template>
      </wt-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef)">确定</el-button>
        <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <wtqdDialog v-model="showWt" :wtqdObj="wtqdObj" :wtqdId="wtqdId" @refresh="handleQuery" />
  <czDialog v-model="showCz" :czObj="czObj" :czId="czId" @refresh="handleQuery1" />
  <czmxDialog v-model="showCzmx" :czmxId="czmxId" @refresh="handleQuery" />
  <tpDialog v-model="showTp" :tpArr="tpArr" @refresh="handleQuery" />
</template>
<script setup>
import $api from "@/api";
import { columns1, columns2 } from "./table.js";
import wtqdDialog from "./wtqdDialog";
import czDialog from "./czDialog";
import czmxDialog from "./czmxDialog";
import tpDialog from "./tpDialog";
import { Loading } from "element-plus/es/components/loading/src/service";
let { proxy } = getCurrentInstance();
let emit = defineEmits(["update:modelValue", "refresh"]);
let props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  id: {
    type: [Number, String],
    default: ""
  },
});
let area = ref(null);
let newColumns = columns1();
let newColumns1 = columns2();
let showWt = ref(false);
let loadingTable = ref(true);
let showCz = ref(false);
let showCzmx = ref(false)
let showTp = ref(false)
const store = useStore();
const user = computed(() => store.state.user.user);
let form = reactive({
  area: area.value,
  supervisionType: "",
  theme: "",
  number: null,
  dateBegin: "",
  dateEnd: "",
  participantsList: [],
  fileList: [],
  problemDetailVoList:[]
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
  (val) => {
    if (val && props.id) {
      form.area = area.value
      $api.getCollaborativeSupervisionInfo({ id: props.id }).then(res => {
        if (res.code == 200) {
          form = Object.assign(form, res.data)
        }
      })
    } else {
      form = Object.assign(form, {
        area: area.value,
        supervisionType: "",
        theme: "",
        number: null,
        dateBegin: "",
        dateEnd: "",
        participantsList: [],
        fileList: [],
        problemDetailVoList:[]
      })
    }
  }
);
let tpArr = ref([])
function handleTpck(row) {
  tpArr.value = row.fileList
  showTp.value = true
}
function handleQuery1() {
  // loadingTable.value = false
  $api.getCollaborativeSupervisionInfo({ id: props.id }).then(res => {
    if (res.code == 200) {
      // form = res.data
      form = Object.assign(form, res.data)
      // loadingTable.value = true
    }
  })
}
function uploadSuccesstImageList1(e) {
  form.fileList = Object.values(e);
}
function uploadSuccesstImageList(e) {
  form.workScene = Object.values(e);
}
let czObj = ref({})
let wtqdObj = ref({})
let wtqdId = ref('')
function handleWtlb(row) {
  console.log(props.id, 8888888)
  wtqdObj.value = row
  wtqdId.value = props.id
  if (row.problemNum) {
    showWt.value = true
  } else {
    proxy.$modal.msgSuccess("暂无问题！");
  }
}
function handleDetail(row) {
  tpArr.value = row.workScene
  if (row.workScene && row.workScene.length) {
    showTp.value = true
  } else {
    proxy.$modal.msgSuccess("暂无！");
  }
}
let czmxId = ref('')
function handleMxDetail(row) {
  console.log(row.id, 9999)
  czmxId.value = row.id
  showCzmx.value = true
}
let czId = ref('')
function handleCz(row) {
  czObj.value = row
  czId.value = props.id
  showCz.value = true
}
function change1(e) {
  supervisionTypeArr.value = e
  form.supervisionType = e.toString();
}
function change2(e) {
}
function cancel1() {
  show.value = false
}
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postCollaborativeSupervisionInfo(form).then(res => {
        if (res?.code == 200) {
          emit("refresh", true);
          show.value = false;
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
