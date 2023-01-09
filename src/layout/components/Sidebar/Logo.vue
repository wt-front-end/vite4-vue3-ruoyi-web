<template>
  <div
    class="sidebar-logo-container"
    :title="title"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground
    }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <!-- <h1
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? variables.logoTitleColor
                : variables.logoLightTitleColor
          }"
        >
          {{ title }}
        </h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <h1
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark'
                ? variables.logoTitleColor
                : variables.logoLightTitleColor
          }"
        >
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import variables from "@/assets/styles/variables.module.scss";
import logo from "@/assets/logo/logo.png";

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});

const title = ref("一网监督管理系统");
const store = useStore();
const sideTheme = computed(() => store.state.settings.sideTheme);
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    width: 100%;
    // height: 50px;
    // line-height: 50px;
    display: block;
    display: flex;
    justify-content: center;
    align-items: center;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      display: inline;
      vertical-align: middle;
      margin-top: 12px;
    }

    & .sidebar-title {
      vertical-align: middle;
      height: 29px;
      font-size: 24px;
      font-family: FZZhengHeiS-B-GB;
      font-weight: 400;
      color: #fff;
      line-height: 24px;
      margin: 21px 0 44px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
