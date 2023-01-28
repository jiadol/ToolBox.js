<template>
  <el-form ref="formRef" name="custom-validation">
    <el-form-item has-feedback label="图片/文件夹" name="输入路径">
      <el-space direction="vertical">
        <el-input v-model="formState.DEFAULT_SAVE_PATH" placeholder="input search text"
                  size="large" class="input-with-select">
          <template #append>
            <el-button :icon="Search" @click="onDir" />
          </template>
        </el-input>
      </el-space>
    </el-form-item>
    <el-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <el-button type="primary" :loading="iconLoading" @click="onSubmit">
        <template #icon>
          <el-icon>
            <SwitchButton />
          </el-icon>
        </template>
        提交
      </el-button>
      <el-button style="margin-left: 10px" @click="handleRefresh">刷新</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { Search, SwitchButton } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const electron = require("electron");
const { dialog } = require("@electron/remote");

const formState = reactive({
  DEFAULT_SAVE_PATH: "C://"
});

const onDir = () => {
  dialog.showOpenDialog({
    title: "Select File",
    defaultPath: "C://",
    properties: [
      "openDirectory"
    ]
  }).then(async (result) => {
    if (result.canceled) return;
    formState.DEFAULT_SAVE_PATH = result.filePaths[0];
  });
};

const onSubmit = () => {
  electron.ipcRenderer.send("rtm-settings", JSON.stringify(formState));
  electron.ipcRenderer.once("mtr-settings", (event, message) => {
    ElMessage({
      type: message ? "success" : "error",
      message: message ? "设置成功" : "设置失败"
    });
  });
};

</script>

<style lang="css">

</style>
