import request from "@/utils/request";

// 获取出国境列表信息
export const getWarningList = params => {
  return request({
    url: "jwFtLeaveCountry/selectList",
    params,
    method: "get"
  });
};
export const getWarningDetail = params => {
  return request({
    url: "jwFtLeaveCountry/waringInfo/",
    params,
    method: "get"
  });
};
export const getDownloadFile = params => {
  return request({
    url: "file/oss/getDownloadFile",
    params,
    method: "get"
  });
};
