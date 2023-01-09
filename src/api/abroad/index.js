import request from "@/utils/request";

export const getAbroadWaitList = params => {
  return request({
    url: "jwFtLeaveCountry/waitForMy",
    params,
    method: "get"
  });
};
export const getUserInfo = params => {
  return request({
    url: "jwFtPerson/getPersonInfo",
    params,
    method: "get"
  });
};
export const addUserInfo = params => {
  return request({
    url: "jwFtLeaveCountry/add",
    data: params,
    method: "post"
  });
};

export const useLicense = params => {
  return request({
    url: "jwFtCertificate/getCertificateBySfzh",
    params
  });
};

// 新发起回显上次出国境信息
export const getPersonInfoData = params => {
  return request({
    url: "jwFtLeaveCountry/getPersonInfo",
    method: "get",
    params
  });
};

// 新发起回显工作简历信息
export const getPersonJianLi = params => {
  return request({
    url: "jwFtLeaveCountry/getJianLi",
    method: "get",
    params
  });
};

export const getAbroadDetail = id => {
  return request({
    url: "jwFtLeaveCountry/getInfo?id=" + id,
    method: "get"
  });
};

export const reviewAbroad = params => {
  return request({
    url: "jwFtLeaveCountry/approval",
    method: "post",
    data: params
  });
};

export const getCreateByme = params => {
  return request({
    url: "jwFtLeaveCountry/mystart",
    params
  });
};
export const getHasCreate = params => {
  return request({
    url: "jwFtLeaveCountry/myHandle",
    params
  });
};

export const receiveReport = (insid, params) => {
  return request({
    url: `jwFtLeaveCountry/getCertificates/${insid}`,
    method: "post",
    data: params
  });
};
export const backReportdema = insid => {
  return request({
    url: `jwFtLeaveCountry/putCertificates/${insid}`,
    method: "post"
  });
};

// 行程变更撤销
export const callBackProcess = parmas => {
  return request({
    url: "jwFtChangeTravel/callBackProcess",
    method: "post",
    data: parmas
  });
};

// 审批撤销
export const leavecallBackProcess = parmas => {
  return request({
    url: "jwFtLeaveCountry/callBackProcess",
    method: "post",
    data: parmas
  });
};

// 添加报备
export const reported = parmas => {
  return request({
    url: "jwFtReport/report",
    method: "post",
    data: parmas
  });
};
// 编辑出国境信息
export const editInfo = params => {
  return request({
    url: "jwFtLeaveCountry/editInfo",
    method: "post",
    data: params
  });
};
export const notReviewAbroad = params => {
  return request({
    url: "jwFtLeaveCountry/approvalUn",
    method: "post",
    data: params
  });
};
export const changesTrip = params => {
  return request({
    url: "jwFtChangeTravel/travelChange",
    method: "post",
    data: params
  });
};
export const getAllReports = id => {
  return request({
    url: "jwFtChangeTravel/getCertificate?id=" + id
  });
};
export const getAllCountry = name => {
  return request({
    url: "jwFtCountryGeography/getCountry",
    method: "get",
    params: { name }
  });
};
export const getCheckld = () => {
  return request({
    url: "system/user/getFgld",
    method: "get"
  });
};
export const getAllListByQg = params => {
  return request({
    url: "jwFtLeaveCountry/getAll",
    params,
    method: "get"
  });
};
export const getAllListByFQg = params => {
  return request({
    url: "jwFtLeaveCountry/getAllUn",
    params,
    method: "get"
  });
};
export const getMystartList = params => {
  return request({
    url: "jwFtChangeTravel/mystart",
    params,
    method: "get"
  });
};
export const getTripWaitList = params => {
  return request({
    url: "jwFtChangeTravel/waitForMy",
    params,
    method: "get"
  });
};
export const getAbroadHandleList = params => {
  return request({
    url: "jwFtChangeTravel/myHandle",
    method: "get",
    params
  });
};
export const getSpd = params => {
  return request({
    url: "jwFtLeaveCountry/getSpd",
    params,
    method: "get"
  });
};
export const FchangesTrip = params => {
  return request({
    url: "jwFtChangeTravel/add",
    method: "post",
    data: params
  });
};
export const Fchanges = params => {
  return request({
    url: "jwFtChangeTravel/approval",
    method: "post",
    data: params
  });
};
// 专管员修改变更信息
export const TravelEditInfo = params => {
  return request({
    url: "jwFtChangeTravel/editInfo",
    method: "post",
    data: params
  });
};
export const TripDetail = id => {
  return request({
    url: "jwFtChangeTravel/getinfoDetails?id=" + id,
    method: "get"
  });
};
export const getCertificate = id => {
  return request({
    url: "jwFtChangeTravel/getChangeCertificate?id=" + id,
    method: "get"
  });
};
export const changeCertificates = id => {
  return request({
    url: `jwFtChangeTravel/changeCertificates/${id}`,
    method: "post"
  });
};
export const listDept = type => {
  return request({
    url: `system/dept/getDeptByType?type=` + type,
    method: "get"
  });
};
export const getAllTrips = params => {
  return request({
    url: `jwFtChangeTravel/getAll`,
    method: "get",
    params
  });
};
export const qgAbbrove = parmas => {
  return request({
    url: "jwFtLeaveCountry/deptApproval",
    method: "post",
    data: parmas
  });
};
// 联审审批单 - 下载模板
export const downloadFqgTemplate =
  "download/国家工作人员因私出国（境）联审审批表.doc";
export const downloadQgTemplate =
  "download/领导干部因私出国（境）联审审批表.doc";
