import request from "@/utils/request";

// 表头列表
export const getCustomTree = params => {
  return request({
    url: "data/diyStatis/list",
    params,
    method: "get"
  });
};
export function getCustomStatis(data) {
  return request({
    url: "data/diyStatis/getDiyResult",
    method: "post",
    data: data
  });
}
export function postCustomStatisExport(data) {
  return request({
    url: "data/diyStatis/export",
    method: "post",
    responseType: "blob",
    data: data
  });
}
