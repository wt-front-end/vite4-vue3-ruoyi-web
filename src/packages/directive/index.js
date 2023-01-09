import auth from "./v-auth"; // 判断按钮级权限
import hasRole from "./v-hasRole"; // 判断路由级权限
import clickOut from "./v-clickOut";
export const directives = {
  auth,
  hasPermi: auth, //兼容之前
  clickOut,
  hasRole
};
