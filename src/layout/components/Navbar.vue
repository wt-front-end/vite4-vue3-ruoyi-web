<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="getters.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="$store.state.settings.topNav"
    />

    <div class="right-menu flex-center">
      <template v-if="getters.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <size-select id="size-select" class="right-menu-item hover-effect" /> -->
      </template>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <div class="user-avatar">
              <el-avatar :src="getters.avatar" :size="35">
                {{ getters.user.nickName }}
              </el-avatar>
            </div>
            <div class="avatar-title">{{ getters.user.nickName }}</div>
            <el-icon>
              <caret-bottom />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
// import SizeSelect from "@/components/SizeSelect";
import HeaderSearch from "@/components/HeaderSearch";

const store = useStore();
const getters = computed(() => store.getters);
const { proxy } = getCurrentInstance();

function toggleSideBar() {
  store.dispatch("app/toggleSideBar");
}

const router = useRouter();
function closeAllTags() {
  proxy.$tab.closeAllPage().then(() => {
    router.replace({ path: "/index" });
  });
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      store.dispatch("LogOut").then(() => {
        closeAllTags();
        location.href = "/#/index";
      });
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  color: #000;
  background: #fff;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.08);

  .hamburger-container {
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
      height: 100%;
      font-size: 18px;
      color: #000;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 27px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        .avatar-title {
          white-space: nowrap;
          font-size: 14px;
          font-weight: 400;
          color: #636e75;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 100%;
          border: 3px solid #fff;
          margin: 0 5px 0 0;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 12px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
