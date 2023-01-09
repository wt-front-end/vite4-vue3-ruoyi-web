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
  <el-dialog title="问题图片" v-model="show" width="800px" top="5vh" append-to-body center>
    <el-form :model="form" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <wt-upload disabled :fileList="tpArr ? tpArr : []" list-type="picture-card"
                accept="image/png,image/jpeg"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  </el-dialog>
</template>
<script setup>
import $api from "@/api";
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
  tpArr: {
    type: Array,
    default: () => []
  },
});
const show = computed({
  get: () => {
    // let arr = [];
    // props.row?.jwNotarizeContentList?.map(item => {
    //   arr.push(String(item.content));
    //   if (item.content == 8) {
    //     form.bz = item.bz;
    //   }
    // });
    // form.list = arr;
    // form.jwNotarizeContentList = props.row?.jwNotarizeContentList;
    // handleJdjc();
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
</script>
