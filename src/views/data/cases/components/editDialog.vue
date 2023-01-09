<!--
 * @Description: 典型案例详情
-->
<template>
  <el-dialog
    :title="id ? '典型案例详情' : '新增典型案例'"
    v-model="show"
    width="900px"
    top="5vh"
    append-to-body
    center
  >
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      label-width="120px"
      size="small"
      :rules="rules"
    >
      <el-form-item prop="createType" label="创建方式：">
        <el-select
          :disabled="!isEdit"
          v-model="form.createType"
          placeholder="请选择创建方式"
          clearable
          @change="form.content = ''"
        >
          <el-option
            v-for="dict in createTypeOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="area" label="地区：">
        <el-select
          :disabled="!isEdit"
          v-model="form.area"
          placeholder="请选择地区"
          clearable
        >
          <el-option
            v-for="dict in areaOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in statusOpts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="案例名称：" prop="title">
        <el-input
          :disabled="!isEdit"
          v-model="form.title"
          placeholder="请输入案例名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="列表图片：" prop="fileList">
        <wt-upload
          :disabled="!isEdit"
          list-type="picture-card"
          :limit="1"
          accept="image/png,image/jpeg"
          :fileList="form.fileList"
          @success="uploadSuccess"
        />
      </el-form-item>
      <el-form-item label="典型案例详情：" prop="content">
        <wt-editor
          v-if="form.createType == 0"
          v-model="form.content"
          :readOnly="!isEdit"
        />
        <el-input
          v-else
          :disabled="!isEdit"
          v-model="form.content"
          placeholder="请输入链接"
          clearable
        />
      </el-form-item>
      <el-form-item class="flex-center" v-if="isEdit">
        <el-button type="primary" @click="handleSure"> 保存 </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import $api from "@/api";
import { areaOpts, statusOpts, createTypeOpts } from "../dictionary";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ""
  },
  id: {
    type: [Number, String],
    default: ""
  },
  isEdit: {
    type: Boolean,
    default: true
  }
});

const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});

let form = reactive({
  createType: "",
  area: "",
  status: "",
  title: "",
  fileList: [],
  content: ""
});
watch(
  show,
  value => {
    console.log("watch", props.id);
    if (value && props.id) {
      $api.casesDetailApi({ id: props.id }).then(res => {
        for (const key in form) {
          form[key] = res.data[key];
        }
      });
    }
  },
  {
    immediate: true
  }
);

const rules = {
  createType: [
    { required: true, trigger: "change", message: "请选择创建方式" }
  ],
  area: [{ required: true, trigger: "change", message: "请选择地区" }],
  status: [{ required: true, trigger: "change", message: "请选择状态" }],
  title: [{ required: true, trigger: "change", message: "请输入案例名称" }],
  fileList: [{ required: true, trigger: "blur", message: "请输入列表图片" }],
  content: [
    { required: true, trigger: "change", message: "请输入典型案例详情" }
  ]
};

function uploadSuccess(e) {
  form.fileList = Object.values(e);
}
const formRef = ref();
function handleSure() {
  formRef.value.validate(valid => {
    if (valid) {
      $api[props.id ? "casesPutApi" : "casesAddApi"]({
        ...form,
        id: props.id ? props.id : undefined
      }).then(res => {
        if (res?.code == 200) {
          show.value = false;
          emit("refresh", true);
          proxy.$modal.msgSuccess("提交成功");
        } else {
          proxy.$modal.msgError(res?.msg);
        }
      });
    }
  });
}
</script>
