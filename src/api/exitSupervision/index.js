import request from "@/utils/request";
// 退出监察范围-列表
export function listExitSupervision(data) {
  return request({
    url: "/out/list",
    method: "get",
    params: data
  });
}
// 详情
export function getDetailInfo(data) {
  return request({
    url: "/out/detail",
    method: "get",
    params: data
  });
}
// 查询人员
export function getSelectPenson(data) {
  return request({
    url: "/out/selectPenson",
    method: "get",
    params: data
  });
}
//暂存人员
export function postDraft(data) {
  return request({
    url: "/out/draft",
    method: "post",
    data: data
  });
}
//提交人员
export function postAdd(data) {
  return request({
    url: "/out/add",
    method: "post",
    data: data
  });
}
//查询退还证照
export function getListBackCert(data) {
  return request({
    url: "/out/listBackCert",
    method: "get",
    params: data
  });
}
// 退还证照
export function getBackCert(query) {
  return request({
    url: "/out/backCert",
    method: "get",
    params: query
  });
}
// 撤销
export function postDel(data) {
  return request({
    url: "/out/del",
    method: "post",
    params: data
  });
}
// 审批申请
export function postApply(data) {
  return request({
    url: "/out/apply",
    method: "post",
    data: data
  });
}
// 导出解除失败人员
export function getExportErrorPerson(data) {
  return request({
    url: `/out/exportErrorPerson`,
    method: "get",
    params: data
  });
}
// 导出全部人员
export function getExportAllPerson(data) {
  return request({
    url: `/out/exportPerson`,
    method: "get",
    params: data
  });
}
// 导出模板-撤销备案表
export function postExportTempFile(data) {
  return request({
    url: `/out/exportTempFile`,
    method: "post",
    data: data
  });
}
