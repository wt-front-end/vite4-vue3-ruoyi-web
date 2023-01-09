<!--
 * @Author: xkloveme
 * @Date: 2022-04-12 18:02:08
 * @LastEditTime: 2022-12-06 11:25:58
 * @LastEditors: xkloveme
 * @Description: 审批
 * @FilePath: /js-web/src/views/data/point/components/editDialog.vue
 * @Copyright © xkloveme
-->
<template>
  <el-dialog :title="id ? '点位详情' : '新增点位'" v-model="show" width="800px" top="5vh" append-to-body center>
    <el-form ref="formRefsp" :rules="rules" :inline="true" :model="form" label-width="120px">
      <el-form-item prop="area" label="区域:">
        <el-select :disabled="!isEdit" v-model="form.area" placeholder="区域" size="small" clearable style="width: 200px">
          <el-option label="嘉善县" value="嘉善县" />
          <el-option label="吴江区" value="吴江区" />
          <el-option label="青浦区" value="青浦区" />
        </el-select>
      </el-form-item>
      <el-form-item label="点位名称:" prop="name">
        <el-input :disabled="!isEdit" v-model="form.name" placeholder="点位名称" clearable size="small"
          style="width: 200px" />
      </el-form-item>
      <el-form-item prop="type" label="点位类型:">
        <el-select :disabled="!isEdit" v-model="form.type" placeholder="点位类型" size="small" clearable
          style="width: 200px">
          <el-option label="场馆" value="场馆" />
          <el-option label="村居" value="村居" />
          <el-option label="学校" value="学校" />
          <el-option label="公园" value="公园" />
        </el-select>
      </el-form-item>
      <el-form-item prop="line" label="线路类型:">
        <el-select multiple :disabled="!isEdit" v-model="form.line" placeholder="线路类型" size="small" clearable
          style="width: 200px">
          <el-option v-for="dict in culture_map_line" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话:" prop="phone">
        <el-input :disabled="!isEdit" v-model="form.phone" placeholder="电话" clearable size="small"
          style="width: 200px" />
      </el-form-item>
      <el-form-item label="VR地址:" prop="vrLink">
        <el-input :disabled="!isEdit" v-model="form.vrLink" placeholder="VR地址" clearable size="small"
          style="width: 200px" />
      </el-form-item>
      <el-form-item label="详细地址:" prop="address">
        <el-input v-model="form.address" disabled placeholder="详细地址" clearable size="small" style="width: 400px" />
        <el-button :disabled="!isEdit" size="small" @click="showMap = true">选择地址</el-button>
      </el-form-item>
      <el-form-item label="介绍:" prop="intro">
        <el-input :disabled="!isEdit" v-model="form.intro" type="textarea" :rows="5" placeholder="介绍" clearable
          size="small" style="width: 400px" />
      </el-form-item>
      <el-form-item label="语音介绍:" prop="audioLink">
        <wt-upload :disabled="!isEdit" :fileList="form.audioLink ? [{ url: form.audioLink, name: '语音' }] : []"
          :limit="1" accept="audio/mpeg,audio/ogg" @success="uploadSuccessAudio" @remove="uploadSuccessAudio" />
      </el-form-item>
      <el-form-item label="大屏图:" prop="thumbnail">
        <wt-upload :disabled="!isEdit" :fileList="form?.thumbnail?.url ? [form.thumbnail] : []" list-type="picture-card"
          :limit="1" accept="image/png,image/jpeg" @success="uploadSuccesstHumbnail" @remove="uploadSuccesstHumbnail" />
      </el-form-item>
      <el-form-item label="详情图:" prop="imageList">
        <wt-upload :disabled="!isEdit" :fileList="form.imageList" list-type="picture-card" accept="image/png,image/jpeg"
          @success="uploadSuccesstImageList" @remove="uploadSuccesstImageList" />
      </el-form-item>
      <br />
      <el-form-item class="w-full" v-if="isEdit">
        <div class="flex justify-end w-full">
          <el-button type="primary" @click="handleSure(formRefsp)">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <wt-map v-model="showMap" :lnglat="form.longitude?[form.longitude,form.latitude]:[]" @handleSure="handleSureMap" />
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
let showMap = ref(false)
function handleSureMap (mapData) {
  form.address = mapData.address
  form.longitude = mapData.location.lng
  form.latitude = mapData.location.lat
}
const rules = reactive({
  area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  name: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择点位类型', trigger: 'blur' }],
  line: [{ required: true, message: '请选择线路类型', trigger: 'blur' }],
  address: [{ required: true, message: '请选择详细地址', trigger: 'blur' }],
  intro: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
  thumbnail: [{ required: true, message: '请选择大屏图', trigger: 'blur' }],
  imageList: [{ required: true, message: '请选择详情图', trigger: 'blur' }],
})

let form = reactive({
  area: "",
  name: "",
  type: "",
  line: [],
  address: '',
  longitude: '',
  latitude: '',
  phone: '',
  vrLink: '',
  intro: '',
  audioLink: '',
  imageList: [],
  thumbnail: null
});
function uploadSuccessAudio (e) {
  form.audioLink = Object.values(e)[0].url;
}
function uploadSuccesstHumbnail (e) {
  form.thumbnail = Object.values(e)?.[0];
}
function uploadSuccesstImageList (e) {
  form.imageList = Object.values(e);
}
const show = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  }
});
const formRefsp = ref(null);
watch(
  () => props.modelValue,
  () => {
    formRefsp.value?.resetFields()
    if (props.id) {
      $api.pointDetailApi({ id: props.id }).then(res => {
        if (res.code == 200) {
          form = Object.assign(form, res.data)
          form.line = res.data.line.split(',') || []
        }
      })
    } else {
      form = Object.assign(form, {
        area: "",
        name: "",
        type: "",
        line: [],
        address: '',
        longitude: '',
        latitude: '',
        phone: '',
        vrLink: '',
        intro: '',
        audioLink: '',
        imageList: [],
        thumbnail: {}
      })
    }
  }
);
const { culture_map_line } = proxy.useDict("culture_map_line");


function handleSure (formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api[props.id ? 'pointsPutApi' : 'pointsAddApi']({ ...form, line: form.line.join(','), id: props.id ? props.id : undefined }).then(res => {
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
