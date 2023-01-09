<template>
  <section class="app-main">
    <div>
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </div>
  </section>
</template>

<script setup>
let store = useStore();
const route = useRoute();
store.dispatch("tagsView/addCachedView", route);
const cachedViews = computed(() => {
  return store.state.tagsView.cachedViews;
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 70 = navbar  70  */
  min-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  overflow: hidden;
  & > div {
    background: #fff;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    margin: 0 24px;
  }
}

.fixed-header + .app-main {
  padding-top: 80px;
}

.hasTagsView {
  .app-main {
    /* 138 = navbar + tags-view = 70 + 68 */
    min-height: calc(100vh - 138px);
  }

  .fixed-header + .app-main {
    padding-top: 138px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
