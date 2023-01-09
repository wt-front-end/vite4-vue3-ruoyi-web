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
  <el-dialog title="同意参与" v-model="show" width="800px" top="5vh" append-to-body center>
    <div>
      <el-form :model="form" :rules="rules" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="参与人数：" prop="number">
              <el-input-number :min="1" v-model="form.number" placeholder="参与人数" clearable size="small" style="width: 210px" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="sure(queryRef)">确定</el-button>
        <el-button @click="cancel1" style="margin-left: 12px">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import $api from "@/api";
let { proxy } = getCurrentInstance();
let emit = defineEmits(["update:modelValue", "refresh"]);
let props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  agreeObj: {
    type: Object,
    default: () => { }
  },
});
let area = ref(null);
const store = useStore();
const user = computed(() => store.state.user.user);
const rules = reactive({
  number: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
})
let form = reactive({
  number: null
});
let queryRef = ref(null);
onMounted(() => {
  // $api.getPmdCollaborativesupervisionItem().then(response => {
  //   jdlxArr.value = response.data;
  // });
  if (user?.value?.area  == "嘉善") {
      area.value = "0";
    } else if (user?.value?.area  == "吴江") {
      area.value = "1";
    } else if (user?.value?.area  == "青浦") {
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
  () => {
    queryRef.value?.resetFields()
    form = Object.assign(form)
    form.number=null
  }
);
function cancel1() {
  show.value = false
  form.number=null
}
// 字典 lajw_ft_swgz_content
function sure(formEl) {
  formEl.validate(valid => {
    if (valid) {
      $api.getCollaborativeSupervisionInfoConfirmParticipateIn({
        ...form,
        id: props.agreeObj.id,
        area: area.value,
        participateIn: 1,
      }).then(res => {
        if (res?.code == 200) {
          emit("refresh", true);
          form.number=null
          show.value = false
          proxy.$modal.msgSuccess("操作成功！");
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
