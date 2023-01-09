<template>
  <div>
    <div class="i-ic-baseline-ac-unit"></div>
    <el-tabs v-model="currentTab" @change="handleTabChange">
      <el-tab-pane v-for="v in icons" :key="v.key" :name="v.key" :label="v.title">
        <ul>
          <li
            v-for="(icon, key) in v.icons"
            :key="`${v.key}-${key}`"
            :class="{ active: selectedIcon == icon }"
            @click="handleSelectedIcon(icon)"
          >
            <div :class="icon" w-5 h-5 />
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import icons from './icons'
export default defineComponent({
  name: 'IconSelector',
  emits: ['selected'],
  props: {
    value: {
      type: String,
    },
  },
  setup(prop, context) {
    const data = reactive({
      currentTab: 'directional',
      selectedIcon: prop.value || undefined,
    })
    const methods = {
      handleTabChange(activeKey) {
        data.currentTab = activeKey
      },
      handleSelectedIcon(icon) {
        data.selectedIcon = icon
        context.emit('selected', icon)
      },
      autoSwitchTab() {
        icons.some(
          (item) => item.icons.some((icon) => icon === prop.value) && (data.currentTab = item.key)
        )
      },
    }
    watch(
      () => {
        return prop.value
      },
      (value) => {
        data.selectedIcon = value
        methods.autoSwitchTab()
      }
    )
    onMounted(() => {
      if (prop.value) {
        methods.autoSwitchTab()
      }
    })
    return {
      icons,
      ...toRefs(data),
      ...methods,
    }
  },
})
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  height: 250px;

  li {
    display: inline-block;
    padding: 12px;
    margin: 3px 0;
    border-radius: 2px;

    &:hover,
    &.active {
      cursor: pointer;
      color: #fff;
      background-color: #368cf4;
    }
  }
}
</style>
