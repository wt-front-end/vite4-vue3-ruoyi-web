<!--
 * @Author: xkloveme
 * @Date: 2022-04-22 16:20:58
 * @LastEditTime: 2022-05-10 16:54:31
 * @LastEditors: xkloveme
 * @Description: json导出Excel说明
 * @FilePath: /la-ft-web/src/packages/wt-j2e/readme.md
 * @Copyright © xkloveme
-->

# json 导出 Excel 说明

> 需要导出 Excel 模版的页面,可以使用该组件,可以快速通过 json 生成对应的模版

## 参数

```js
  tableData: {
    // 单表表格数据
    type: Array,
    default: () => [],
  },
  columns: {
    // 单表表头
    //  "title",name支持
    // "dataIndex": field 字段
    type: Array,
    default: () => [],
  },
  operationName: {
    // 操作名称
    type: [String, Number],
    default: "查看",
  },
  sheets: {
    // 多表数据(注意,传了sheets,则tableData,columns会失效,否则会报错)
    type: Array,
    default: () => [],
  },
  fileName: {
    // 文件名
    type: String,
    default: "模版",
  },
```

> tableData 和 columns 保持一致

```js
// title 可替换为name
// dataIndex 可替换为field
let fileColumns = ref([
  {
    title: "姓名",
    dataIndex: "xm"
  },
  {
    title: "身份证号",
    dataIndex: "sfzh"
  },
  {
    title: "性别",
    dataIndex: "xb",
    rangeList: ["男", "女"]
  }
]);
let tableData = ref([
  { sfzh: 12343234, xm: "jixioa" },
  { sfzh: 12343234, xm: "4444" }
]);
```

## 跨行`isHead: true`

```js
let fileColumns = ref([
  {
    title: "我是标题",
    dataIndex: "sm",
    isHead: true,
    style: {
      supportTitle: true,
      // (可选)字体颜色
      color: "#00ff00",
      // (可选)字体大小
      fontSize: 12,
      // (可选)字体名称
      fontName: "宋体",
      // (可选)字体加粗：0 | 1
      fontBold: 1,
      // (可选)内容横向排版：Left、Center、Right
      alignmentHor: "Center",
      // (可选)内容竖向排版：Top、Center、Bottom
      alignmentVer: "Center"
      // (可选)背景颜色
      // backgroundColor: "#FF0000",
    }
  },
  {
    title: "姓名",
    dataIndex: "xm"
  },
  {
    title: "身份证号",
    dataIndex: "sfzh"
  }
]);
```

## 多 sheet 页,并且下拉超出范围

```js
      <wt-j2e :sheets="sheets"> 下载模版 </wt-j2e>
let fileColumns = [
  {
    title: "我是标题",
    dataIndex: "bt",
    isHead: true,
  },
  {
    title: "姓名",
    dataIndex: "xm",
    rangeList: ["姓名1", "姓名2"],
  },
  {
    title: "身份证号",
    dataIndex: "sfzh",
    rangeList: ["身份证号1", "身份证号2"],
  },
  {
    title: "工作单位",
    dataIndex: "gzdw",
    rangeList:'工作单位!R2C1:R74C1',
  },
];
let str = '拱墅区委办公室,拱墅区人大办,拱墅区政协办,拱墅区委组织部,拱墅区委宣传部,拱墅区委统战部,拱墅区委改革办,拱墅区城管局,拱墅区商务局,拱墅区市场监管局,规划资源拱墅分局,拱墅区残联,拱墅区司法局,拱墅区信访局,拱墅区退役军人局,拱墅区教育局,拱墅区天水街道,拱墅区半山街道,拱墅区康桥街道,拱墅区朝晖街道,拱墅区政府办公室,拱墅区数据局,拱墅区发改经信局,拱墅区统计局,拱墅区审计局,拱墅区卫健局,拱墅区红十字会,拱墅区机关事务中心,拱墅区审管办,拱墅区工商联,拱墅区公安分局,拱墅区武林街道,拱墅区祥符街道,拱墅区文晖街道,拱墅区委政法委,拱墅区委编办,拱墅区财政局,拱墅区投促局,拱墅区应急管理局,拱墅区国投集团,拱墅区城投集团,拱墅区市政公司,拱墅区数产园管委会,拱墅区法院,拱墅区上塘街道,拱墅区长庆街道,拱墅区潮鸣街道,拱墅区大关街道,拱墅区人力社保局,拱墅区总工会,拱墅区民政局,拱墅区文广旅体局,拱墅区科技局,拱墅区妇联,拱墅区委老干部局,拱墅区金融办,拱墅团区委,拱墅区委直属机关工委,拱墅区米市巷街道,拱墅区湖墅街道,拱墅区石桥街道,拱墅区和睦街道,拱投发,拱墅区拱宸桥指挥部,拱墅区运河指挥部,拱墅区住建局,拱墅区城建发展中心,拱墅区城中村指挥部,拱墅区检察院,拱墅区东新街道,拱墅区小河街道,拱墅区拱宸桥街道,拱墅区纪委区监'
let arr = str.split(',');
let arr1 = [];
arr.forEach(item => {
  arr1.push({
    gzdw: item,
  });
});
  const sheets = [
      {
        // 单个 sheet 名字
        name: '用户数据1',
        // 单个 sheet 数据源
        data: [],
        // 单个 sheet 列名称与读取key
        columns: fileColumns
      },
      {
        // 单个 sheet 名字
        name: '工作单位',
        // 单个 sheet 数据源
        data: arr1,
        // 单个 sheet 列名称与读取key
        columns: [ {
    title: "工作单位",
    dataIndex: "gzdw",
  }]
      }
    ]
```

## columns 说明

```js
   title: '用户名称',
    dataIndex: 'name'
    // (可选)单元格样式
    // 也可以这里指定类型，也可以通过 beforeChange 拦截设定类型 Number String
    dataType: 'Date'
    // 支持下拉选择
    rangeList:['10','20'],
    style: {
      // (可选)样式属性是否支持标题使用，默认 false
      supportTitle: true,
      // (可选)字体颜色
      color: '#00ff00',
      // (可选)字体大小
      fontSize: 12,
      // (可选)字体名称
      fontName: '宋体',
      // (可选)字体加粗：0 | 1
      fontBold: 1,
      // (可选)内容横向排版：Left、Center、Right
      alignmentHor: 'Center',
      // (可选)内容竖向排版：Top、Center、Bottom
      alignmentVer: 'Center',
      // (可选)背景颜色
      backgroundColor: '#FF0000',
      // (可选)行高，一行多列单元格，会取有行高值的最后一列使用，所以只要行高一样，可任意在一列设置行高，如果值不一样以最后有值的一列为准(单位：磅)
      // rowHeight: 100,
      // (可选)列宽，一列多行单元格，固定取每列的 0 行位置单元格列宽，目前与横向合并单元格存在定位冲突，也就是暂时不支持横向合并单元格时使用列宽属性(单位：磅)
      // colWidth: 100,
      // (可选)单元格边框颜色
      // 支持空格分开进行单边设置 borderColor: '#00ff00 #00ff00 #00ff00 #00ff00'，如果进行单边设置，没设置的边不显示，默认 #000000
      borderColor: '#00ff00',
      // (可选)单元格边框宽度
      // 支持空格分开进行单边设置 borderWidth: '1 2 1 2'，如果进行单边设置，没设置的边不显示
      borderWidth: 1,
      // (可选)单元格边框显示位置：Left、Top、Right、Bottom
      // 支持空格分开进行单边设置 borderPosition: 'Left Top Right Bottom'，支持空格分开进行单边设置，没设置的边不显示，默认:（空 || '' === borderPosition: 'Left Top Right Bottom'）
      borderPosition: '',
      // (可选)单元格边框样式：Continuous、Dash、Dot、DashDot、DashDotDot、Double，默认 Continuous
      // 支持空格分开进行单边设置 borderStyle: 'Continuous Dash Dot DashDot'，如果进行单边设置，没设置的边不显示
      borderStyle: 'Continuous',
      // (可选)合并单元格列表（row 不传则为每行，也可以放到数组底部，作为通用行使用，如果放到数组第0位，会直接使用这个通用样式，后面的样式不会在被使用上）
      merges:[
        {
          // (可选)合并单元格从该字段这一列的第几行开始，索引从 0 开始，不传则为每行，为该列通用行
          row: 1,
          // (可选)横向合并几列单元格，默认 0 也就是自身
          // hor: 2,
          // (可选)竖向合并几行单元格，默认 0 也就是自身
          ver: 1
        },
        {
          // 通用合并模板：相当于所有没有指定 row 的行都使用通用合并模板
          // (可选)合并单元格从该字段这一列的第几行开始，索引从 0 开始，不传则为每行
          // row: 3
          // (可选)横向合并几列单元格，默认 0 也就是自身
          // hor: 3
          // (可选)竖向合并几行单元格，默认 0 也就是自身
          // ver: 1
        }
      ]
    }
```

## sheets 说明

> 用户多 sheet 页内容导出,data 和 columns 数据结构 跟 tableData 和 columns 保持一致

```js
// 将要保存的 sheets 数据
const sheets = [
  {
    // 单个 sheet 名字
    name: "用户数据1",
    // 单个 sheet 数据源
    data: dataSource,
    // 单个 sheet 列名称与读取key
    columns: columns
  },
  {
    // 单个 sheet 名字
    name: "用户数据2",
    // 单个 sheet 数据源
    data: [],
    // 单个 sheet 列名称与读取key
    columns: columns
  }
];
```
