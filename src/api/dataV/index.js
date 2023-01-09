import request from "@/utils/request";

//查询协同执纪列表
export function getXtzjList(query) {
  return request({
    url: "/data/xtzj/list",
    method: "get",
    params: query
  });
}
// 新增协同执纪
export function getXtzjAdd(data) {
  return request({
    url: "/data/xtzj",
    method: "post",
    data: data
  });
}
// 修改协同执纪
export function getXtzjEdit(data) {
  return request({
    url: "/data/xtzj",
    method: "put",
    data: data
  });
}
// 删除协同执纪
export function getXtzjDelete(id) {
  return request({
    url: "/data/xtzj/" + id,
    method: "delete"
  });
}
// 查询新冠疫情防控(守小门)列表
export function getXgyqfkList() {
  return request({
    url: "/data/xgyqfk/list",
    method: "get"
  });
}
// 修改新冠疫情防控(守小门)列表
export function getXgyqfkEdit(data) {
  return request({
    url: "/data/xgyqfk",
    method: "put",
    data: data
  });
}
// 修改大屏首页统计
export function getDpsytjEdit(data) {
  return request({
    url: "/data/dpsytj",
    method: "put",
    data: data
  });
}
// 列表大屏首页统计
export function getDpsytjList(params) {
  return request({
    url: "/data/dpsytj/list",
    method: "get",
    params: params
  });
}
// 查询村级小微权力监督统计图+统计表
export function getCjxwqljdList() {
  return request({
    url: "/data/cjxwqljd/list",
    method: "get"
  });
}
//修改村级小微权力监督统计图+统计表
export function getCjxwqljdEdit(data) {
  return request({
    url: "/data/cjxwqljd",
    method: "put",
    data: data
  });
}
// 列表-跨域执法权力监督-统计图
export function getKyzfqljdtjtList() {
  return request({
    url: "/data/kyzfqljdtjt/list",
    method: "get"
  });
}
// 修改-跨域执法权力监督-统计图
export function getKyzfqljdtjtEdit(data) {
  return request({
    url: "/data/kyzfqljdtjt",
    method: "put",
    data: data
  });
}
// 列表-跨域执法权力监督-统计表
export function getKyzfqljdtjbList(query) {
  return request({
    url: "/data/kyzfqljdtjb/list",
    method: "get",
    params: query
  });
}
// 修改-跨域执法权力监督-统计表
export function getKyzfqljdtjbEdit(data) {
  return request({
    url: "/data/kyzfqljdtjb",
    method: "put",
    data: data
  });
}
// 新增
export function getKyzfqljdtjbAdd(data) {
  return request({
    url: "/data/kyzfqljdtjb",
    method: "post",
    data: data
  });
}
// 删除
export function getKyzfqljdtjbDelete(id) {
  return request({
    url: "/data/kyzfqljdtjb/" + id,
    method: "delete"
  });
}
// 查询监督效应列表
export function getJdxyList() {
  return request({
    url: "/data/jdxy/list",
    method: "get"
  });
}
// 修改-监督效应
export function getJdxyEdit(data) {
  return request({
    url: "/data/jdxy",
    method: "put",
    data: data
  });
}
// 1协同监督、2毗邻监督、3项目监督、4嵌入监督、5群众监督
