import request from "@/utils/request";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: "/login",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  });
}

// 专用钉钉扫码登录
export function ddLogin(data) {
  return request({
    url: "/dd/scan",
    headers: {
      isToken: false
    },
    method: "post",
    data
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get"
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    headers: {
      isToken: false
    },
    method: "get",
    timeout: 20000
  });
}
// 登录获取手机号(加密)
export function getPhoneInfo(params) {
  return request.get("/getPhoneByUserName", { params });
}
// 登录短信验证码
export function getMessageCodeApi(params) {
  return request.get("/getMessageCode", { params });
}
