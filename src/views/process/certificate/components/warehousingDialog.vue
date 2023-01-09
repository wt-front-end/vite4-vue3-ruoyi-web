<template>
  <el-dialog
    title="证照入库"
    v-model="visible"
    width="600px"
    top="5vh"
    append-to-body
    center
  >
    <el-form :model="queryParams" label-width="80px" label-position="left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">{{ queryParams.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">{{ queryParams.sfzh }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="color: #f00">请选择入库的证照</div>
    <el-form :model="queryParams" :rules="rules" ref="queryRef">
      <div
        v-for="(item, index) in queryParams.licenseList"
        :key="index"
        class="license-check-box"
      >
        <el-checkbox v-model="item.checked" :label="item.licenseName" />
        <div v-if="item.checked">
          <el-row>
            <el-col :span="12">
              <el-form-item
                :prop="'licenseList.' + index + '.zjhm'"
                :rules="rules.zjhm"
              >
                <el-input
                  v-model="item.zjhm"
                  placeholder="证照编号"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'licenseList.' + index + '.signAdress'"
                :rules="rules.signAdress"
              >
                <el-input
                  v-model="item.signAdress"
                  placeholder="签发地点"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'licenseList.' + index + '.zjqfrq'"
                :rules="rules.zjqfrq"
              >
                <el-date-picker
                  v-model="item.zjqfrq"
                  type="date"
                  placeholder="请选择签发日期"
                  value-format="YYYY-MM-DD"
                  style="width: 250px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'licenseList.' + index + '.validityDate'"
                :rules="rules.validityDate"
              >
                <el-date-picker
                  v-model="item.validityDate"
                  type="date"
                  placeholder="请选择有效期至"
                  value-format="YYYY-MM-DD"
                  style="width: 250px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { postBbzPutCertificates } from "@/api/certificate/index";
const { proxy } = getCurrentInstance();
const queryParams = ref({});
// const licenseList = ref([]);
const jwFtFile = ref([]);
const visible = ref(false);
const emit = defineEmits(["ok"]);
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
  sqbh: {
    type: String,
    default: ""
  },
  taskId: {
    type: String,
    default: ""
  }
});
const rules = ref({
  zjhm: [{ required: true, message: "请输入证照编号", trigger: "blur" }],
  signAdress: [{ required: true, message: "请输入签发地点", trigger: "blur" }],
  zjqfrq: [{ required: true, message: "请选择签发时间", trigger: "blur" }],
  validityDate: [{ required: true, message: "请选择有效期至", trigger: "blur" }]
});
const handleLicenseType = ref({
  1: "新办证",
  2: "补证"
});
// 显示弹框
function show() {
  visible.value = true;
}
function save() {
  let flag = queryParams.value.licenseList.some(function (item, index, array) {
    return item.checked;
  });
  let flag2 = queryParams.value.licenseList
    .filter(item => {
      return item.checked;
    })
    .every(function (item, index, array) {
      let date1 = new Date(item.zjqfrq);
      let date2 = new Date(item.validityDate);
      return date1.getTime() < date2.getTime();
    });
  if (!flag) {
    proxy.$modal.msgError("请选择入库的证照");
    return;
  }
  if (!flag2) {
    proxy.$modal.msgError("有效期至应大于签发日期");
    return;
  }
  proxy.$refs["queryRef"].validate(valid => {
    if (valid) {
      let list = queryParams.value.licenseList
        .filter(item => item.checked)
        .map(item => {
          return {
            hzlx: item.zzlx,
            name: queryParams.value.name,
            sfzh: item.sfzh,
            signAdress: item.signAdress,
            zjhm: item.zjhm,
            zjqfrq: item.zjqfrq,
            validityDate: item.validityDate
          };
        });
      let obj = {
        jwFtCertificates: list,
        sqbh: props.sqbh,
        taskId: props.taskId || undefined
      };
      postBbzPutCertificates(obj).then(res => {
        visible.value = false;
        console.log(res);
        emit("ok");
      });
    }
  });
}
watch(
  () => props.detailData,
  val => {
    queryParams.value = val.jwFtPerson;
    let list = val.jwBbzs.filter(item => {
      return item.zhzt == 3 || item.zhzt == 4;
    });
    list.map(item => {
      item.checked = false;
      if (item.zzlx == 10) {
        item.licenseName = "普通护照";
      }
      if (item.zzlx == 20) {
        item.licenseName = "往来台湾通行证";
      }
      if (item.zzlx == 30) {
        item.licenseName = "往来港澳通行证";
      }
    });
    queryParams.value.licenseList = list;
    jwFtFile.value = val.jwFtFile;
  }
);
defineExpose({
  show
});
</script>
<style lang="scss" scoped></style>
