<template>
  <el-form ref="formRef" name="custom-validation">
    <el-form-item has-feedback label="图片/文件夹" name="输入路径">
      <el-space direction="vertical">
        <el-input v-model="defaultSavePath" placeholder="input search text"
                  size="large" class="input-with-select">
          <template #append>
            <el-button :icon="Search" @click="onDir" />
          </template>
        </el-input>
      </el-space>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";

const { dialog } = require("@electron/remote");
const Store = require("electron-store");

const store = new Store();
const defaultSavePath = ref(store.get("defaultPath", "C:\\"));
const onDir = searchValue => {
  dialog.showOpenDialog({
    title: "Select File",
    defaultPath: defaultSavePath.value,
    properties: [
      "openDirectory"
    ]
  }).then((result) => {
    defaultSavePath.value = result.filePaths[0];
    store.set("defaultPath", defaultSavePath.value);
  });
};

onMounted(async () => {
  electron.ipcRenderer.send("rtm-sqlite", null);
  electron.ipcRenderer.on("mtr-sqlite", (event, message) => {
    console.log(message);
  });
});
</script>

<style lang="css">

</style>
