<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <el-menu default-active="0"  class="main-menu" router>
          <el-menu-item index="ncnn">
            <el-icon>
              <Cellphone />
            </el-icon>
            <template #title>ncnn</template>
          </el-menu-item>
          <el-menu-item index="ocr">
            <el-icon>
              <View />
            </el-icon>
            <template #title>OCR</template>
          </el-menu-item>
          <el-menu-item index="search">
            <el-icon>
              <Search />
            </el-icon>
            <template #title>BaiduBce</template>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>Settings</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view v-slot="{Component}">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
        <el-footer align="center">
          <span style="font-size: small">@ 2022 alchemaniaC All Rights Reserved Version 0.3 beta</span>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {
  Search,
  Setting,
  View,
  Cellphone
} from "@element-plus/icons-vue";

// import { ref, reactive, toRefs } from "vue";
//
// const state = reactive({
//   rootSubmenuKeys: ["3"],
//   openKeys: [],
//   selectedKeys: []
// });
// const nowIndex = ref("ncnn");


</script>

<style scoped>
.el-aside {
  width: 200px;
  height: 100%;
}

.main-menu {
  height: 100vh;
}
</style>
