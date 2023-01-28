<template>
  <el-container>
    <el-main>
      <el-form :model="formState">
        <el-form-item label="输入路径">
          <el-space>
            <el-input v-model="formState.inputPath" placeholder="input search text"
                      size="large" @input="onChange(formState.inputPath)" class="input-with-select">
              <template #append>
                <el-button :icon="Search" @click="onFile" />
              </template>
            </el-input>
            <IconAutoChange :value="inputLegal" />
          </el-space>
        </el-form-item>
        <el-form-item label="输出路径">
          <el-space>
            <el-input v-model="formState.outputPath" placeholder="input search text"
                      enter-button="Search" size="large" @input="onChange(formState.outputPath)">
              <template #append>
                <el-button :icon="Search" @click="onDir" />
              </template>
            </el-input>
            <IconAutoChange :value="outputLegal" />
          </el-space>
        </el-form-item>
        <el-form-item label="显卡选择">
          <el-checkbox-group v-model:value="formState.type" disabled>
            <el-checkbox value="1" name="auto">auto</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="降噪等级">
          <el-radio-group v-model="formState.denoise" button-style="solid">
            <el-radio-button label="-1" />
            <el-radio-button label="0" />
            <el-radio-button label="1" />
            <el-radio-button label="2" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="放大等级">
          <el-radio-group v-model="formState.upscale" button-style="solid">
            <el-radio-button label="1">1x</el-radio-button>
            <el-radio-button label="2">2x</el-radio-button>
            <el-radio-button label="4">4x</el-radio-button>
            <el-radio-button label="8">8x</el-radio-button>
            <el-radio-button label="16">16x</el-radio-button>
            <el-radio-button label="32">32x</el-radio-button>
          </el-radio-group>
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
    </el-main>
    <el-footer>
      <el-divider />
      <div :style="{ padding: '24px', background: '#fff', minHeight: '100px' }" align="center">
        <el-progress :percentage="percentage" :status="pStatus" type="dashboard">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span><br />
            <span class="percentage-label">{{ pDeclaration }}</span>
          </template>
        </el-progress>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { Search, CircleCheck, CircleClose, SwitchButton } from "@element-plus/icons-vue";
import { defineComponent, reactive, toRaw, onUpdated, ref } from "vue";
import IconAutoChange from "../../components/IconAutoChange.vue";
import { ElMessage } from "element-plus";
import path from "path-browserify";

const { dialog } = require("@electron/remote");
const fs = require("fs");


const iconLoading = ref(false);
const isSuccess = ref(0);
const inputLegal = ref(false);
const outputLegal = ref(true);
const formState = reactive({
  inputPath: "",
  outputPath: "",
  denoise: "0",
  upscale: "1"
});

const pStatus = ref("success");
const percentage = ref(0);
const pDeclaration = ref("未开始");

const onChange = async (dir) => await fs.promises.access(dir, fs.constants.F_OK, (err) => inputLegal.value = err ? false : true);

const onFile = searchValue => {
  dialog.showOpenDialog({
    title: "Select File",
    defaultPath: "C:/",
    filters: [{
      name: "format",
      extensions: [
        "jpg", "png", "webp", ""
      ]
    }],
    properties: [
      "openFile"
    ]
  }).then((result) => {
    formState.inputPath = result.filePaths[0];
    onChange(formState.outputPath);
  });

};
const onDir = searchValue => {
  dialog.showOpenDialog({
    title: "Select File",
    defaultPath: "C:/",
    properties: [
      "openDirectory"
    ]
  }).then((result) => {
    formState.outputPath = result.filePaths[0];
    onChange(formState.outputPath);
  });
};

const onSubmit = () => {
  iconLoading.value = true;
  percentage.value = 0;
  if (!inputLegal.value || !outputLegal.value) {
    ElMessage({
      type: "error",
      message: "输入/输出不可以为空"
    });
    iconLoading.value = false;
    return;
  }

  const cmd = runshell(formState); //get cmd
  const exec = require("child_process").exec;
  console.log("child-process load successfully.");
  percentage.value = 50;
  pDeclaration.value = "子进程加载完成";

  try {
    exec(cmd, (error, stdout, stderr) => {
      console.log("running " + cmd);
      if (error) {
        pStatus.value = "exception";
        pDeclaration.value = "出现错误";
        return;
      }
      percentage.value = 100;
      pDeclaration.value = "图片处理完成";
      iconLoading.value = false;
    });
  } catch (error) {
    pStatus.value = "exception";
    pDeclaration.value = "出现未知错误";
    iconLoading.value = false;
  }
};

const handleRefresh = () => {
  formState.denoise = "0";
  formState.inputPath = "";
  formState.outputPath = defaultSavePath.value;
  formState.upscale = "1";
  isSuccess.value = 0;
  inputLegal.value = false;
  outputLegal.value = true;
};

const runshell = () => {
  const cmdpath = path.resolve();
  if (process.env.NODE_ENV === "development") {
    return cmdpath + "\\resources\\ncnn\\waifu2x-ncnn-vulkan.exe " + "-i " + formState.inputPath + " -o " + formState.outputPath + "\\output.png" + " -n " + formState.denoise + " -s " + formState.upscale;
  } else {
    return cmdpath + "\\ncnn\\waifu2x-ncnn-vulkan.exe " + "-i " + formState.inputPath + " -o " + formState.outputPath + "\\output.png" + " -n " + formState.denoise + " -s " + formState.upscale;
  }
};
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
