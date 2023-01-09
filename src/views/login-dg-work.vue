<!--专有钉钉扫码登录-->
<template>
  <iframe
    width="340px"
    height="330px"
    border="0"
    style="margin-top: 30px"
    :src="src"
  />
</template>

<script setup>
const emit = defineEmits(["onMessage"]);
// 应用标识
const client_id = "jsjw_ywtjd_dingoa";
// 回调地址
// const redirect_uri = "http://localhost:3333";
const redirect_uri = "http://localhost:31135";
// 开放平台域名 浙政钉/Saas
const domain_name =
  import.meta.env.VITE_APP_ENV !== "production"
    ? "login.dg-work.cn"
    : "login-pro.ding.zj.gov.cn";
const src = `https://${domain_name}/oauth2/auth.htm?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=get_user_info&authType=QRCODE&embedMode=true`;

window.addEventListener("message", function (event) {
  if (event.data?.code) {
    emit("onMessage", event);
  }
});
</script>
