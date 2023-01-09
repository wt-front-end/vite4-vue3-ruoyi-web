import request from "@/utils/request";

export const getMattersList = params => {
  return request({
    url: "jwFtNotarization/page",
    params,
    method: "get"
  });
};
export const addMatters = params => {
  return request({
    url: "jwFtNotarization",
    data: params,
    method: "post"
  });
};
export const searchMattersPerson = params => {
  return request({
    url: "jwFtPerson/getPerson",
    data: params,
    method: "post"
  });
};
export const delFeedback = id => {
  return request({
    url: `jwFtNotarization/${id}`,
    method: "delete"
  });
};
export const getMattersDetail = id => {
  return request({
    url: `jwFtNotarization/${id}`,
    method: "get"
  });
};
