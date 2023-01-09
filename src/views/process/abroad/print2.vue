<template>
  <el-button @click="print" v-if="props.showDownload">打印</el-button>
  <div id="printMe" style="min-height: 1650px" ref="pdfDom">
    <p
      style="
        margin-top: 0pt;
        margin-bottom: 0pt;
        text-indent: 36pt;
        text-align: center;
        widows: 0;
        orphans: 0;
        font-size: 18pt;
      "
    >
      <span style="font-family:&#39;黑体&#39;"
        >国家工作人员因私出国（境）审批表</span
      >
    </p>
    <table
      cellspacing="0"
      cellpadding="0"
      style="
        margin-right: 9pt;
        margin-left: 9pt;
        border-collapse: collapse;
        float: left;
        page-break-after: always;
      "
    >
      <tbody>
        <tr style="height: 31.5pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >姓&nbsp;&nbsp;&nbsp; 名</span
              >
            </p>
          </td>
          <td
            style="
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.name
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 50.4pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >性&nbsp;&nbsp;&nbsp; 别</span
              >
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 45.4pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
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
              width: 39.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">民&nbsp; 族</span>
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 37.8pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
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
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">籍&nbsp; 贯</span>
            </p>
          </td>
          <td
            style="
              width: 43.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.nativePlace
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 31.5pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">出生年月</span>
            </p>
          </td>
          <td
            style="
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.csrq
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 50.4pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">工作时间</span>
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 45.4pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                formDate(props.printObj.cjgzsj)
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 39.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">学&nbsp; 历</span>
            </p>
          </td>
          <td
            colspan="2"
            style="
              width: 37.8pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.xl
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">党&nbsp; 派</span>
            </p>
          </td>
          <td
            style="
              width: 43.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.dp
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 30.75pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">单位职务</span>
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >{{ props.printObj.zgdw }}-{{ props.printObj.zw }}</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 28.25pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">身 份 证</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >号&nbsp;&nbsp;&nbsp; 码</span
              >
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.sfzh
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 106.5pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">工作简历</span>
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.jl
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 67pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >国内直系亲属及主要社会关系</span
              >
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span
                style="font-family:&#39;仿宋&#39;"
                v-for="(item, index) in gnftFamilyArr"
                :key="index"
                ><span v-if="index != 0">、</span>{{ item.xm }}-{{
                  item.gzdw
                }}-{{ item.lxfs }}</span
              >
              <!-- <span style="font-family:&#39;仿宋&#39;; color:#ff0000"
                >#姓名-工作单位-联系方式#、#姓名-工作单位-联系方式#</span
              > -->
            </p>
          </td>
        </tr>
        <tr style="height: 44pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >国外直系亲属及主要社会关系</span
              >
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span
                style="font-family:&#39;仿宋&#39;"
                v-for="(item, index) in gwftFamilyArr"
                :key="index"
                ><span v-if="index != 0">、</span>{{ item.xm }}-{{
                  item.gzdw
                }}-{{ item.lxfs }}</span
              >
              <!-- <span style="font-family:&#39;仿宋&#39;; color:#ff0000"
                >#姓名-工作单位-联系方式#、#姓名-工作单位-联系方式#</span
              > -->
            </p>
          </td>
        </tr>
        <tr style="height: 57.5pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">出国(境)</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">目 的 地</span>
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 160.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.spmdd
              }}</span>
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">出国(境)</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >时&nbsp;&nbsp;&nbsp; 间</span
              >
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 151.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.spkssj + "至" + props.printObj.spjssj
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 55pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">在国(境)外</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: center;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">停留时间</span>
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 160.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                getTimeDay(props.printObj.spkssj, props.printObj.spjssj)
              }}</span>
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 52.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">同行人员</span>
            </p>
          </td>
          <td
            colspan="3"
            style="
              width: 151.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.txry
              }}</span>
            </p>
          </td>
        </tr>
        <tr style="height: 102.3pt">
          <td
            style="
              width: 66.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >申&nbsp;&nbsp;&nbsp; 请</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">出国(境)</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >事&nbsp;&nbsp;&nbsp; 由</span
              >
            </p>
          </td>
          <td
            colspan="9"
            style="
              width: 385.2pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                props.printObj.cgsy
              }}</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: right;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">
                本人签名：{{
                  props.printObj.name
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {{ getTime(props.printObj.createTime) }}</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 24.3pt">
          <td
            colspan="10"
            style="
              width: 462.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;"
                >以上内容由个人填写，组织审核；以下内容由有关单位填写。</span
              >
            </p>
          </td>
        </tr>
        <tr style="height: 0pt">
          <td style="width: 77.4pt"></td>
          <td style="width: 63pt"></td>
          <td style="width: 61.2pt"></td>
          <td style="width: 46.8pt"></td>
          <td style="width: 9.4pt"></td>
          <td style="width: 50pt"></td>
          <td style="width: 3.6pt"></td>
          <td style="width: 45pt"></td>
          <td style="width: 63pt"></td>
          <td style="width: 54pt"></td>
        </tr>
      </tbody>
    </table>
    <p
      style="
        margin-top: 0pt;
        margin-bottom: 0pt;
        text-align: justify;
        widows: 0;
        orphans: 0;
        font-size: 10.5pt;
        page-break-after: always;
      "
    >
      <span style="font-family:&#39;Times New Roman&#39;">&nbsp;</span>
    </p>
    <table
      cellspacing="0"
      cellpadding="0"
      style="
        margin-right: 9pt;
        margin-left: 9pt;
        border-collapse: collapse;
        float: left;
        margin-top: 30px;
      "
    >
      <tbody>
        <tr
          style="height: 134.25pt"
          v-for="(item, index) in approvalList"
          :key="index"
        >
          <td
            style="
              width: 77.6pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">{{
                item.taskName
              }}</span>
            </p>
          </td>
          <td
            style="
              width: 396.5pt;
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
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span
                style="font-family:&#39;仿宋&#39;"
                v-if="index != approvalList.length - 1"
                >{{ item.result == "同意" ? item.result : item.remark }}</span
              >
              <span style="font-family:&#39;仿宋&#39;" v-else
                >&nbsp;&nbsp;&nbsp; 经研究，同意{{
                  props.printObj.name
                }}
                同志自费赴{{ props.printObj.spmdd }} （国家或地区）进行{{
                  props.printObj.cgsy
                }}
                活动，在外时间{{
                  getTimeDay(props.printObj.spkssj, props.printObj.spjssj)
                }}。</span
              >
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: justify;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;">&nbsp;</span>
            </p>
            <p
              style="
                margin-top: 0pt;
                margin-bottom: 0pt;
                text-align: right;
                widows: 0;
                orphans: 0;
                font-size: 12pt;
              "
            >
              <span style="font-family:&#39;仿宋&#39;" v-if="index == 0"
                >审批人：{{
                  item.approvalUserName
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  getTime(item.createTime)
                }}
              </span>
              <span style="font-family:&#39;仿宋&#39;" v-else
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  getTime(item.createTime)
                }}
              </span>
            </p>
            <img
              v-if="index != 0 && item.signature"
              :src="item.signature"
              alt=""
              style="
                width: 80px;
                height: 80px;
                position: relative;
                left: 393px;
                top: -60px;
              "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { getSpd } from "@/api/abroad/index.js";
import { getSealPicSign } from "@/api/people/ry";
import axios from "axios";

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
watch(
  () => props.printObj,
  val => {
    getSpd({ instanceId: val.instanceId }).then(res => {
      approvalList.value = res.data;

      const requestList = [];
      for (let index = 0; index < res.data.length; index++) {
        const { deptCode } = res.data[index];
        console.log("测试信息--", deptCode);
        requestList.push(getSealPicSign({ sealSn: deptCode }));
      }
      axios.all(requestList).then(base64List => {
        // 签章
        for (let index = 0; index < base64List.length; index++) {
          approvalList.value[index].signature =
            "data:image/png;base64," + base64List[index].data;
        }
      });
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
  document.title = "国家工作人员因私出国（境）审批表";
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
