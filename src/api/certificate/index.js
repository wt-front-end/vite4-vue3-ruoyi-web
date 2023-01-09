import request from "@/utils/request";
// 补办证-我发起的列表
export function listBbzMystart(data) {
  return request({
    url: "/jwBbz/mystart",
    method: "get",
    params: data
  });
}
// 待我处理
export function listBbzWaitForMy(data) {
  return request({
    url: "/jwBbz/waitForMy",
    method: "get",
    params: data
  });
}
// 我已处理
export function listBbzMyHandle(data) {
  return request({
    url: "/jwBbz/myHandle",
    method: "get",
    params: data
  });
}
// 补办证-发起办补证申请
export function listBbzAdd(data) {
  return request({
    url: "/jwBbz/add",
    method: "post",
    data: data
  });
}
// 补办证-详情
export function getBbzDetail(data) {
  return request({
    url: "/jwBbz/getInfo",
    method: "get",
    params: data
  });
}
// 核查证件信息
export function postBbzApproval(data) {
  return request({
    url: "/jwBbz/approval",
    method: "post",
    data: data
  });
}
// 确认制作完成
export function postBbzAffirm(data) {
  return request({
    url: "/jwBbz/affirm",
    method: "post",
    params: data
  });
}
// 证照入库
export function postBbzPutCertificates(data) {
  return request({
    url: "/jwBbz/putCertificates",
    method: "post",
    data: data
  });
}
// 撤销
export function postCallBackProcess(data) {
  return request({
    url: "/jwBbz/callBackProcess",
    method: "post",
    params: data
  });
}
// 重新发起
export function listBbzRetry(data) {
  return request({
    url: "/jwBbz/retry",
    method: "post",
    data: data
  });
}
// 查询全部办补证列表
export function listBbzSelectAll(data) {
  return request({
    url: "/jwBbz/selectAll",
    method: "get",
    params: data
  });
}
