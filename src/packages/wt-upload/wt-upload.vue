<template>
  <div>
    <el-upload ref="wtUploadRef" :name="fileName" :limit="limit" :accept="accept" :multiple="false" :disabled="disabled"
      :file-list="dataMap.defaultFileList" :on-remove="dataMap.handleRemove" :on-success="dataMap.handleSuccess"
      :before-upload="dataMap.beforeUpload" :on-exceed="dataMap.handleExceed" :on-change="dataMap.handleChange"
      :on-preview="dataMap.handlePreview" :on-progress="dataMap.handleProgress" class="editor-slide-upload"
      :headers="headers" :data="{ pathPrefix: pathPrefix }" :action="action" list-type="picture-card" v-bind="attrs">
      <el-button size="small" type="primary" :disabled="disabled">
        {{ name }}
      </el-button>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" @click="onPreview(file)" :src="file.url"
            :alt="file.fileName || file.name"
            onerror="javascript:this.src='https://hltm.jw.linan.gov.cn/linanjiwei/jsjw/img/detail.png';" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="onPreview(file)">
              <div class="i-ep-zoom-in"></div>
            </span>
            <span class="el-upload-list__item-delete" @click="dataMap.handleDownload(file)">
              <div class="i-ep-download"></div>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-preview" @click="dataMap.handleClickRemove(file)">
              <div class="i-ep-delete"></div>
            </span>
          </span>
        </div>
      </template>
      <template #tip>
        <slot name="download" :scoped="dataMap" />
        <div class="el-upload__tip" v-if="showtips">{{ tips }}</div>
      </template>
    </el-upload>
  </div>
  <el-dialog v-model="showImagePreview" fullscreen align="center">
    <ImagePreview :src="pathImagePreview" />
  </el-dialog>
</template>

<script setup name="wtUpload">
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const attrs = useAttrs();
const props = defineProps({
  showtips: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    default: "????????????"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    default: function () {
      return import.meta.env.VITE_APP_BASE_API + "/oss/ossUpload";
    }
  },
  limit: {
    type: Number,
    default: 9
  },
  accept: {
    type: String,
    default:
      ".doc,.docx,.xls,.xlsx,.pdf,application/msword,image/png,image/jpeg"
  },
  pathPrefix: {
    type: String,
    default: "js-web"
  },
  fileName: {
    type: String,
    default: "file"
  },
  fileList: {
    type: Array,
    default: () => []
  },
  onlyFile: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["success", "remove", "change", "file"]);

const wtUploadRef = ref();
let UploadObject = {};
const tips = computed(() => {
  return `?????????????????????${props.accept} ???????????????${props.limit}????????? ???????????????????????????20mb`;
});
const headers = computed(() => {
  let headers = {};
  if (getToken()) {
    headers["Authorization"] = "Bearer " + getToken(); // ???????????????token
  }
  return headers;
});
const showImagePreview = ref(false);
const pathImagePreview = ref("");
const onPreview = file => {
  if ((file.name || file.fileName).includes('.png') || (file.name || file.fileName).includes('.jpg') || (file.name || file.fileName).includes('.jpeg')) {
    showImagePreview.value = true;
    pathImagePreview.value = file.url;
  } else {
    proxy.$modal.msgWarning(
      `???????????????????????????`
    );
  }
};
const dataMap = reactive({
  defaultFileList: props.fileList,
  dialogVisible: false,
  checkAllSuccess: () => {
    return Object.keys(UploadObject).every(
      item => UploadObject[item].hasSuccess
    );
  },
  handleProgress: () => {
    emit("pregress");
  },
  handleSuccess: (response, file) => {
    const uid = file.uid;
    const objKeyArr = Object.keys(UploadObject);
    if (response.code !== 200) {
      file.status = "fail"; // ??????????????????,??????????????????
      return proxy.$modal.msgError(response.msg || "????????????,?????????????????????!");
    }
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (UploadObject[objKeyArr[i]].uid === uid && response?.code == 200) {
        UploadObject[objKeyArr[i]].url = response?.data?.url;
        UploadObject[objKeyArr[i]].hasSuccess = true;
      }
    }
    setTimeout(() => {
      emit("success", UploadObject);
    }, 0);
  },
  handleClickRemove: (file) => {
    wtUploadRef.value.handleRemove(file)
  },
  handleRemove: (file, files) => {
    emit("remove", files);
    emit("success", files);
    // const uid = file.uid;
    // const url = file.url;
    // const objKeyArr = Object.values(UploadObject);
    // for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //   if (
    //     UploadObject[objKeyArr[i]]?.uid === uid ||
    //     UploadObject[objKeyArr[i]]?.url === url
    //   ) {
    //     delete UploadObject[objKeyArr[i]];
    //     dataMap.defaultFileList.splice(i, 1)
    //     break;
    //   } else {
    //     return false;
    //   }
    // }
    // emit("remove", UploadObject);
    // emit("success", UploadObject);
    // return true;
  },
  handleDownload: async file => {
    fetch(file.url)
      .then(function (response) {
        return response.blob();
      })
      .then(function (myBlob) {
        const url = window.URL.createObjectURL(myBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name || '??????');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      });
  },
  beforeUpload: async file => {
    if (file.size > 1024 ** 1024 * 20) {
      proxy.$modal.msgError("????????????????????????20mb");
      throw new Error("????????????????????????20mb");
    }
    if (props.onlyFile) {
      emit("file", file);
      return false;
    }
    const fileName = file.uid;
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(file);
    UploadObject[fileName] = {
      hasSuccess: false,
      uid: file.uid,
      name: file.name,
      fileName: file.name,
    };
  },
  handleSubmit () {
    const arr = Object.keys(UploadObject).map(v => UploadObject[v]);
    if (!dataMap.checkAllSuccess()) {
      proxy.$modal.msgWarning(
        "????????????????????????????????????????????????????????????????????????????????????????????????????????????!"
      );
      return;
    }
    emit("success", arr);
    dataMap.clearAll();
  },
  // ????????????
  handleExceed (files, fileList) {
    proxy.$modal.msgWarning(
      `?????????????????? ${props.limit} ??????????????????????????? ${files.length
      } ???????????????????????? ${files.length + fileList.length} ?????????`
    );
  },
  clearAll () {
    UploadObject = {};
    dataMap.defaultFileList = [];
    dataMap.dialogVisible = false;
    wtUploadRef.value.clearFiles();
  },
  // ??????
  setFileList () {
    if (dataMap.defaultFileList.length == 0) return false;
    dataMap.defaultFileList.forEach((item, index) => {
      item.uid = index;
      UploadObject[index] = item;
    });
  },
  handleChange (file, fileList) {
    emit("change", fileList);
  }
});
toRefs({ ...dataMap });

watch(
  () => props.fileList,
  () => {
    dataMap.clearAll();
    dataMap.defaultFileList = props.fileList;
    dataMap.setFileList();
  }
);
onMounted(() => {
  dataMap.setFileList();
});
</script>