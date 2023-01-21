<template>
  <el-container>
    <el-main>
      <el-form :model="formState">
        <el-form-item label="输入路径">
          <el-space>
            <el-input v-model="formState.inputFile" placeholder="input search text"
                      size="large" @input="onChangeInput" class="input-with-select">
              <template #append>
                <el-button :icon="Search" @click="onFile"/>
              </template>
            </el-input>
            <IconAutoChange :value="inputLegal"/>
          </el-space>
        </el-form-item>
        <el-form-item label="输出路径">
          <el-space>
            <el-input v-model="formState.outputDir" placeholder="input search text"
                      enter-button="Search" size="large" @search="onDir" @input="onChangeOutput">
              <template #append>
                <el-button :icon="Search" @click="onFile"/>
              </template>
            </el-input>
            <IconAutoChange :value="outputLegal"/>
          </el-space>
        </el-form-item>
        <el-form-item label="显卡选择">
          <el-checkbox-group v-model:value="formState.type" disabled>
            <el-checkbox value="1" name="auto">auto</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="降噪等级">
          <el-radio-group v-model="formState.denoise" button-style="solid">
            <el-radio-button label="-1"/>
            <el-radio-button label="0"/>
            <el-radio-button label="1"/>
            <el-radio-button label="2"/>
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
                <SwitchButton/>
              </el-icon>
            </template>
            提交
          </el-button>
          <el-button style="margin-left: 10px" @click="handleRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '100px' }" v-if="isSuccess === 3">
        <el-steps :current="1">
          <el-step title="输入"/>
          <el-step title="处理" status="error"/>
          <el-step title="输出"/>
        </el-steps>
      </div>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '100px' }" v-else>
        <el-steps :current="isSuccess">
          <el-step title="输入"/>
          <el-step title="处理"/>
          <el-step title="输出"/>
        </el-steps>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import {Search, CircleCheck, CircleClose, SwitchButton} from '@element-plus/icons-vue'
import {defineComponent, reactive, toRaw, onUpdated, ref} from 'vue';
import runshell from '../../../ncnn/exec'
import IconAutoChange from "../../components/IconAutoChange.vue";

const Store = require('electron-store')
const {dialog} = require('@electron/remote')
const fs = require('fs')


const defaultSavePath = ref(new Store().get('defaultPath', 'C:\\'))
const iconLoading = ref(false)
const isSuccess = ref(0)
const inputLegal = ref(false)
const outputLegal = ref(true)
const formState = reactive({
  inputFile: "",
  outputDir: defaultSavePath.value,
  denoise: '0',
  upscale: '1',
})

const onChangeInput = async () => await fs.promises.access(formState.inputFile, fs.constants.F_OK, (err) => inputLegal.value = err ? false : true);

const onChangeOutput = async () => await fs.promises.access(formState.outputDir, fs.constants.F_OK, (err) => outputLegal.value = err ? false : true);

const onFile = searchValue => {
  dialog.showOpenDialog({
    title: 'Select File',
    defaultPath: 'C:/',
    filters: [{
      name: 'format',
      extensions: [
        'jpg', 'png', 'webp', ''
      ]
    }],
    properties: [
      'openFile',
    ],
  }).then((result) => {
    formState.inputFile = result.filePaths[0]
    onChangeInput()
  })

};
const onDir = searchValue => {
  dialog.showOpenDialog({
    title: 'Select File',
    defaultPath: 'C:/',
    properties: [
      'openDirectory',
    ],
  }).then((result) => {
    formState.outputDir = result.filePaths[0]
    onChangeOutput()
  })

};
const onSubmit = () => {
  iconLoading.value = true
  const cmd = runshell(formState) //get cmd
  const exec = require('child_process').exec;
  console.log("child-process load successfully.")
  isSuccess.value = 1
  if (!inputLegal.value || !outputLegal.value) {
    isSuccess.value = 3
    iconLoading.value = false
    return
  }
  try {
    exec(cmd, (error, stdout, stderr) => {
      console.log("running " + cmd)
      if (error) {
        isSuccess.value = 3
        console.log(isSuccess)
      }
      isSuccess.value = 2
      iconLoading.value = false
    })
  } catch (error) {
    isSuccess.value = 3
    console.error(error)
    iconLoading.value = false
  }
};

const handleRefresh = () => {
  formState.denoise = '0';
  formState.inputFile = ""
  formState.outputDir = defaultSavePath.value
  formState.upscale = '1'
  isSuccess.value = 0
  inputLegal.value = false;
  outputLegal.value = true;
}

</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>