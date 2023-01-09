<template>
  <div class="app-container form-change">
    <div class="sub-title">
      状态：{{ statusOption[route.query.status].label }}
    </div>
    <div class="sub-title">申请编号：{{ route.query.apply_code }}</div>
    <el-button type="primary" @click="exportErrorPerson"
      >导出解除失败人员</el-button
    >
    <el-button type="primary" @click="exportAllPerson">导出全部人员</el-button>
    <div class="sub-title">
      <el-table :data="pensons">
        <el-table-column label="姓名" prop="name" width="100" />
        <el-table-column label="出生日期" prop="csrq" width="100" />
        <el-table-column label="性别" prop="gender" width="80">
          <template #default="scope">
            {{ scope.row.gender == 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="sfzh" width="180" />
        <el-table-column label="工作单位" prop="employer" width="120" />
        <el-table-column label="人事主管单位" prop="zgdw" width="120" />
        <el-table-column label="户口所在地" prop="household" width="120" />
        <el-table-column label="报送单位名称" prop="dept_name" width="120" />
        <el-table-column label="报送单位类别" prop="dept_type" width="120">
          <template #default="scope">
            {{ deptType[scope.row.dept_type] }}
          </template>
        </el-table-column>
        <el-table-column label="报送单位联系人" prop="nick_name" width="120" />
        <el-table-column
          label="报送单位联系电话"
          prop="phonenumber"
          width="140"
        />
        <el-table-column label="入库批号" prop="in_batth" width="120" />
        <el-table-column
          label="解除备案结果"
          prop="apply_status"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            {{
              scope.row.apply_status == 0
                ? "撤销成功"
                : scope.row.apply_status == 1
                ? "撤销失败"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="reason" width="120" fixed="right" />
      </el-table>
    </div>
    <div class="sub-title">撤销备案表</div>
    <div
      v-for="(item, index) in ossFile"
      :key="index"
      @click="openImg(item)"
      fit="scale-down"
      style="cursor: pointer; color: #409eff; margin-left: 40px"
    >
      {{ item.fileName }}
      <!-- <el-image style="width: 100px; height: 100px" :src="item.url" /> -->
    </div>
    <div class="sub-title">退还证照</div>
    <div>
      <el-table :data="cert">
        <el-table-column label="姓名" prop="name" width="100" />
        <el-table-column label="性别" prop="gender" width="80">
          <template #default="scope">
            {{ scope.row.gender == 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="sfzh" width="150" />
        <el-table-column label="手机号码" prop="sjhm" width="100" />
        <el-table-column label="工作单位" prop="dept_name" width="100" />
        <el-table-column label="职务" prop="zw" width="100" />
        <el-table-column label="职级" prop="is_qggb" width="100">
          <template #default="scope">
            {{ scope.row.is_qggb == 0 ? "非区管干部" : "区管干部" }}
          </template>
        </el-table-column>
        <el-table-column label="证照" prop="cert" width="300">
          <template #default="scope">
            <div
              v-for="(item, index) in scope.row.cert.split(',')"
              :key="index"
            >
              {{ index + 1 }}、{{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="cert_status"
          width="100"
          fixed="right"
        >
          <template #default="scope">
            {{ scope.row.cert_status == 0 ? "待退还" : "已退还" }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sub-title">审批记录</div>
    <div class="fourth-form">
      <div v-for="(item, index) in log" :key="index">
        <span>{{ item.create_time }}</span>
        <span>{{ item.create_company }}</span>
        <span>{{ item.create_by }}</span>
        <span>{{ item.msg }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  getDetailInfo,
  getExportErrorPerson,
  getExportAllPerson
} from "@/api/exitSupervision/index";
const { proxy } = getCurrentInstance();
const route = useRoute();
const detailObj = ref({});
const log = ref([]);
const cert = ref([]);
const pensons = ref([]);
const ossFile = ref([]);
const deptType = ref({
  1: "纪委监委",
  2: "镇街派驻",
  3: "监督单位",
  4: "街道",
  5: "村社"
});
const statusOption = [
  { label: "待提交撤销备案", value: 0 },
  { label: "待反馈", value: 1 },
  { label: "已反馈", value: 2 },
  { label: "已撤销", value: 3 }
];
function getDetail() {
  getDetailInfo({ id: route.query.id }).then(res => {
    console.log(res);
    log.value = res.data.log;
    cert.value = res.data.cert;
    pensons.value = res.data.pensons;
    ossFile.value = res.data.ossFile;
  });
}
function openImg(item) {
  console.log("打开图片", item);
  window.open(item.url, "撤销备案表");
}
async function exportErrorPerson() {
  proxy.download(`/out/exportErrorPerson?id=${route.query.id}`);
}
async function exportAllPerson() {
  proxy.download(`/out/exportPerson?id=${route.query.id}`);
}
getDetail();
</script>
<style lang="scss" scoped>
.form-change {
  .first-form,
  .second-form,
  .third-form,
  .fourth-form {
    // padding: 0 100px;
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
  }
  .fourth-form {
    span {
      margin-left: 20px;
    }
  }
  .sub-title {
    margin: 10px 0;
  }
}
</style>
