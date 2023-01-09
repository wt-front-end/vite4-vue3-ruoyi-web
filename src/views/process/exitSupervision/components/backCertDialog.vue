<template>
  <el-dialog
    :title="title"
    v-model="visible"
    width="1200px"
    top="5vh"
    append-to-body
    center
    :before-close="handleClose"
  >
    <el-table :data="props.list">
      <el-table-column label="姓名" prop="name" width="100" />
      <el-table-column label="性别" prop="gender" width="80">
        <template #default="scope">
          {{ scope.row.gender == 0 ? "男" : scope.row.gender == 1 ? "女" : "" }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" prop="sfzh" width="150" />
      <el-table-column label="手机号码" prop="sjhm" width="100" />
      <el-table-column label="工作单位" prop="dept_name" width="100" />
      <el-table-column label="职务" prop="zw" width="100" />
      <el-table-column label="职级" prop="is_qggb" width="100">
        <template #default="scope">
          {{
            scope.row.is_qggb == 1
              ? "非区管干部"
              : scope.row.is_qggb == 0
              ? "区管干部"
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="待退还证照" prop="cert">
        <template #default="scope">
          <div v-for="(item, index) in scope.row.cert.split(',')" :key="index">
            {{ index + 1 }}、{{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            @click="handleDelete(scope.row)"
            v-if="scope.row.cert_status == 0"
            >退还</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup>
import { getBackCert } from "@/api/exitSupervision/index";
import { ElMessageBox } from "element-plus";
const title = ref("退还证照");
const emit = defineEmits(["ok", "newList"]);
const visible = ref(false);
// const roleList = ref([])
const props = defineProps({
  // 数据
  list: {
    type: Array,
    default: () => []
  }
});
// 退还
function handleDelete(row) {
  let content = "确认退还以下证照：<br/>";
  let certList = row.cert.split(",");
  certList.map((item, index) => {
    let str = `${index + 1}、${item}<br/>`;
    content += str;
  });
  ElMessageBox.alert(content, {
    confirmButtonText: "确认退还",
    cancelButtonText: "取消",
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    callback: action => {
      if (action === "confirm") {
        getBackCert({ certId: row.id }).then(res => {
          console.log(res);
          emit("newList");
        });
      }
    }
  });
}
function show() {
  //   props.licenseList = [];
  visible.value = true;
}
function handleClose() {
  visible.value = false;
  emit("ok");
}
defineExpose({
  show
});
</script>
