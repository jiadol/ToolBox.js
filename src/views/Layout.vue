<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <el-menu default-active="1" v-model="nowIndex" class="el-menu-vertical-demo" :collapse="isCollapse" router
                 style="height:100vh">
          <el-menu-item index="ncnn">
            <el-icon>
              <Cellphone/>
            </el-icon>
            <template #title>Waifu2x-ncnn</template>
          </el-menu-item>
          <el-menu-item index="ocr">
            <el-icon>
              <View/>
            </el-icon>
            <template #title>OCR</template>
          </el-menu-item>
          <el-menu-item index="search">
            <el-icon>
              <Search/>
            </el-icon>
            <template #title>BaiduBce</template>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon>
              <Setting/>
            </el-icon>
            <template #title>Settings</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-row type="flex" justify="center" align="middle">
            <router-view></router-view>
          </el-row>
        </el-main>
        <el-footer align="center">
          <span>@ 2022 alchemaniaC All Rights Reserved<br/>*Version 0.3 beta</span>
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
  Cellphone,
} from '@element-plus/icons-vue'
import {ref, reactive, toRefs} from 'vue';

const state = reactive({
  rootSubmenuKeys: ['3'],
  openKeys: [],
  selectedKeys: [],
})
const nowIndex = ref("1-1")

const handleSelect = (key, keyPath) => {
  nowIndex.value = key
}

</script>

<style scoped>
.el-aside {
  width: 200px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.el-header {
  padding: 0%
}

.flex-grow {
  flex-grow: 1;
}
</style>