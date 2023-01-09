/*
 * @Author: xkloveme
 * @Date: 2022-04-14 15:09:03
 * @LastEditTime: 2022-11-07 17:59:21
 * @LastEditors: xkloveme
 * @Description: 点位管理
 * @FilePath: /js-web/src/api/points/index.js
 * @Copyright © xkloveme
 */
import request from "@/utils/request";


// 全部列表
export function pointsListApi(query) {
  return request({
    url: "/data/map/list",
    method: "get",
    params: query
  });
}

// 点位新增
export function pointsAddApi(data) {
  return request({
    url: "/data/map",
    method: "post",
    data: data
  });
}
// 点位修改
export function pointsPutApi(data) {
  return request({
    url: "/data/map",
    method: "put",
    data: data
  });
}

// 点位查询详情
export function pointDetailApi(query) {
  return request({
    url: `/data/map/${query.id}`,
    method: "get",
    params: query
  });
}
// 点位查询删除
export function pointDeleteApi(query) {
  return request({
    url: `/data/map/${query.id}`,
    method: "delete",
    params: query
  });
}


// 项目监督
// 新增
export function postPmdProjectAdd(data) {
  return request({
    url: `/data/project`,
    method: "post",
    data: data
  });
}
// 修改
export function putPmdProjectEdit(data) {
  return request({
    url: "/data/project",
    method: "put",
    data: data
  });
}
// 详情
export function getPmdProjectDetail(query) {
  return request({
    url: `/data/project/${query.projectId}`,
    method: "get",
    params: query
  });
}
// 删除
export function deletePmdProjectDetail(query) {
  return request({
    url: `/data/project/${query.projectId}`,
    method: "delete",
  });
}
// 删除子项目
export function deletePmdProjectdeleteChild(childId) {
  return request({
    url: `/data/project/deleteChild/${childId}`,
    method: "delete",
  });
}
// 上传监督检查
export function postPmdProjectAddInfo(data) {
  return request({
    url: `/data/project/addInfo`,
    method: "post",
    data: data
  });
}
// 上传整改情况
export function postPmdProjectAddRectify(data) {
  return request({
    url: `/data/project/addRectify`,
    method: "post",
    data: data
  });
}
// 删除监督检查
export function deleteInfoPmdProject(query) {
  return request({
    url: `/data/project/deleteInfo`,
    method: "delete",
    params: query
  });
}
// 修改监督检查
export function postPmdProjectEditInfo(data) {
  return request({
    url: `/data/project/editInfo`,
    method: "post",
    data: data
  });
}
// 查询
export function getPmdProjectList(query) {
  return request({
    url: `/data/project/list`,
    method: "get",
    params: query
  });
}

// 根据项目监督id获取监督检查列表
export function getProjectListInfoByProjectId(query) {
  return request({
    url: `/data/project/listInfoByProjectId`,
    method: "get",
    params: query
  });
}
// 根据项目监督id获取问题整改列表
export function getProjectListProblemByProjectId(query) {
  return request({
    url: `/data/project/listProblemByProjectId`,
    method: "get",
    params: query
  });
}
// 问题列表
export function getProjectListProblemProblemList(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/problemList`,
    method: "get",
    params: query
  });
}
// 参与确认
export function getCollaborativeSupervisionInfoConfirmParticipateIn(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/confirmParticipateIn`,
    method: "get",
    params: query
  });
}
// 协同监督列表查询
export function getCollaborativeSupervisionInfoList(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/list`,
    method: "get",
    params: query
  });
}
// 新增协同监督信息
export function postCollaborativeSupervisionInfo(data) {
  return request({
    url: `/data/collaborativeSupervisionInfo`,
    method: "post",
    data: data
  });
}
// 撤销协同监督
export function getCollaborativeSupervisionInfoCancel(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/cancel/${query.id}`,
    method: "get",
    params: query
  });
}
// 获取协同监督信息详细信息
export function getCollaborativeSupervisionInfo(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/${query.id}`,
    method: "get",
    params: query
  });
}
// 获取处置问题明细信息
export function getCollaborativeSupervisionProblemDetail(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/problemDetail/${query.problemId }`,
    method: "get",
    params: query
  });
}
// 处置
export function postCollaborativeSupervisionInfoFeedbackProblem(data) {
  return request({
    url: `/data/collaborativeSupervisionInfo/feedbackProblem`,
    method: "post",
    data: data
  });
}
// 上传检查结果
export function postCollaborativeSupervisionInfoAddCheckResult(data) {
  return request({
    url: `/data/collaborativeSupervisionInfo/addCheckResult`,
    method: "post",
    data: data
  });
}
// 获取检查结果详细信息
export function getCollaborativeSupervisionInfoCheckResultDetail(query) {
  return request({
    url: `/data/collaborativeSupervisionInfo/checkResultDetail`,
    method: "get",
    params: query
  });
}
export function getPmdCollaborativesupervisionItem(query) {
  return request({
    url: `/system/dict/data/type/supervision_item`,
    method: "get",
    params: query
  });
}