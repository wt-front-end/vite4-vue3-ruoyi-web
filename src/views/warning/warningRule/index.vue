<template>
  <el-card>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="出国境类预警" name="cgjyj">
        <Cgjyj />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import Cgjyj from "./components/Cgjyj.vue";
const activeName = ref("cgjyj");
</script>

<style lang="scss" scoped></style>
