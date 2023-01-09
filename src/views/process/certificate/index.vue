<template>
  <div style="padding: 15px 20px 20px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待我处理" name="dwcl"></el-tab-pane>
      <el-tab-pane label="我发起的" name="wfqd"></el-tab-pane>
      <el-tab-pane label="我已处理" name="wycl"></el-tab-pane>
      <el-tab-pane label="全部信息" name="qbxx"></el-tab-pane>
      <Form :activeName="activeName" />
    </el-tabs>
  </div>
</template>

<script setup>
import Form from "./form.vue";
import { queryParams2FormData } from "@/utils/ruoyi";
const activeName = ref("dwcl");
// 待办页面入口 自动条件过滤
activeName.value = queryParams2FormData("activeName").activeName || "dwcl";
</script>
