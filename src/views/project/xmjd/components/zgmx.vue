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
  <el-dialog title="查看整改明细" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" ref="queryRef" :inline="true">
        <div v-for="(item, index) in zgmxArr" :key="index">
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改人：" prop="area">
                <!-- <el-input disabled v-model="item.area" placeholder="整改人" clearable size="small"
                  style="width: 210px" /> -->
                {{ ['嘉善','吴江', '青浦', ][item.userArea] }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改时间：">
                <el-date-picker disabled v-model="item.createTime" type="date" placeholder="整改时间" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="整改情况：" prop="projectContent">
                <el-input disabled type="textarea" :rows="2" v-model="item.content" placeholder="整改情况" clearable
                  size="small" style="width: 210px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="附件：" prop="area">
                <wt-upload disabled :fileList="item.fileList||[]" list-type="picture-card" accept="image/png,image/jpeg"
                  @success="uploadSuccesstImageList1" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
  </el-dialog>

</template>
<script setup>
import $api from "@/api";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  problemId: {
    type: [Number, String],
    default: ""
  },
  name: {
    type: [Number, String],
    default: null
  },
  zgmxArr: {
    type: Array,
    default: () => []
  }
});
const form = reactive({
  content: '',
  fileList: [],
  status: ''
});
const queryRef = ref(null);
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.postPmdProjectAddRectify({ ...form, problemId: props.problemId }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("上传成功");
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
function uploadSuccesstImageList1(e) {
  form.fileList = Object.values(e);
}
function cancel1() {
  show.value = false
}




</script>
