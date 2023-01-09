import request from "@/utils/request";
// 纳管列表
export function getNanotubesList(query) {
  return request({
    url: "/jwFtPerson/page",
    method: "get",
    params: query
  });
}

// 归属人详情
// export function getPersonList(query,id) {
//     return request({
//         url: '/jwFtCertificate/person/' + id,
//         method: 'get',
//         params: query
//     })
// }
// 纳管人员新增
export function postNanotubesAdd(data) {
  return request({
    url: "/jwFtPerson",
    method: "post",
    data: data
  });
}
// 纳管人员编辑
export function postNanotubesEdit(data) {
  return request({
    url: "/jwFtPerson",
    method: "put",
    data: data
  });
}
// 纳管人员-详情
export function getPersonDetailList(query, id) {
  return request({
    url: "/jwFtPerson/detail/" + id,
    method: "get",
    params: query
  });
}
// 纳管人员删除
export function postNanotubesDelete(query, id) {
  return request({
    url: "/jwFtPerson/" + id,
    method: "delete",
    params: query
  });
}

// 人员导入模板
export const downloadTemplateQg = "download/纳管人员导入模板_区管.xlsx";
export const downloadTemplateFqg = "download/纳管人员导入模板_非区管.xlsx";
