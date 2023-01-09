<template>
  <el-card>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="出国境类预警" name="cgjyj">
        <Cgjyj />
      </el-tab-pane>
      <!-- <el-tab-pane
        v-if="proxy.$auth.hasPermi('data:result:rylyj')"
        label="研判依据提示"
        name="rylyj"
      >
        <Rylyj />
      </el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>

<script setup>
import Cgjyj from "./components/Cgjyj.vue";
// import Rylyj from "./components/Rylyj.vue";
const { proxy } = getCurrentInstance();
const activeName = ref("cgjyj");
</script>
