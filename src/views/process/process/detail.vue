<template>
  <div class="app-container">
    <div class="form-change">
      <div>状态：{{ getApprovalStatus[detailObj.applyStatus] }}</div>
      <div>1-移出单位</div>
      <div class="first-form">
        <el-form :model="detailObj">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                {{ detailObj.name }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号">
                {{ detailObj.sfzh }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别">
                {{ detailObj.gender == "0" ? "男" : "女" }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期">
                {{ detailObj.csrq }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="政治面貌">
                {{ detailObj.politics }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族">
                {{ detailObj.nation }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="籍贯">
                {{ detailObj.nativePlace }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码">
                {{ detailObj.sjhm }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="家庭地址">
                {{ detailObj.homeAdress }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作单位">
                {{ detailObj.oldDept }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在科室">
                {{ detailObj.oldDepartment }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务">
                {{ detailObj.oldPosition }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职级">
                {{ detailObj.isQggb == 0 ? "区管干部" : "非区管干部" }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纳管类型">
                {{ detailObj.ngType }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="海外经历人员">
                {{ detailObj.overseasExperience }}
              </el-form-item>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
          <el-row v-if="detailObj.type == 2">
            <el-col :span="24">
              <el-form-item label="撤销备案表" prop="jwFtFiles">
                <span
                  v-for="(item, index) in detailObj.jwFtFiles"
                  :key="index"
                  @click="openImg(item)"
                  style="cursor: pointer; margin-right: 30px; color: #409eff"
                >
                  {{ item.attachName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
        </el-form>
      </div>
      <div>2-移入单位</div>
      <div class="second-form">
        <el-form :model="detailObj">
          <el-row>
            <el-col :span="8">
              <el-form-item label="移入单位">
                {{ detailObj.newDept }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="移入科室">
                {{ detailObj.newDepartment }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务">
                {{ detailObj.newPosition }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detailObj.type == 2">
            <el-col :span="24">
              <el-form-item label="登记备案表" prop="jwFtFileList">
                <span
                  v-for="(item, index) in detailObj.jwFtFileList"
                  :key="index"
                  @click="openImg(item)"
                  style="cursor: pointer; margin-right: 30px; color: #409eff"
                >
                  {{ item.attachName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
        </el-form>
      </div>
      <div>3-移交证照</div>
      <!-- 表单数据 -->
      <div class="third-form">
        <el-table :data="detailObj.jwRelieveCertificateList">
          <el-table-column label="证照编号" prop="zjhm" width="120" />
          <el-table-column label="证照类型" prop="hzlx" width="120">
            <template #default="scope">
              {{ zhlxDict[scope.row.hzlx] }}
            </template>
          </el-table-column>
          <el-table-column label="签发地点" prop="signAdress" width="120" />
          <el-table-column label="签发时间" prop="zjqfrq" width="120" />
          <el-table-column label="有效期" prop="validityDate" width="120" />
          <el-table-column label="原状态" prop="oldStatus" width="120">
            <template #default="scope">
              {{ licenseStatus[scope.row.oldStatus] }}
            </template>
          </el-table-column>
          <el-table-column label="新状态" prop="newStatus" width="120">
            <template #default="scope">
              {{ licenseStatus[scope.row.newStatus] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>4-审批记录</div>
      <div class="fourth-form">
        <div v-for="(item, index) in detailObj.jwFtApproveList" :key="index">
          <span>{{ item.createTime }}</span>
          <span>{{ item.deptName }}</span>
          <span>{{ item.approvalUserName }}</span>
          <span>{{ item.remark }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { zhlxDict } from "@/constant/abroad";
import { getLicenseDetailById } from "@/api/process/index";
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
const getApprovalStatus = {
  1: "待移入单位接收",
  2: "待公安反馈",
  3: "移入单位驳回",
  4: "公安驳回",
  5: "已换岗",
  6: "已撤销"
};
const licenseStatus = ref({ 10: "未入库", 20: "已入库" });
function getDetail() {
  getLicenseDetailById({ id: route.query.id }).then(res => {
    console.log(res);
    detailObj.value = res.data;
  });
}
function openImg(item) {
  console.log("打开图片", item);
  window.open(item.attachPath, item.attachName);
  // window.open(
  //   item.attachPath.replace(
  //     'http://10.71.81.122:9998',
  //     'http://gscgj.gongshu.gov.cn/oss-res/'
  //   )
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
    }
  }
}
</style>
