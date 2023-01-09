import request from "@/utils/request";

export function listReport(data) {
  return request({
    url: "ryba/apply/list",
    method: "get",
    params: data
  });
}

export function addMemberReport(query) {
  return request({
    url: "/ryba/apply/add",
    method: "post",
    data: query
  });
}
export function addContinueReport(id) {
  return request({
    url: `/ryba/infos/continue/${id}`,
    method: "get"
  });
}

export function delMemberReport(id, personId) {
  return request({
    url: `/ryba/person/remove/${id}/${personId}`,
    method: "delete"
  });
}
export function getMemberDetail(id) {
  return request({
    url: `/ryba/detail/infos/${id}`,
    method: "get"
  });
}
export function getNotBaList(params) {
  return request({
    url: `/ryba/person/list`,
    method: "get",
    params
  });
}
export function backMemberList(applyId) {
  return request({
    url: `/ryba/apply/revoke/${applyId}`,
    method: "delete"
  });
}
export function getFeedBackList(id) {
  return request({
    url: `/ryba/feedback/list/${id}`,
    method: "get"
  });
}
export function addFeedback(id, params) {
  return request({
    url: `/ryba/feedback/add/${id}`,
    method: "post",
    data: params
  });
}
export function exportReportPerson(result, applyId) {
  return request({
    url: `/ryba/person/export/${result}/${applyId}`,
    method: "get"
  });
}
export function downTable(name) {
  return request({
    url: `/ryba/badjb/filedown`,
    method: "get",
    params: {
      fileName: name
    }
  });
}
export const downdFile = params => {
  return request({
    url: "ryba/badjb/export",
    method: "post",
    data: params
  });
};
