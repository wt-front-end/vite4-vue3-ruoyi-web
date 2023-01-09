<template>
  <el-button @click="print" v-if="props.showDownload">打印</el-button>
  <div
    id="printMe"
    style="
      min-height: 1650px;
      disaply: flex;
      align-items: center;
      justify-content: center;
    "
    ref="pdfDom"
  >
    <p
      style="
        margin-top: 0pt;
        margin-bottom: 0pt;
        text-align: center;
        widows: 0;
        orphans: 0;
        font-size: 22pt;
      "
    >
      <span style="font-family:&#39;黑体&#39;"
        >领导干部因私出国（境）审批表</span
      >
    </p>
    <table
      cellspacing="0"
      cellpadding="0"
      style="
        width: 471.8pt;
        border-collapse: collapse;
        page-break-after: always;
      "
    >
      <tbody>
        <tr style="height: 40.8pt">
          <td
            style="
              width: 46.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >姓 名</span
              >
            </p>
          </td>
          <td
            colspan="4"
            style="
              width: 69.65pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.name
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 46.7pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >性 别</span
              >
            </p>
          </td>
          <td
            style="
              width: 64.05pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.gender == 0
                  ? "男"
                  : props.printObj.gender == 1
                  ? "女"
                  : ""
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 45.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >民族</span
              >
            </p>
          </td>
          <td
            style="
              width: 43.55pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                filterType(
                  props.printObj.nation,
                  lajw_ft_nation,
                  "label",
                  "value"
                )
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 45.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >籍贯</span
              >
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 64.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.nativePlace
              }}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td
            style="
              width: 46.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >出 生年 月</span
              >
            </p>
          </td>
          <td
            colspan="4"
            style="
              width: 79.65pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.csrq
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 46.7pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >入 党时 间</span
              >
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 110.05pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                formDate(props.printObj.rdsj)
              }}</span>
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 69.55pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >参加工作</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >时&nbsp;&nbsp;间</span
              >
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 64.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                formDate(props.printObj.cjgzsj)
              }}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td
            style="
              width: 46.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >学 历</span
              >
            </p>
          </td>
          <td
            colspan="4"
            style="
              width: 69.65pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.xl
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 46.7pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >毕 业院 校</span
              >
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 144.4pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.byyx
              }}</span>
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 64.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >健康状况</span
              >
            </p>
          </td>
          <td
            style="
              width: 55.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.jkzk
              }}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td
            style="
              width: 46.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >单位职务</span
              >
            </p>
          </td>
          <td
            colspan="11"
            style="
              width: 403.25pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >{{ props.printObj.zgdw }}-{{ props.printObj.zw }}</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 33pt">
          <td
            colspan="3"
            style="
              width: 86.4pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >身份证号码</span
              >
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 363.05pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.sfzh
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 33pt">
          <td
            colspan="2"
            rowspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >国 外通讯处</span
              >
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 35.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >中文</span
              >
            </p>
          </td>
          <td
            colspan="8"
            style="
              width: 351.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.gwtxcChina
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 33pt">
          <td
            colspan="2"
            style="
              width: 35.2pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >外文</span
              >
            </p>
          </td>
          <td
            colspan="8"
            style="
              width: 351.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.gwtxcEnglish
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 150pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">简</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">历</span>
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.jl
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 165.55pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >国内直系亲属及主要社会关系情况</span
              >
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span
                style="font-family:&#39;仿宋&#39;; font-size:15pt"
                v-for="(item, index) in gnftFamilyArr"
                :key="index"
                ><span v-if="index != 0">、</span>{{ item.gx }}-{{ item.xm }}-{{
                  item.zzmm
                }}-{{ item.gzdw }}-{{ item.zw }}</span
              >
              <!-- <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >关系、姓名、年龄、政治面貌、工作单位、职务</span
              > -->
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      cellspacing="0"
      cellpadding="0"
      style="
        width: 471.8pt;
        border-collapse: collapse;
        page-break-after: always;
      "
    >
      <tbody>
        <tr style="height: 207pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >国外直系亲属及主要社会关系情况</span
              >
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span
                style="font-family:&#39;仿宋&#39;; font-size:15pt"
                v-for="(item, index) in gwftFamilyArr"
                :key="index"
                ><span v-if="index != 0">、</span>{{ item.gx }}-{{ item.xm }}-{{
                  item.zzmm
                }}-{{ item.gzdw }}-{{ item.zw }}</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 220.7pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 33pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">政</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 33pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">治</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 33pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">表</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 33pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">现</span>
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">{{
                props.printObj.zzbx
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 207pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">申</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">请</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">理</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">由</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">及</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">期</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt">限</span>
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >出国（境）事由：{{ props.printObj.cgsy }}</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >起止时间：{{ props.printObj.spkssj }}至{{
                  props.printObj.spjssj
                }}，共计{{
                  getTimeDay(props.printObj.spkssj, props.printObj.spjssj)
                }}</span
              >
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      cellspacing="0"
      cellpadding="0"
      style="
        width: 471.8pt;
        border-collapse: collapse;
        page-break-after: always;
      "
    >
      <tbody>
        <tr style="height: 205.15pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >所在</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >单位</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >审查</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >意见</span
              >
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >负责人（签名）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                （单位盖章）</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-indent: 247.5pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >年&nbsp;&nbsp; 月&nbsp;&nbsp; 日</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 205.2pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >纪委</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >审查</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >意见</span
              >
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >负责人（签名）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                （单位盖章）</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-indent: 247.5pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >年&nbsp;&nbsp; 月&nbsp;&nbsp; 日</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 219.3pt">
          <td
            colspan="2"
            style="
              width: 52.1pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >批准</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >机关</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                line-height: 25pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >意见</span
              >
            </p>
          </td>
          <td
            colspan="10"
            style="
              width: 397.35pt;
              border-style: solid;
              border-width: 0.75pt;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: middle;
            "
          >
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >负责人（签名）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                （单位盖章）</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >&nbsp;</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-indent: 247.5pt;
                text-align: justify;
                line-height: 20pt;
                widows: 0;
                orphans: 0;
              "
            >
              <span style="font-family:&#39;仿宋&#39;; font-size:15pt"
                >年&nbsp;&nbsp; 月&nbsp;&nbsp; 日</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 0pt">
          <td style="width: 57pt"></td>
          <td style="width: 5.9pt"></td>
          <td style="width: 34.3pt"></td>
          <td style="width: 11.7pt"></td>
          <td style="width: 28.55pt"></td>
          <td style="width: 57.5pt"></td>
          <td style="width: 74.85pt"></td>
          <td style="width: 46pt"></td>
          <td style="width: 34.35pt"></td>
          <td style="width: 46pt"></td>
          <td style="width: 28.9pt"></td>
          <td style="width: 46pt"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { getSpd } from "@/api/abroad/index.js";
import { getSealPicSign } from "@/api/people/ry";
const { proxy } = getCurrentInstance();
const props = defineProps({
  // 数据
  printObj: {
    type: Object,
    default: () => {}
  },
  gnftFamilyArr: {
    type: Array,
    default: () => []
  },
  gwftFamilyArr: {
    type: Array,
    default: () => []
  },
  showDownload: {
    type: Boolean,
    default: false
  }
});
const approvalList = ref([]);
const img = ref(""); // 签章
watch(
  () => props.printObj,
  val => {
    getSpd({ instanceId: val.instanceId }).then(res => {
      console.log(res);
      approvalList.value = res.data;
    });
    let sealSn = "33012111282006313366";
    // deptCode TODO
    getSealPicSign({ sealSn: sealSn }).then(r => {
      img.value = "data:" + "image/png;base64," + r.data;
      // console.log(img.value);
    });
  },
  { immediate: true, deep: true }
);
// const emit = defineEmits();
const { lajw_ft_nation } = proxy.useDict("lajw_ft_nation");
function filterType(key, enumsType, name, values) {
  let enumsName = {};
  if (key) {
    enumsName = enumsType.find(item => {
      return item[values] == key;
    });
  }
  let label;
  if (enumsName) {
    label = enumsName[name];
    console.log(label);
  }
  return label;
}
function getTimeDay(startTime, endTime) {
  let date1 = new Date(startTime);
  let date2 = new Date(endTime);
  let date =
    (date2.getTime() - date1.getTime()) /
    (1000 * 60 * 60 * 24); /*不用考虑闰年否*/
  return date + 1 + "天";
}
function getTime(date) {
  let str = date.split(" ")[0];
  let arr = str.split("-");
  return arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
}
function print() {
  let oldTitle = document.title;
  // let oldHtml = document.body.innerHTML
  document.body.innerHTML = document.getElementById("printMe").innerHTML;
  document.title = "区管领导干部因私出国（境）审批表";
  window.print();
  document.title = oldTitle;
  window.location.reload();
  // document.body.innerHTML = oldHtml
}
function formDate(dates) {
  let date = new Date(dates);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return dates ? year + "-" + month + "-" + day : "";
}
</script>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
/* 设置打印范围的边距，不设置打印内容会顶着最上边 */
@media print {
  body {
    margin: 50px;
  }
}
</style>
