import request from "@/utils/request";

// 查询单位列表
export function getUnitList(query) {
  return request({
    url: "/jwUnitRelation/getDeptInfo",
    method: "get",
    params: query
  });
}
// 获取未勾选监督单位
export function getJddw() {
  return request({
    url: "system/dept/getJddw",
    method: "get"
  });
}
// 修改部门关联关系
export function editDept(data) {
  return request({
    url: "/jwUnitRelation/editDept",
    method: "post",
    data: data
  });
}
