<template>
  <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from "@/components/iFrame";

const url = ref("https://yupk.github.io/vue3-code-generator/");
</script>
