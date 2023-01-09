import request from "@/utils/request";
// 证照列表
export function getLicenseList(query) {
  return request({
    url: "/jwFtCertificate/page",
    method: "get",
    params: query
  });
}

// 归属人详情
export function getPersonList(query, id) {
  return request({
    url: "/jwFtCertificate/person/" + id,
    method: "get",
    params: query
  });
}
// 证照保存
export function postLicenseSave(data) {
  return request({
    url: "/jwFtCertificate",
    method: "post",
    data: data
  });
}
// 证照删除
export function deleteLicense(query, id) {
  return request({
    url: "/jwFtCertificate/" + id,
    method: "delete",
    params: query
  });
}
// 证照领取
export function receiveLicense(id) {
  return request({
    url: "/jwFtCertificate/receive/" + id,
    method: "put"
  });
}

// 证照导入模板
export const downloadTemplate = "download/证照管理导入模板.xlsx";
