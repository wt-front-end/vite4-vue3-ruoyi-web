/*
 * @Author: xkloveme
 * @Date: 2022-04-12 17:27:39
 * @LastEditTime: 2022-05-05 10:24:45
 * @LastEditors: xkloveme
 * @Description: 表格列
 * @FilePath: /la-ft-web/src/views/bulletin/notary/components/table.js
 * @Copyright © xkloveme
 */
export let columns = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "发起方",
      dataIndex: "areaName",
      // formatter: (row, column) => {
      //   return ['嘉善','青浦','吴江'][row.area];
      // }
    },
    {
      title: "发起时间",
      dataIndex: "launchTime",
    },
    {
      title: "参与方",
      dataIndex: "participantsName",
      // formatter: (row, column) => {
      //   return row.process + '%';
      // }
    },
    {
      title: "监督类型",
      dataIndex: "supervisionTypeName",
    },
    {
      title: "监督主题",
      dataIndex: "theme",
    },
    {
      title: "状态",
      dataIndex: "status",
      formatter: (row, column) => {
        if (row.status == 10) {
          return '发起中'
        } else if (row.status == 20) {
          return '进行中'
        } else if (row.status == 21) {
          return '整改中'
        } else if (row.status == 30) {
          return '已撤销'
        } else if (row.status == 40) {
          return '已完成'
        }
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 320,
      slot: "action"
    }
  ];
};
export let columns1 = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "检查方",
      dataIndex: "areaName",
      // formatter: (row, column) => {
      //   return ['嘉善','青浦','吴江'][row.area];
      // }
    },
    {
      title: "检查状态",
      dataIndex: "checkStatus",
    },
    {
      title: "检查结果",
      dataIndex: "checkResult",
    },
    {
      title: "检查时间",
      dataIndex: "checkTime",
    },
    {
      title: "问题列表",
      dataIndex: "problemNum",
      slot: "problemNum"
    },
    {
      title: "工作场景",
      width: 100,
      dataIndex: "workScene",
      slot: "workScene"
    },
  ];
};
export let columns2 = (
) => {
  return [
    {
      title: "处置方",
      dataIndex: "feedbackParticipantsAreaName",
    },
    {
      title: "问题描述",
      dataIndex: "problem",
    },
    {
      title: "问题图片",
      dataIndex: "fileList",
      slot: "fileList"
      // formatter: (row, column) => {
      //   return row.fileList ? `${row.fileList.length}张` : '无';
      // }
    },
    {
      title: "检查方",
      dataIndex: "checkParticipantsAreaName",
    },
    {
      title: "状态",
      dataIndex: "feedbackStatus",
      formatter: (row, column) => {
        console.log(row,11111111111)
        return ['待反馈', '已反馈'][row.feedbackStatus];
      }
    },
    {
      title: "操作",
      width: 150,
      dataIndex: "action",
      slot: "action"
    },
  ];
};
export let columns3 = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "问题描述",
      dataIndex: "problem",
    },
    {
      title: "反馈给",
      dataIndex: "feedbackParticipantsAreaName",
    },
    {
      title: "问题图片",
      dataIndex: "fileList",
      slot: "fileList"
      // formatter: (row, column) => {
      //   return row.fileList ? `${row.fileList.length}张` : '无';
      // }
    },
    {
      title: "状态",
      dataIndex: "feedbackStatus",
      formatter: (row, column) => {
        return ['待处置','已处置'][row.feedbackStatus]
      }
    },
    {
      title: "操作",
      width: 400,
      dataIndex: "action",
      slot: "action"
    },
  ];
};
export let columns4 = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "处置结果",
      dataIndex: "feedbackResult",
      formatter: (row, column) => {
        return ['查否', '查实'][row.feedbackResult];
      }
    },
    {
      title: "处置内容",
      dataIndex: "feedbackContent",
    },
    {
      title: "挽回损失",
      dataIndex: "saveMoney",
    },
    {
      title: "责任追究",
      dataIndex: "resultList",
      slot: "resultList",
      // formatter: (row, column) => {
      //   return row.resultList ? `${row.resultList.length}条` : '无';
      // }
    },
    {
      title: "制度建设",
      dataIndex: "systemList",
      slot: "systemList",
      // formatter: (row, column) => {
      //   return row.systemList ? `${row.systemList.length}条` : '无';
      // }
    },
    {
      title: "附件",
      dataIndex: "fileList",
      width: 200,
      slot: "fileList"
    },
  ];
};
export let columns5 = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "制度名称",
      dataIndex: "zdmc",
    }
  ];
};
export let columns6 = (
  lajw_ft_swgz_content,
  lajw_ft_swgz_spzt,
  lajw_ft_swgz_spjg
) => {
  return [
    {
      title: "处置结果",
      dataIndex: "result",
    },
    {
      title: "处置人数（人）",
      dataIndex: "number",
    }
  ];
};