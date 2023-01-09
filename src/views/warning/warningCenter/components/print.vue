<template>
  <div>
    <el-button @click="download">下载</el-button>
    <div id="printMe" ref="pdfDom">
      <div class="reportBox" @click="() => {}">
        <div class="reportCon" style="overflow-y: auto; overflow-x: hidden">
          <div
            id="pdfCentent"
            v-if="currDoc"
            style="
              background: #fff;
              padding: 0px;
              line-height: 35px;
              font-size: 16px;
            "
          >
            <table
              style="
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                text-align: center;
              "
              border="0"
            >
              <tr>
                <td
                  style="
                    height: 80px;
                    text-align: center;
                    vertical-align: bottom;
                    font-size: 35px;
                    padding: 10px;
                    color: #000;
                  "
                >
                  <h1
                    v-if="
                      approval[0].colRemarks.indexOf('分办') != -1 &&
                      Number(obj.warningLevel) == 3
                    "
                  >
                    问题线索办理通知书
                  </h1>
                  <h1
                    v-if="
                      Number(obj.warningLevel) == 1 ||
                      Number(obj.warningLevel) == 2 ||
                      (approval[0].colRemarks.indexOf('业务外流转') != -1 &&
                        Number(obj.warningLevel) == 3)
                    "
                  >
                    预警问题处置通知书
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="text-align: right">
                  编号：{{ resReport.applyNo }}号
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                  <p class="organizer">
                    <span style="border-bottom: 1px solid #ccc; padding: 5px"
                      >{{ resReport.unitName }}:</span
                    >
                  </p>
                </td>
              </tr>
              <tr>
                <td style="text-align: left; text-indent: 2em">
                  <p>
                    根据委领导的批示意见，现将{{
                      resReport.warningPerson
                    }}的关于{{
                      resReport.ruleName
                    }}的问题线索传递给你们，请予调查处理。
                    调查情况处理结果在<strong
                      >{{ resReport.closeDate }}前</strong
                    >反馈区纪委所联系的纪检监察室，并抄送案件监督管理室。
                    如需延期报结、反馈，请与案管室联系，并按规定办理延期手续。
                  </p>
                  <p>(内部资料，注意保密。)</p>
                  <p>联系人：王康、金晓丽, 联系电话：63712692</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: right">
                  区纪委监委案管室<br /><strong>{{
                    resReport.createTime
                  }}</strong>
                </td>
              </tr>
            </table>
          </div>
          <div
            id="pdfNotise"
            v-if="!currDoc"
            class="table"
            style="
              background: #fff;
              padding: 20px;
              line-height: 30px;
              font-size: 14px;
            "
          >
            <h1 style="font-weight: bold; text-align: center">
              临安区纪委监察委<br />预警问题分办意见呈批表
            </h1>
            <div style="float: right">编号：{{ obj.applyNo }}号</div>
            <table
              style="
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                text-align: center;
              "
              border="1"
            >
              <tr>
                <th width="200" style="padding: 5px">预警对象</th>
                <td width="200">{{ obj.warningPerson }}</td>
                <th width="150">民族</th>
                <td width="150">{{ obj.nation || "-" }}</td>
                <th width="150">政治面貌</th>
                <td width="150">{{ obj.politics || "-" }}</td>
              </tr>
              <tr>
                <th width="200" style="padding: 5px">单位及职务</th>
                <td>{{ obj.personDept }} {{ obj.personJob }}</td>
                <th colspan="2">预警类型</th>
                <td colspan="2">{{ obj.eventType }}</td>
              </tr>
              <tr>
                <th style="padding: 5px">预警<br />问题<br />主要<br />内容</th>
                <td colspan="5" style="padding: 5px; text-align: left">
                  {{ obj.ruleConditions }}
                </td>
              </tr>
              <tr>
                <th style="padding: 5px">预警<br />问题<br />分送<br />意见</th>
                <td colspan="5">
                  <div
                    v-if="LeaderApprover[0]"
                    style="height: 80px; text-align: left; padding: 5px"
                  >
                    <template v-if="Number(LeaderApprover[0].colResult) === 0"
                      >同意</template
                    >
                    <template v-if="Number(LeaderApprover[0].colResult) === 1"
                      >不同意</template
                    >
                    <template v-if="Number(LeaderApprover[0].colResult) === 2"
                      >拟同意</template
                    >
                  </div>
                  <!-- TODO: 头像 -->
                  <div style="text-align: right; padding-right: 20px">
                    签名：
                    <span style="margin-right: 20px; display: inline-block"
                      ><img
                        width="100"
                        height="60"
                        crossOrigin="anonymous"
                        :src="img0"
                        v-if="img0" /></span
                    >{{
                      (LeaderApprover[0] && LeaderApprover[0].createTime) ||
                      "年&emsp;&emsp;月&emsp;&emsp;日"
                    }}
                  </div>
                </td>
              </tr>
              <tr>
                <th style="padding: 5px">分管<br />常委<br />审核<br />意见</th>
                <td colspan="5">
                  <div
                    v-if="LeaderApprover[1]"
                    style="height: 80px; text-align: left; padding: 5px"
                  >
                    <template v-if="Number(LeaderApprover[1].colResult) === 0"
                      >同意</template
                    >
                    <template v-if="Number(LeaderApprover[1].colResult) === 1"
                      >不同意</template
                    >
                    <template v-if="Number(LeaderApprover[1].colResult) === 2"
                      >拟同意</template
                    >
                  </div>
                  <div style="text-align: right; padding-right: 20px">
                    签名：<span
                      style="margin-right: 20px; display: inline-block"
                      ><img
                        width="100"
                        height="60"
                        crossOrigin="anonymous"
                        v-if="LeaderApprover[1]"
                        :src="img1"
                    /></span>
                    {{
                      (LeaderApprover[1] && LeaderApprover[1].createTime) ||
                      "年&emsp;&emsp;月&emsp;&emsp;日"
                    }}
                  </div>
                </td>
              </tr>
              <tr>
                <th style="padding: 5px">
                  分管<br />副书记<br />审批<br />意见
                </th>
                <td colspan="5">
                  <div
                    v-if="LeaderApprover[2]"
                    style="height: 80px; text-align: left; padding: 5px"
                  >
                    <template v-if="Number(LeaderApprover[2].colResult) === 0"
                      >同意</template
                    >
                    <template v-if="Number(LeaderApprover[2].colResult) === 1"
                      >不同意</template
                    >
                    <template v-if="Number(LeaderApprover[2].colResult) === 2"
                      >拟同意</template
                    >
                  </div>
                  <!-- TODO: 签名没有 -->
                  <div style="text-align: right; padding-right: 20px">
                    签名：<span
                      style="margin-right: 20px; display: inline-block"
                      ><img
                        width="100"
                        height="60"
                        crossOrigin="anonymous"
                        v-if="LeaderApprover[2]"
                        :src="img2"
                    /></span>
                    {{
                      (LeaderApprover[2] && LeaderApprover[2].createTime) ||
                      "年&emsp;&emsp;月&emsp;&emsp;日"
                    }}
                  </div>
                </td>
              </tr>
              <tr>
                <th style="padding: 5px">书记<br />审批<br />意见</th>
                <td colspan="5">
                  <div
                    v-if="LeaderApprover[3]"
                    style="height: 80px; text-align: left; padding: 5px"
                  >
                    <template v-if="Number(LeaderApprover[3].colResult) === 0"
                      >同意</template
                    >
                    <template v-if="Number(LeaderApprover[3].colResult) === 1"
                      >不同意</template
                    >
                    <template v-if="Number(LeaderApprover[3].colResult) === 2"
                      >拟同意</template
                    >
                  </div>
                  <div style="text-align: right; padding-right: 20px">
                    签名：<span
                      style="margin-right: 20px; display: inline-block"
                      ><img
                        width="100"
                        height="60"
                        crossOrigin="anonymous"
                        v-if="LeaderApprover[3]"
                        :src="img3"
                    /></span>
                    <!-- LeaderApprover[3].autograph -->
                    {{
                      (LeaderApprover[3] && LeaderApprover[3].createTime) ||
                      "年&emsp;&emsp;月&emsp;&emsp;日"
                    }}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <!-- <div @click="printdiv('printcontent')" class="printBtn">打印</div> -->
          <!-- <div
            v-if="currDoc"
            @click="download('问题线索办理通知书', 'pdfCentent')"
            class="printBtn"
          >
            下载
          </div>
          <div
            v-if="!currDoc"
            @click="download('分办意见呈批表', 'pdfNotise')"
            class="printBtn"
          >
            下载
          </div>
          <div class="reportBoxClose" @click="reportBoxClose">
            <a-icon type="close" />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getDownloadFile } from "@/api/warning/index";
// const obj = ref({});
// const approval = ref([]);
// const resReport = ref({});
// const currDoc = ref(true);
// const LeaderApprover = ref([]);
const img0 = ref("");
const img1 = ref("");
const img2 = ref("");
const img3 = ref("");
const props = defineProps({
  // 数据
  id: {
    type: Number || String,
    default: 0
  },
  currDoc: {
    type: Boolean,
    default: false
  },
  obj: {
    type: Object,
    default: () => {}
  },
  approval: {
    type: Array,
    default: () => []
  },
  LeaderApprover: {
    type: Array,
    default: () => []
  },
  resReport: {
    type: Object,
    default: () => {}
  }
});
// watch(
//   () => props.id,
//   val => {
//     getData();
//   },
//   { immediate: true }
// );
function download() {
  let oldTitle = document.title;
  document.body.innerHTML = document.getElementById("printMe").innerHTML;
  if (props.currDoc) {
    document.title = "问题线索办理通知书";
  } else {
    document.title = "分办意见呈批表";
  }
  var imgNum = document.getElementsByTagName("img").length;
  if (imgNum > 0) {
    document.getElementsByTagName("img")[imgNum - 1].onload = function () {
      setTimeout(function () {
        window.print();
        document.title = oldTitle;
        window.location.reload();
      }, 300);
    };
  } else {
    window.print();
    document.title = oldTitle;
    window.location.reload();
    setTimeout(function () {
      window.close();
    }, 300);
  }
  //   window.print();
}
function getData() {
  if (props.LeaderApprover.length >= 1) {
    getImgUrl(props.LeaderApprover[0].autograph).then(res => {
      img0.value = res;
    });
  }
  if (props.LeaderApprover.length >= 2) {
    getImgUrl(props.LeaderApprover[1].autograph).then(res => {
      img1.value = res;
    });
  }
  if (props.LeaderApprover.length >= 3) {
    getImgUrl(props.LeaderApprover[2].autograph).then(res => {
      img2.value = res;
    });
  }
  if (props.LeaderApprover.length >= 4) {
    getImgUrl(props.LeaderApprover[3].autograph).then(res => {
      img3.value = res;
    });
  }
}
function getImgUrl(objectName) {
  return getDownloadFile({
    objectName: objectName
  }).then(res => {
    // return res.data.signedUrl;
    // (import.meta.env.PROD)
    let url = res.data.signedUrl;
    if (url.startsWith("http://hltm.jw.linan.gov.cn")) {
      return url.replace(
        "http://hltm.jw.linan.gov.cn/",
        "https://hltm.jw.linan.gov.cn/"
      );
    } else {
      return url.replace(
        "http://172.18.19.204:9999/",
        "https://hltm.jw.linan.gov.cn/"
      );
    }
  });
}
onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>
#pdfNotise {
  tr,
  th {
    border: 1px solid #000;
  }
}

// .reportBox {
//   position: fixed;
//   width: 100vw;
//   height: 100vh;
//   left: 0;
//   top: 0;
//   z-index: 100;
//   background: rgba(17, 17, 17, 0.6);
// }
.reportCon {
  margin: 0 auto;
  width: 600px;
  //   height: 600px;
  position: relative;
  background: #fff;
}
.reportBoxClose {
  position: absolute;
  z-index: 101;
  top: 0;
  right: 10px;
  width: 40px;
  height: 40px;
  font-size: 25px;
  text-align: center;
  cursor: pointer;
}
.printBtn {
  position: absolute;
  top: 5px;
  right: 60px;
  cursor: pointer;
  z-index: 101;
  padding: 2px;
  border-radius: 10%;
  border: 1px solid #ccc;
  cursor: pointer;
}
.printHideCss {
  //   display: none;
}
</style>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
/* 设置打印范围的边距，不设置打印内容会顶着最上边 */
@media print {
  body {
    margin: 50px;
    height: 95%;
  }
}
</style>
