<!--
 * @Author: xkloveme
 * @Date: 2022-04-22 16:20:58
 * @LastEditTime: 2022-04-24 13:34:58
 * @LastEditors: xkloveme
 * @Description: Excel导出json说明
 * @FilePath: /la-ft-web/src/packages/wt-e2j/readme.md
 * @Copyright © xkloveme
-->

# Excel 导出 json 说明

> 通过导出 Excel 模版,生成 json 生成对应的数据

## 参数

```js
 <wt-e2j @getJsonData="getJsonData"></wt-e2j>
```

## 示例

```js
let dynamicValidateForm = reactive({
  peoples: [
    {
      name: "",
      sfzh: ""
    }
  ]
});
// 表格多sheet ,但sheet都支持
function getJsonData(object) {
  let arr = [];
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      object[key]?.map((item, index) => {
        arr.push({
          name: item["姓名"],
          sfzh: item["身份证号"]
        });
      });
    }
  }
  if (
    dynamicValidateForm?.peoples.length == 1 &&
    dynamicValidateForm?.peoples[0]?.name == "" &&
    dynamicValidateForm?.peoples[0]?.sfzh == ""
  ) {
    if (arr.length > 0) {
      dynamicValidateForm.peoples = arr;
    } else {
      proxy.$modal.msgError("未获取到导入人员");
    }
  } else {
    dynamicValidateForm.peoples = [...dynamicValidateForm?.peoples, ...arr];
  }
}
```
