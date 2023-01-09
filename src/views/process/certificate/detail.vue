<template>
  <div class="app-container">
    <div class="form-change">
      <div>状态：{{ statusOption[route.query.zhzt] }}</div>
      <div class="first-form" v-if="isShowData">
        <el-form :model="detailObj">
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请编号">
                {{ route.query.sqbh }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                {{ detailObj.jwFtPerson?.name }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号">
                {{ detailObj.jwFtPerson?.sfzh }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工作单位">
                {{ detailObj.jwFtPerson?.employer }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在科室">
                {{ detailObj.jwFtPerson?.deptOfficeName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务">
                {{ detailObj.jwFtPerson?.zw }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="办理证照">
            <el-table :data="detailObj.jwBbzs">
              <el-table-column label="证照类型" prop="zzlx" width="150">
                <template #default="scope">
                  {{ zhlxDict[scope.row.zzlx] }}
                </template>
              </el-table-column>
              <el-table-column label="办证类型" prop="czlx" width="300">
                <template #default="scope">
                  {{
                    scope.row.czlx == 1
                      ? "办证"
                      : `补证（原证照编号：${
                          scope.row.zjh === null ? "无" : scope.row.zjh
                        }）`
                  }}
                </template>
              </el-table-column>
              <el-table-column label="制作状态" prop="zhzt" width="120">
                <template #default="scope">
                  {{ statusOption2[scope.row.zhzt] }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="单位证明" prop="jwFtFile">
            <el-link
              v-for="(item, index) in detailObj.jwFtFile"
              :key="index"
              :icon="Download"
              type="primary"
              @click="openImg(item)"
            >
              {{ item.attachName }}
            </el-link>
          </el-form-item>
        </el-form>
      </div>
      <div>证照信息</div>
      <!-- 表单数据 -->
      <div class="third-form" v-if="isShowData">
        <el-table :data="detailObj.jwFtCertificates">
          <el-table-column label="证照编号" prop="zjhm" width="120" />
          <el-table-column label="证照类型" prop="hzlx" width="150">
            <template #default="scope">
              {{ zhlxDict[scope.row?.hzlx] }}
            </template>
          </el-table-column>
          <el-table-column label="签发地点" prop="signAdress" width="120" />
          <el-table-column label="签发时间" prop="zjqfrq" width="120" />
          <el-table-column label="有效期至" prop="validityDate" width="120" />
          <el-table-column label="入库状态" prop="inStatus" width="120">
            <template #default="scope">
              {{ licenseStatus[scope.row?.inStatus] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>审批记录</div>
      <div class="fourth-form">
        <div v-for="(item, index) in detailObj.jwFtApproves" :key="index">
          <span>{{ item.createTime }}</span>
          <span>{{ item.deptName }}</span>
          <span>{{ item.approvalUserName }}</span>
          <span
            >{{ item.result }}{{ item.remark ? `(${item.remark})` : "" }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getBbzDetail } from "@/api/certificate/index";
import { zhlxDict } from "@/constant/abroad";
import { downloadFileIamge } from "@/utils/download";
import { Download } from "@element-plus/icons-vue";
const route = useRoute();
const approvalList = ref([
  {
    time: "2022-01-04 12:12",
    workUnit: "区公安局",
    name: "赵钱孙",
    content: "反馈备案结果：成功"
  },
  {
    time: "2022-01-03 12:12",
    workUnit: "区组织部",
    name: "王五",
    content: "同意接收"
  },
  {
    time: "2022-01-02 13:12",
    workUnit: "区纪委",
    name: "李四",
    content: "重新发起人员换岗"
  },
  {
    time: "2022-01-02 12:12",
    workUnit: "区组织部",
    name: "王五",
    content: "驳回接收（换岗错误）"
  },
  {
    time: "2022-01-01 12:12",
    workUnit: "区纪委",
    name: "李四",
    content: "发起人员换岗"
  }
]);
const detailObj = ref({});
const statusOption = ref({
  1: "待核查",
  2: "核查驳回",
  3: "制作中",
  4: "待入库",
  5: "已入库",
  6: "已撤销"
});
const statusOption2 = ref({
  1: "待核查",
  2: "核查驳回",
  3: "制作中",
  4: "制作完成",
  5: "制作完成",
  6: "已撤销"
});
const licenseStatus = ref({ 10: "未入库", 20: "已入库" });
const licenseList = ref([{ zjhm: 1111 }, { zjhm: 1111 }]);
const isShowData = ref(false);
function getDetail() {
  isShowData.value = false;
  getBbzDetail({ sqbh: route.query.sqbh }).then(res => {
    detailObj.value = res.data;
    isShowData.value = true;
  });
}
function openImg(item) {
  downloadFileIamge(item.attachPath, item.attachName);
  // window.open(item.attachPath, item.attachName);
  // window.open(
  // item.attachPath
  // item.attachPath.replace(
  //   'http://10.71.81.122:9998',
  //   'http://gscgj.gongshu.gov.cn/oss-res/'
  // )
  // );
}
getDetail();
</script>
<style lang="scss" scoped>
.form-change {
  .first-form,
  .second-form,
  .third-form,
  .fourth-form {
    padding: 0 100px;
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
  }
  .fourth-form {
    span {
      margin-left: 20px;
      font-size: 12px;
    }
  }
}
</style>
