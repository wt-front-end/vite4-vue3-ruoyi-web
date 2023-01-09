<template>
  <div class="login">
    <div class="el-login-title">
      <span>一网监督管理系统</span>
    </div>

    <img
      src="@/assets/images/login.png"
      class="w-full select-none user-drag"
      alt="bg"
    />

    <el-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div
        @click="isLoginTypeDgWork = !isLoginTypeDgWork"
        class="switch-login-type-btn"
      >
        <img
          v-show="isLoginTypeDgWork"
          src="data:image/png;base64,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"
          alt="pc"
        />
        <img
          v-show="!isLoginTypeDgWork"
          src="data:image/png;base64,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"
          alt="dg-work"
        />
      </div>

      <loginDgWork v-if="isLoginTypeDgWork" @onMessage="onMessage" />

      <div v-else>
        <div class="login-form-title">账号登录</div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            size="default"
            style="overflow: hidden"
            auto-complete="off"
            placeholder="请输入账号"
          >
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            size="default"
            style="overflow: hidden"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="phone">
            <el-input
              v-model="loginForm.phone"
              type="text"
              auto-complete="off"
              size="default"
              style="overflow: hidden"
              disabled
              placeholder="手机号(输入账号自动获取,无需填写)"
            >
            </el-input>
          </el-form-item> -->
        <el-form-item prop="code" v-if="captchaOnOff">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
            size="default"
            style="width: 100%; overflow: hidden"
            @keyup.enter="handleLogin"
            class="item-code"
          >
            <template #append>
              <!-- <div class="cursor-pointer" @click="handleVerify">
                  {{ (!smsSendBtn && "获取验证码") || time + " s" }}
                </div> -->
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px"
          >记住密码</el-checkbox
        > -->
        <el-form-item style="width: 100%; margin-top: 40px">
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%"
            size="large"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </el-button>
          <!-- <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div> -->
        </el-form-item>
      </div>
    </el-form>
    <!-- <wt-verify v-model="needVerify" @success="getCaptcha"> </wt-verify> -->
    <!--  底部  -->
    <div class="el-login-footer">
      <p>建议使用1920*1080分辨率浏览器</p>
      <p>
        <span>版权所有：嘉善县政府</span>
        <span class="ml-5">技术支持：浙江华通云数据科技有限公司</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg, getPhoneInfo, getMessageCodeApi } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { ElMessage, ElNotification } from "element-plus";
import loginDgWork from "./login-dg-work";

const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();

const isLoginTypeDgWork = ref(true);
function onMessage({ data }) {
  store
    .dispatch("DdLogin", data.code)
    .then(() => {
      router.push({ path: redirect.value || "/" });
    })
    .catch(() => {
      router.push({ path: "/401" });
    });
}

const loginForm = ref({
  username: "",
  password: "",
  phone: "",
  // rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
// const register = ref(false);
const redirect = ref(undefined);

// 获取加密的手机号
// function getPhone(value) {
//   getPhoneInfo({ userName: value }).then(res => {
//     if (res.code == 200) {
//       loginForm.value.phone = res.msg;
//     }
//   });
// }
// function getPhoneEnter(e) {
//   getPhone(e.target.value);
// }

// let time = ref(60);
// let smsSendBtn = ref(false);
// 获取短信验证码
// function getCaptcha() {
//   if (loginForm.value.phone && loginForm.value.username) {
//     smsSendBtn.value = true;
//     const interval = window.setInterval(() => {
//       if (time.value-- <= 0) {
//         time.value = 60;
//         smsSendBtn.value = false;
//         window.clearInterval(interval);
//       }
//     }, 1000);

//     ElMessage("验证码发送中..");
//     getMessageCodeApi({ userName: loginForm.value.username })
//       .then(res => {
//         ElNotification({
//           title: "提示",
//           message: "验证码获取成功，请检查你的手机",
//           type: "success"
//         });
//       })
//       .catch(err => {
//         clearInterval(interval);
//         time.value = 60;
//         smsSendBtn.value = false;
//       });
//   } else {
//     ElMessage("请检查用户名和手机号是否正确");
//   }
// }

// let needVerify = ref(false);
// 二次验证
// function handleVerify() {
//   if (smsSendBtn.value) {
//     ElMessage("请等待倒计时结束");
//   } else {
//     if (loginForm.value.phone && loginForm.value.username) {
//       needVerify.value = true;
//     } else {
//       ElMessage("请检查用户名和手机号是否正确");
//     }
//   }
// }

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
      // if (loginForm.value.rememberMe) {
      //   Cookies.set("username", loginForm.value.username, { expires: 30 });
      //   Cookies.set("password", encrypt(loginForm.value.password), {
      //     expires: 30
      //   });
      //   Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      // } else {
      //   // 否则移除
      //   Cookies.remove("username");
      //   Cookies.remove("password");
      //   Cookies.remove("rememberMe");
      // }
      // 调用action的登录方法
      store
        .dispatch("Login", loginForm.value)
        .then(() => {
          router.push({ path: redirect.value || "/" });
        })
        .catch(() => {
          loading.value = false;
          // 重新获取验证码
          if (captchaOnOff.value) {
            getCode();
          }
        });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaOnOff.value =
      res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  // const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    phone: ""
    // rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
  // username && getPhone(username);
}

getCode();
getCookie();
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;

  .el-login-title {
    width: 100%;
    letter-spacing: 1px;
    font-size: 42px;
    font-family: FZZhengHeiS-B-GB;
    font-weight: 400;
    color: #000000;
    line-height: 42px;
    padding: 12px 0 12px 106px;
  }

  .user-drag {
    -webkit-user-drag: none;
  }

  .login-form {
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translate3d(100%, 0, 0);
    width: 400px;
    height: 420px;
    background: #ffffff;
    box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.16);
    border-radius: 20px 20px 20px 20px;

    .login-form-title {
      text-align: center;
      margin: 0 0 30px;
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      letter-spacing: 1px;
    }

    .switch-login-type-btn {
      position: absolute;
      top: 0;
      right: 0;
      img {
        width: 76px;
        height: 76px;
        cursor: pointer;
      }
    }
    .el-form-item {
      margin: 0 0 20px 0;
      :deep(.el-input__inner) {
        width: 160px;
        height: 40px;
        font-size: 12px;
        letter-spacing: 1px;
      }
      .el-button--large {
        font-size: 12px;
        background: #368cf4;
        letter-spacing: 1px;
      }
    }

    .item-code {
      :deep(.el-input-group__append) {
        padding: 0;

        .login-tip {
          font-size: 13px;
          text-align: center;
          color: #bfbfbf;
        }

        .login-code {
          height: 40px;

          img {
            height: 40px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .el-login-footer {
    width: 100%;
    margin: 12px 0;
    p {
      text-align: center;
      margin: 0;
      line-height: 24px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
}
</style>
