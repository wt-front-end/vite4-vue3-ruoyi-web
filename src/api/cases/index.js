/*
 * @Author: xkloveme
 * @Date: 2022-04-14 15:09:03
 * @LastEditTime: 2022-11-07 15:08:11
 * @LastEditors: xkloveme
 * @Description: 典型案例
 * @FilePath: /js-web/src/api/cases/index.js
 * @Copyright © xkloveme
 */
import request from "@/utils/request";

// 全部列表
export function casesListApi(query) {
  return request({
    url: "/data/case/list",
    method: "get",
    params: query
  });
}

// 案例新增
export function casesAddApi(data) {
  return request({
    url: "/data/case",
    method: "post",
    data: data
  });
}
// 案例修改
export function casesPutApi(data) {
  return request({
    url: "/data/case",
    method: "put",
    data: data
  });
}

// 案例查询详情
export function casesDetailApi(query) {
  return request({
    url: `/data/case/${query.id}`,
    method: "get",
    params: query
  });
}
// 案例查询删除
export function casesDeleteApi(query) {
  return request({
    url: `/data/case/${query.id}`,
    method: "delete",
    params: query
  });
}
