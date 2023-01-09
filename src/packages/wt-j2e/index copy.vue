<!--
 * @Author: xkloveme
 * @Date: 2022-04-22 15:38:27
 * @LastEditTime: 2022-05-10 17:06:21
 * @LastEditors: xkloveme
 * @Description: 旧方案,table生成,不太理想不支持下拉选择
 * @FilePath: /la-ft-web/src/packages/wt-j2e/index copy.vue
 * @Copyright © xkloveme
-->
<!--
 * @Author: xkloveme
 * @Date: 2022-04-21 15:45:06
 * @LastEditTime: 2022-04-22 14:07:25
 * @LastEditors: xkloveme
 * @Description: JSON转EXCEL
 * @FilePath: /la-ft-web/src/packages/wt-j2e/index.vue
 * @Copyright © xkloveme
-->
<template>
  <span :id="idName" @click="generate">
    <el-button size="small" type="text"> <slot></slot></el-button>
  </span>
</template>

<script>
import { saveAs } from "file-saver";
export default {
  name: "WtJ2e",
  props: {
    // mime type [xls, csv]
    type: {
      type: String,
      default: "xls"
    },
    // Json to download
    tableData: {
      type: Array,
      required: false,
      default: () => []
    },
    // fields inside the Json Object that you want to export
    // if no given, all the properties in the Json are exported
    fields: {
      type: Object,
      default: () => null
    },
    // this prop is used to fix the problem with other components that use the
    // variable fields, like vee-validate. exportFields works exactly like fields
    exportFields: {
      type: Object,
      default: () => null
    },
    // Use as fallback when the row has no field values
    defaultValue: {
      type: String,
      required: false,
      default: ""
    },
    // Title(s) for the data, could be a string or an array of strings (multiple titles)
    header: {
      default: null
    },
    // filename to export
    name: {
      type: String,
      default: "模版.xls"
    },
    fetch: {
      type: Function
    },
    meta: {
      type: Array,
      default: () => []
    },
    worksheet: {
      type: String,
      default: "Sheet1"
    },
    //event before generate was called
    beforeGenerate: {
      type: Function
    },
    //event before download pops up
    beforeFinish: {
      type: Function
    },
    // Determine if CSV Data should be escaped
    escapeCsv: {
      type: Boolean,
      default: true
    },
    // long number stringify
    stringifyLongNum: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // props
    const {
      type,
      fields,
      exportFields,
      beforeFinish,
      header,
      stringifyLongNum,
      beforeGenerate,
      tableData,
      fetch,
      defaultValue,
      name,
      worksheet
    } = toRefs(props);

    // computed
    const idName = computed(() => {
      var now = new Date().getTime();
      return "export_" + now;
    });

    const downloadFields = computed(() => {
      if (fields) return toRaw(fields.value);
      if (exportFields) return exportFields.value();
    });

    // methods
    const export1 = async (data1, filename, mine) => {
      let blob = base64ToBlob(data1, mine);
      if (typeof beforeFinish === "function") await beforeFinish();
      saveAs(blob, filename, mine);
    };

    const base64ToBlob = (data1, mine) => {
      let base64 = window.btoa(window.unescape(encodeURIComponent(data1)));
      let bstr = atob(base64);
      let n = bstr.length;
      let u8arr = new Uint8ClampedArray(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mine });
    };

    const jsonToXLS = () => {
      let xlsTemp =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>br {mso-data-placement: same-cell;}</style></head><body><table>${table}</table></body></html>';
      let xlsData = "<thead>";
      const colspan = 0;
      //Header
      if (header) {
        xlsData += parseExtraData(
          header.value,
          '<th colspan="' + colspan + '">${data}</th>'
        );
      }
      xlsData += "</thead>";
      if (tableData?.length) {
        //Data
        xlsData += "<tbody>";
        tableData &&
          tableData.map(function (item, index) {
            xlsData += "<tr>";
            for (let key in item) {
              xlsData +=
                "<td >" +
                preprocessLongNum(valueReformattedForMultilines(item[key])) +
                "</td>";
            }
            xlsData += "</tr>";
          });
        xlsData += "</tbody>";
      }
      return xlsTemp
        .replace("${table}", xlsData)
        .replace("${worksheet}", worksheet.value);
    };

    const parseExtraData = (extraData, format) => {
      let parseData = "";
      if (Array.isArray(extraData)) {
        for (var i = 0; i < extraData.length; i++) {
          if (extraData[i])
            parseData += format.replace("${data}", extraData[i]);
        }
      } else {
        parseData += format.replace("${data}", extraData);
      }
      return parseData;
    };

    const preprocessLongNum = value => {
      if (stringifyLongNum.value) {
        if (String(value).startsWith("0x")) {
          return value;
        }
        if (!isNaN(value) && value != "") {
          if (value > 99999999999 || value < 0.0000000000001) {
            return '="' + value + '"';
          }
        }
      }
      return value;
    };

    const valueReformattedForMultilines = value => {
      if (typeof value == "string") return value.replace(/\n/gi, "<br/>");
      else return value;
    };

    const getKeys = (data1, header1) => {
      if (header1) {
        return header1;
      }
      let keys = {};
      for (let key in data1[0]) {
        keys[key] = key;
      }
      return keys;
    };

    const parseValue = value => {
      return value || value === 0 || typeof value === "boolean"
        ? value
        : defaultValue.value;
    };

    const getValueFromNestedItem = (item, indexes) => {
      let nestedItem = item;
      for (let index of indexes) {
        if (nestedItem) nestedItem = nestedItem[index];
      }
      return parseValue(nestedItem);
    };

    const getValueFromCallback = (item, callback) => {
      if (typeof callback !== "function") return defaultValue.value;
      const value = callback(item);
      return parseValue(value);
    };

    const getValue = (key, item) => {
      const field = typeof key !== "object" ? key : key.field;
      let indexes = typeof field !== "string" ? [] : field.split(".");
      let value = defaultValue.value;
      console.log("keykey", key);
      if (!field) value = item;
      else if (indexes.length > 1)
        value = getValueFromNestedItem(item, indexes);
      else value = parseValue(item[field]);
      value = getValueFromCallback(value, key.callback);
      return value;
    };

    const getProcessedJson = (data1, header1) => {
      let keys = getKeys(data1, header1).value;
      let newData = [];
      data1 &&
        data1.map(function (item, index) {
          let newItem = {};
          for (let label in keys) {
            let property = keys[label];
            newItem[label] = getValue(property, item);
          }
          newData.push(newItem);
        });
      return newData;
    };

    const generate = async () => {
      // if (beforeGenerate && typeof beforeGenerate.value === "function") {
      //   await beforeGenerate.value();
      // }
      // let data2 = tableData && toRaw(tableData.value);
      // // if ((fetch && typeof fetch.value === "function") || !tableData) {
      // //   data2 = await fetch.value();
      // // }
      // // if (data2 && data2.length === 0) {
      // //   console.warn("无导出数据");
      // //   return;
      // // }
      // const DATA = toRaw(data2);
      // let json = getProcessedJson(DATA, downloadFields);
      if (type.value === "html") {
        // this is mainly for testing
        return export1(
          jsonToXLS(),
          name.value.replace(".xls", ".html"),
          "text/html"
        );
      }
      return export1(jsonToXLS(), name.value, "application/vnd.ms-excel");
    };

    return {
      idName,
      generate
    };
  }
};
</script>
