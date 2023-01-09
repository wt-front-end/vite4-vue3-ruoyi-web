<template>
  <el-card>
    <div class="approalInfoBox">
      <div v-if="obj.applyStatus == 9" class="info yes">已归档</div>
      <!--已终止\业务外流转\审核驳回\已归档-->
      <div v-if="obj.applyStatus == 11" class="info no">业务外流转</div>
      <div v-if="obj.applyStatus == 10" class="info no">已终止</div>
      <div v-if="obj.applyStatus == 12" class="info no">审核驳回</div>
    </div>
    <el-descriptions
      size="small"
      style="margin-bottom: 20px"
      title="基本信息"
      :column="3"
      border
    >
      <el-descriptions-item label="编号" width="120px">{{
        obj.applyNo
      }}</el-descriptions-item>
      <el-descriptions-item label="预警对象" width="120px">{{
        obj.warningPerson
      }}</el-descriptions-item>
      <el-descriptions-item label="身份证" width="120px">{{
        obj.personNo
      }}</el-descriptions-item>
      <el-descriptions-item label="单位">{{
        obj.personDept
      }}</el-descriptions-item>
      <el-descriptions-item label="职务">{{
        obj.personJob
      }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{
        obj.createTime
      }}</el-descriptions-item>
      <el-descriptions-item label="风险等级" span="3"
        >{{ warningLevelType[Number(obj.warningLevel) - 1] }}
        <!-- <a @click="getChangeRisk">建议措施</a> -->
      </el-descriptions-item>
      <el-descriptions-item label="预警模型" span="3">{{
        obj.eventType
      }}</el-descriptions-item>
      <el-descriptions-item label="规则名称" span="3">{{
        obj.ruleName
      }}</el-descriptions-item>
      <el-descriptions-item label="规则条件" span="3">{{
        obj.ruleConditions
      }}</el-descriptions-item>
      <el-descriptions-item label="预交办单位" span="3">{{
        obj.beforehandUnit
      }}</el-descriptions-item>
      <el-descriptions-item label="预警结果" span="3">{{
        obj.warningResult
      }}</el-descriptions-item>
      <el-descriptions-item label="备注" span="3">{{
        obj.remark
      }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      size="small"
      style="margin-bottom: 20px"
      title="处置信息"
      border
    >
      <el-descriptions-item
        label="处置结果"
        span="1"
        width="120px"
        v-if="approval.length != 0"
      >
        {{
          approval[0].colResult == "0"
            ? "分办"
            : approval[0].colResult == "1"
            ? "业务外流转"
            : "终止"
        }}
      </el-descriptions-item>
      <el-descriptions-item label="处置结果" span="1" width="120px" v-else>
      </el-descriptions-item>
      <el-descriptions-item
        label="交办单位"
        span="1"
        v-if="
          approval.length != 0 && approval[0].colRemarks.indexOf('分办') != -1
        "
        >{{ obj.organizer }}</el-descriptions-item
      >
      <el-descriptions-item
        v-if="
          approval.length != 0 &&
          approval[0].colRemarks.indexOf('业务外流转') != -1
        "
        label="交办单位"
        span="1"
        >{{ obj.ccUnit }}{{ "  , 由派驻纪检监察组移送" }}</el-descriptions-item
      >
      <el-descriptions-item
        v-if="
          approval.length != 0 &&
          approval[0].colRemarks.indexOf('业务外流转') != -1
        "
        label="抄送单位"
        span="1"
        >{{ obj.organizer }}</el-descriptions-item
      >
      <el-descriptions-item label="截止日期" span="1" width="180px"
        >{{ obj.closeDate }}
      </el-descriptions-item>
      <el-descriptions-item label="附件" span="3" v-if="!notFile">
        <!-- 附件 -->
        <div v-if="obj.applyStatus">
          <ul class="fileBox">
            <li
              v-if="
                (Number(obj.applyStatus) > 3 && Number(obj.applyStatus) < 14) ||
                (applyStatus == 12 && obj.approverStatus == 1)
              "
            >
              <span
                v-if="
                  approval.length &&
                  approval[0].colRemarks.indexOf('分办') != -1 &&
                  Number(obj.warningLevel) == 3
                "
                style="width: unset"
                class="fileType"
              >
                <!-- <a-icon type="file-pdf" /> -->
                问题线索办理通知书</span
              >
              <span
                v-if="
                  Number(obj.warningLevel) == 1 ||
                  Number(obj.warningLevel) == 2 ||
                  (approval[0].colRemarks.indexOf('业务外流转') != -1 &&
                    Number(obj.warningLevel) == 3)
                "
                style="width: unset"
                class="fileType"
              >
                <!-- <a-icon type="file-pdf" /> -->
                预警问题处置通知书</span
              >
              <span class="behavior" style="color: #409eff; margin-left: 10px">
                <a href="javascript:;" @click="viewFile()">查看</a>
                <!-- <a href="javascript:;" @click="viewFileList()">(历史记录)</a> -->
              </span>
            </li>
            <li>
              <span style="width: unset" class="fileType">
                <!-- <a-icon type="file-pdf" /> -->
                分办意见呈批表</span
              >
              <span class="behavior" style="color: #409eff; margin-left: 10px">
                <a href="javascript:;" @click="viewFile2()">查看</a>
              </span>
            </li>
          </ul>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <div class="title">
      <h4 style="font-weight: bold; font-size: 16px; margin-bottom: 20px">
        办理结果:
      </h4>
    </div>
    <div>
      <div
        v-if="
          obj.warningLevel == 1 &&
          obj.version != 1 &&
          obj.version != 2 &&
          !(approval[0].colRemarks.indexOf('业务外流转') != -1)
        "
      >
        已确认了解
      </div>
      <div v-else>
        <div v-if="ruleArr.feedbackResults">
          <div
            class="modal-detail"
            v-for="(item, index) in ruleArr.jwMeasuresVos"
            :key="index"
          >
            <div class="item">
              <span style="width: 0"> </span>
              <span>
                {{ index + 1 }}、{{ item.measuresName }}
                <el-popover :title="item.measuresName" trigger="hover">
                  <template #reference>
                    <div
                      style="width: 600px; max-height: 400px; overflow: auto"
                    >
                      <span v-html="item.description"></span>
                    </div>
                  </template>
                  <!-- <a-icon type="question-circle" /> -->
                </el-popover>
              </span>
            </div>
            <div class="item">
              <span style="width: 85px">办理结果：</span>
              <span> {{ item.result }}</span>
            </div>
          </div>
          <div class="modal-detail">
            <div class="item">
              <span style="width: 85px">是否属实：</span>
              <span
                v-if="
                  ruleArr.feedbackResults.isTrue == 0 ||
                  ruleArr.feedbackResults.isTrue == 1
                "
              >
                {{
                  ruleArr.feedbackResults.isTrue == 0 ? "属实" : "不属实"
                }}</span
              >
            </div>
            <div class="item">
              <span style="width: 85px">办理结果：</span>
              <span> {{ ruleArr.feedbackResults.result }}</span>
            </div>
            <div class="item">
              <span style="width: 85px">处置日期：</span>
              <span> {{ ruleArr.feedbackResults.disposalTime }}</span>
            </div>
            <div class="item">
              <span style="width: 85px">处置对象：</span>
              <span> {{ govenStatus[ruleArr.feedbackResults.type - 1] }}</span>
            </div>
            <el-table
              :data="ruleArr.personInfo"
              style="width: 100%"
              v-if="ruleArr.feedbackResults.type == 1"
            >
              <el-table-column
                prop="userName"
                label="姓名"
                width="180"
                align="center"
              />
              <el-table-column prop="sfzh" label="身份证号" align="center" />
              <el-table-column
                prop="userUnit"
                label="工作单位"
                align="center"
              />
              <el-table-column prop="job" label="职务" align="center" />
              <el-table-column
                prop="politicalOrientation"
                label="政治面貌"
                align="center"
              />
              <el-table-column prop="results" label="处置方式" align="center">
                <template #default="scope">
                  <div>
                    <span
                      v-for="(item, index) in scope.row.results"
                      :key="index"
                    >
                      {{ `${item.freedType}-${item.freedMode}` }}
                    </span>
                  </div>
                </template></el-table-column
              >
            </el-table>
            <el-table
              :data="ruleArr.unitResults"
              style="width: 100%"
              v-if="ruleArr.feedbackResults.type == 2"
            >
              <el-table-column
                prop="unitName"
                label="工作单位名称"
                align="center"
              />
              <el-table-column prop="result" label="处置结果" align="center" />
            </el-table>
            <div
              class="item"
              style="display: flex; justify-content: flex-start"
            >
              <span style="min-width: 85px">调查报告及印证材料：</span>
              <div>
                <ul class="fileBox">
                  <li
                    style="margin: 0px 20px 0 0"
                    v-for="(item2, index) in ruleArr.files"
                    :key="index"
                  >
                    <span style="width: auto" class="fileType">
                      <!-- <a-icon type="file-pdf" /> -->
                      {{ item2.attachName }}</span
                    >
                    <span
                      class="behavior"
                      style="color: #409eff; margin-left: 10px"
                    >
                      <a
                        href="javascript:;"
                        @click="
                          downFile(item2.attachName, item2.attachPath, item2)
                        "
                        >查看</a
                      >
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="ruleArr.fileXs.length > 0"
              class="item"
              style="display: flex; justify-content: flex-start"
            >
              <span style="width: 85px">线索表：</span>
              <div>
                <ul class="fileBox">
                  <li
                    style="margin: 0px 20px 0 0"
                    v-for="(item2, index) in ruleArr.fileXs"
                    :key="index"
                  >
                    <span style="width: auto" class="fileType">
                      <!-- <a-icon type="file-pdf" /> -->
                      {{ item2.attachName }}</span
                    >
                    <span
                      class="behavior"
                      style="color: #409eff; margin-left: 10px"
                    >
                      <a
                        href="javascript:;"
                        @click="
                          downFile(item2.attachName, item2.attachPath, item2)
                        "
                        >查看</a
                      >
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="ruleArr.fileAj.length > 0"
              class="item"
              style="display: flex; justify-content: flex-start"
            >
              <span style="width: 85px">案件表：</span>
              <div>
                <ul class="fileBox" style="height: 40px">
                  <li
                    style="margin: 0px 20px 0 0"
                    v-for="(item2, index) in ruleArr.fileAj"
                    :key="index"
                  >
                    <span style="width: auto" class="fileType">
                      <!-- <a-icon type="file-pdf" /> -->
                      {{ item2.attachName }}</span
                    >
                    <span
                      class="behavior"
                      style="color: #409eff; margin-left: 10px"
                    >
                      <a
                        href="javascript:;"
                        @click="
                          downFile(item2.attachName, item2.attachPath, item2)
                        "
                        >查看</a
                      >
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      <h4 style="font-weight: bold; font-size: 16px; margin: 20px 0">
        反馈记录:
      </h4>
    </div>
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in approval"
        :key="index"
        type="primary"
      >
        <div class="logsBox">
          <span>{{ item.createTime }}</span>
          <span>{{ item.approvalDept }}</span>
          <span>{{ item.approvalPerson }}</span>
          <span>{{ item.colRemarks }}</span>
        </div>
      </el-timeline-item>
    </el-timeline>
    <el-dialog v-model="showReportBox" width="700px">
      <Print
        id="699886"
        :currDoc="currDoc"
        :obj="obj"
        :approval="approval"
        :LeaderApprover="LeaderApprover"
        :resReport="resReport"
      />
    </el-dialog>
  </el-card>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { getWarningDetail } from "@/api/warning/index";
import { downloadFile } from "@/utils/download";
import Print from "./print.vue";
const route = useRoute();
const obj = ref({});
const approval = ref([]);
const ruleArr = ref({});
const LeaderApprover = ref([]);
const resReport = ref({});
const showReportBox = ref(false);
const currDoc = ref(true);
const warningLevelType = ref(["低", "中", "高"]);
const govenStatus = ref(["人员类", "单位类", "无"]);
function getDetail() {
  getWarningDetail({ id: route.query.id }).then(res => {
    console.log(res);
    obj.value = res.data.info;
    approval.value = res.data.approval;
    ruleArr.value = res.data.result;
    LeaderApprover.value = res.data.fenbanbiao;
    if (res.data.tongzhishu.length != 0) {
      resReport.value = res.data.tongzhishu[0];
    } else {
      resReport.value = {};
    }
  });
}
// 下载
function downFile(fileName, signedUrl) {
  if (import.meta.env.PROD) {
    signedUrl.replace(
      "http://172.18.19.204:9999/",
      "https://hltm.jw.linan.gov.cn/"
    );
  }
  downloadFile(signedUrl, fileName);
}
function viewFile() {
  showReportBox.value = true;
  currDoc.value = true;
}
function viewFile2() {
  showReportBox.value = true;
  currDoc.value = false;
  // handleGetLeaderApprover();
}
getDetail();
</script>

<style lang="scss" scoped>
.logsBox {
  display: flex;
  justify-content: flex-start;
}
.logsBox span {
  display: inline-block;
  margin-right: 20px;
  min-width: 100px;
}
.approalInfoBox {
  position: fixed;
  top: 100px;
  right: 30px;
  display: flex;
  justify-content: flex-end;
  .info {
    text-align: center;
    margin-right: 0;
    border: 1px solid #f00;
    border-radius: 80px;
    height: 60px;
    width: 60px;
    line-height: 60px;
    background: #fff;
  }
}
</style>
