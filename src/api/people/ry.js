import request from "@/utils/request";

// 查询出国（境）审批 - 人员管理列表
export function listRyFt(query) {
  return request({
    url: "/data/ft/ry/list",
    method: "get",
    params: query
  });
}

// 查询出国（境）审批 - 人员管理详细
export function getRyFt(id) {
  return request({
    url: "/data/ft/ry/" + id,
    method: "get"
  });
}

// 新增出国（境）审批 - 人员管理
export function addRyFt(data) {
  return request({
    url: "/data/ft/ry",
    method: "post",
    data: data
  });
}

// 修改出国（境）审批 - 人员管理
export function updateRyFt(data) {
  return request({
    url: "/data/ft/ry",
    method: "put",
    data: data
  });
}

// 删除出国（境）审批 - 人员管理
export function delRyFt(id) {
  return request({
    url: "/data/ft/ry/" + id,
    method: "delete"
  });
}

// 导出出国（境）审批 - 人员管理
export function exportRyFt(query) {
  return request({
    url: "/data/ft/ry/export",
    method: "get",
    params: query
  });
}

// 导入 - 人员管理
export function importDataRyFt(data) {
  return request({
    url: "/data/ft/ry/importData",
    method: "post",
    params: data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    contentType: "multipart/form-data"
  });
}
// 下载模板 - 人员管理
export function importTemplateRyFt(query) {
  return request({
    url: "/data/ft/ry/importTemplate",
    method: "get",
    params: query
  });
}

// 查询出国（境）审批 - 人员备案列表
export function listRyba(query) {
  return request({
    url: "/act/ryba/list",
    method: "get",
    params: query
  });
}

// 人员备案-申请
export function applyActRyba(data) {
  return request({
    url: "/act/ryba/apply",
    method: "post",
    data: data
  });
}

// 查询出国（境）审批 - 人员备案详细
export function getRyba(id) {
  return request({
    url: "/act/ryba/" + id,
    method: "get"
  });
}

// 新增出国（境）审批 - 人员备案
export function addRyba(data) {
  return request({
    url: "/act/ryba",
    method: "post",
    data: data
  });
}

// 修改出国（境）审批 - 人员备案
export function updateRyba(data) {
  return request({
    url: "/act/ryba",
    method: "put",
    data: data
  });
}

// 删除出国（境）审批 - 人员备案
export function delRyba(id) {
  return request({
    url: "/act/ryba/" + id,
    method: "delete"
  });
}

// 导出出国（境）审批 - 人员备案
export function exportRyba(query) {
  return request({
    url: "/act/ryba/export",
    method: "get",
    params: query
  });
}

// 待我处理 - 人员备案申请流程
export function waitRybaAct(query) {
  return request({
    url: "/act/ryba/wait",
    method: "get",
    params: query
  });
}
// 我发起的 - 人员备案申请流程
export function startRybaAct(query) {
  return request({
    url: "/act/ryba/start",
    method: "get",
    params: query
  });
}
// 我处理的 - 人员备案申请流程
export function dealRybaAct(query) {
  return request({
    url: "/act/ryba/deal",
    method: "get",
    params: query
  });
}
// 全部 - 人员备案申请流程
export function allListRybaAct(query) {
  return request({
    url: "/act/ryba/allList",
    method: "get",
    params: query
  });
}
// 审批 - 人员备案申请流程
export function auditRybaAct(data, id) {
  return request({
    url: "/act/ryba/audit/" + id,
    method: "post",
    data: data
  });
}
// 签章
export function getSealPicSign(query) {
  return request({
    url: "/seal-sign/get-seal-pic",
    method: "get",
    params: query,
    hideLoading: true
  });
}
// 下载
export function getPdfSign(id) {
  return request({
    url: "/act/ryba/getPdfSign/" + id,
    method: "get"
  });
}
