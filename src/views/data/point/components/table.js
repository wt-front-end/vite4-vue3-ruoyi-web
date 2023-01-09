/*
 * @Author: xkloveme
 * @Date: 2022-04-12 17:27:39
 * @LastEditTime: 2022-11-07 16:27:33
 * @LastEditors: xkloveme
 * @Description: 表格列
 * @FilePath: /js-web/src/views/data/point/components/table.js
 * @Copyright © xkloveme
 */
export let columns = () => {
  return [
    {
      "title": "地区",
      "dataIndex": "area"
    },
    {
      "title": "点位名称",
      "dataIndex": "name"
    },
    {
      "title": "点位类型",
      "dataIndex": "type"
    },
    {
      "title": "线路类型",
      "dataIndex": "line"
    },
    {
      "title": "详细地址",
      "dataIndex": "address"
    },
    {
      "title": "电话",
      "dataIndex": "phone"
    },
    {
      "title": "经纬度",
      "dataIndex": "jwd",
      formatter: (row, column) => {
        return row.longitude+ "," +row.latitude;
      }
    },
    {
      "title": "VR地址",
      "dataIndex": "vrLink"
    }
  ];
};
