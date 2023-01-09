import router from "./router";
import store from "./store";
import { ElMessage, ElMessageBox } from "element-plus";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
import { isHttp } from "@/utils/validate";
NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/main",
  "/auth-redirect",
  "/bind",
  "/register",
  "/401"
];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    to.meta.title && store.dispatch("settings/setTitle", to.meta.title);
    /* has token*/
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch("GetInfo")
          .then(res => {
            store.dispatch("GenerateRoutes").then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              accessRoutes.forEach(route => {
                if (!isHttp(route.path)) {
                  router.addRoute(route); // 动态添加可访问路由表
                }
              });
              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
            });
            // 判断密码是否太长时间没修改
            if (res.user.isUpdatePassword == 1) {
              ElMessageBox.alert(
                "您的密码已经很久没更新了,请及时更新密码(更新密码后需要重新登录)",
                "更新密码",
                {
                  confirmButtonText: "确定"
                  // cancelButtonText: "取消",
                  // closeOnClickModal: false,
                  // inputPattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,20}$/,
                  // inputErrorMessage: "用户密码须大写字母，小写字母，数字，特殊符号(长度8和20之间)"
                }
              ).then(action => {
                if (action == "confirm") {
                  router.push({
                    path: "/user/profile",
                    query: { tab: "resetPwd" }
                  });
                }
              });
            }
          })
          .catch(err => {
            store.dispatch("LogOut").then(() => {
              ElMessage.error(err);
              next({ path: "/" });
            });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path.split("/", 2).join("/")) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
