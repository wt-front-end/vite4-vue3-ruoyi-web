/*
 * @Author: xkloveme
 * @Date: 2022-04-14 15:09:03
 * @LastEditTime: 2022-11-07 15:07:13
 * @LastEditors: xkloveme
 * @Description: 典型动态
 * @FilePath: /js-web/src/api/action/index.js
 * @Copyright © xkloveme
 */
import request from "@/utils/request";

// 全部列表
export function actionListApi(query) {
  return request({
    url: "/data/action/list",
    method: "get",
    params: query
  });
}

// 动态新增
export function actionAddApi(data) {
  return request({
    url: "/data/action",
    method: "post",
    data: data
  });
}
// 动态修改
export function actionPutApi(data) {
  return request({
    url: "/data/action",
    method: "put",
    data: data
  });
}

// 动态查询详情
export function actionDetailApi(query) {
  return request({
    url: `/data/action/${query.id}`,
    method: "get",
    params: query
  });
}
// 动态查询删除
export function actionDeleteApi(query) {
  return request({
    url: `/data/action/${query.id}`,
    method: "delete",
    params: query
  });
}
