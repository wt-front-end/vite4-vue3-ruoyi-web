import request from "@/utils/request";
// 换岗-我发起的列表
export function listHgMystart(data) {
  return request({
    url: "/jwFtRelieveGuard/mystart",
    method: "post",
    data: data
  });
}
// 换岗-待我处理
export function listHgWaitForMy(data) {
  return request({
    url: "/jwFtRelieveGuard/waitForMy",
    method: "post",
    data: data
  });
}
// 换岗-我已处理
export function listHgMyHandle(data) {
  return request({
    url: "/jwFtRelieveGuard/myHandle",
    method: "post",
    data: data
  });
}
// 根据id获取人员换岗详情
export function getLicenseDetailById(query) {
  return request({
    url: "/jwFtRelieveGuard/selectRelieveGuardById",
    method: "get",
    params: query
  });
}
// 根据换岗id获取人员换岗证照
export function getLicenseById(query) {
  return request({
    url: "/jwFtRelieveGuard/selectRelieveCertificateById",
    method: "get",
    params: query
  });
}
// 发起人员换岗申请
export function postChangeAdd(data) {
  return request({
    url: "/jwFtRelieveGuard/add",
    method: "post",
    data: data
  });
}
// 非区管干部审批
export function postApprovalUn(data) {
  return request({
    url: "/jwFtRelieveGuard/approvalUn",
    method: "post",
    data: data
  });
}
// 撤销
export function postCallBackProcess(data) {
  return request({
    url: "/jwFtRelieveGuard/callBackProcess",
    method: "post",
    params: data
  });
}
// 重新发起人员换岗申请
export function postChangeReissue(data, query) {
  return request({
    url: "/jwFtRelieveGuard/reissue/",
    method: "post",
    params: query,
    data: data
  });
}
// 证照入库
export function updateRelieveGuard(data) {
  return request({
    url: "/jwFtRelieveGuard/updateRelieveGuard",
    method: "post",
    data: data
  });
}
// 换岗-所有列表
export function listHgSelectAll(data) {
  return request({
    url: "/jwFtRelieveGuard/selectAll",
    method: "post",
    data: data
  });
}
