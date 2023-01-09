/*
 * @Author: xkloveme
 * @Date: 2022-04-12 17:27:39
 * @LastEditTime: 2022-12-06 10:38:40
 * @LastEditors: xkloveme
 * @Description: 表格列
 * @FilePath: /js-web/src/views/project/xmjd/components/table.js
 * @Copyright © xkloveme
 */
export let columns = () => {
  return [
    {
      title: "地区",
      dataIndex: "area",
      formatter: (row, column) => {
        return ['嘉善','吴江','青浦',][row.area];
      }
    },
    {
      title: "项目名称",
      width: 250,
      dataIndex: "projectName",
    },
    {
      title: "投资进度",
      dataIndex: "process",
      formatter: (row, column) => {
        return (row.process || '-') + '%';
      }
    },
    {
      title: "项目简介",
      width: 260,
      dataIndex: "projectContent",
    },
    {
      title: "监督检查",
      dataIndex: "countInfo",
      slot: "countInfo"
    },
    {
      title: "问题清单",
      dataIndex: "countProblem",
      slot: "countProblem"
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 320,
      slot: "action"
    }
  ];
};
export let columns1 = () => {
  return [
    {
      title: "问题描述",
      dataIndex: "remark",
    },
    {
      title: "状态",
      dataIndex: "status",
      formatter: (row, column) => {
        return ['整改中','已整改'][row.status];
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      slot: "action"
    }
  ];
};