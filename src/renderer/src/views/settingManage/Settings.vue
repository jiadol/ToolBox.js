<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" name="custom-validation">
        <el-form-item has-feedback label="默认保存路径">
          <el-space direction="vertical">
            <el-input v-model="settingList[0].value" placeholder="input search text"
                      size="large" class="input-with-select">
              <template #append>
                <el-button :icon="Search" @click="onDir(0)" />
              </template>
            </el-input>
          </el-space>
        </el-form-item>
        <el-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <el-button-group>
            <el-button type="primary" :icon=SwitchButton :loading="iconLoading" @click="onSubmit">提交</el-button>
            <el-button type="success" :icon=Refresh @click="handleRefresh">刷新</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, computed, onBeforeMount } from "vue";
import { Search, SwitchButton, Refresh } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import db from "../../dexie";

const { dialog } = require("@electron/remote");

const settingList = ref([
  {
    key: "DEFAULT_SAVE_PATH",
    value: ""
  }
]);

const onDir = key => {
  dialog.showOpenDialog({
    title: "Select File",
    defaultPath: settingList.value[key].value,
    properties: [
      "openDirectory"
    ]
  }).then(async (result) => {
    if (result.canceled) return;
    settingList.value[key].value = result.filePaths[0];
  });
};

const onSubmit = () => {
  // JSON.parse(JSON.stringify(obj)) 实现深拷贝Proxy对象
  db.settings.bulkPut(JSON.parse(JSON.stringify(settingList.value))).then(() => {
    ElMessage({
      type: "success",
      message: "更新成功"
    });
  }).catch(() => {
    ElMessage({
      type: "warning",
      message: "更新失败"
    });
  });
};

const handleRefresh = () => {
  ElMessage({
    type: "success",
    message: "已更新"
  });
};

onMounted(async () => db.settings.toCollection().toArray(arr => settingList.value = arr));
</script>

<style lang="css">

</style>
