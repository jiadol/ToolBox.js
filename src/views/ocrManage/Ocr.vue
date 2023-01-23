<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" name="custom-validation">
        <!--        <el-form-item label="图片/文件夹" name="输入路径">-->
        <!--          <el-space>-->
        <!--            <el-input v-model="formState.inputPath" placeholder="输入文件路径"-->
        <!--                      size="large">-->
        <!--              <template #append>-->
        <!--                <el-button :icon="Search" @click="onFile"/>-->
        <!--              </template>-->
        <!--            </el-input>-->
        <!--            <IconAutoChange :value="inputLegal"/>-->
        <!--          </el-space>-->
        <!--        </el-form-item>-->
        <el-upload
            class="upload-demo"
            action="abc"
            :auto-upload="false"
            :on-change="handleImageChange"
            list-type="picture-card"
            accept=".jpg,.png,.jpeg"
            limit="1"
            :on-preview="handlePictureCardPreview"
        >
          <el-icon>
            <Plus color="black"/>
          </el-icon>
        </el-upload>
        <img :src="img" id="imgsource" v-show="false"/>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image"/>
        </el-dialog>
        <!--        <el-form-item label="启用文字方向检测">-->
        <!--          <el-space align="center">-->
        <!--            <el-switch v-model="formState.doAngle" checked-children="I" un-checked-children="O"/>-->
        <!--            <el-tooltip content="实验性功能,仅在图片角度为90~270之间开启,有可能出现漏行问题">-->
        <!--              <el-icon>-->
        <!--                <warning color="red"/>-->
        <!--              </el-icon>-->
        <!--            </el-tooltip>-->
        <!--          </el-space>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="启用GPU">-->
        <!--          <el-switch v-model="formState.gpu" checked-children="I" un-checked-children="O"/>-->
        <!--        </el-form-item>-->
        <el-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <el-button type="primary" @click="onSubmit">提交
            <template #icon>
              <el-icon>
                <SwitchButton/>
              </el-icon>
            </template>
          </el-button>
          <el-button style="margin-left: 10px" @click="resetForm">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <el-input
          v-model="resultData"
          :rows="5"
          type="textarea"
          placeholder="No results"
      />
    </el-footer>
  </el-container>
</template>

<script setup>
import {computed, defineComponent, onMounted, reactive, ref, h} from 'vue';
import path from 'path-browserify';
import {Search, SwitchButton, Warning} from "@element-plus/icons-vue";
import * as ocr from '@paddlejs-models/ocr'
import {ElLoading, ElNotification} from "element-plus";

const {dialog} = require('@electron/remote')
const Store = require('electron-store')
const fs = require('fs')
const tf = require('@tensorflow/tfjs-node')

const formRef = ref()

const formState = reactive({
  inputPath: new Store().get('defaultPath', 'C:\\'),
  doAngle: false,
  gpu: false,
});

const inputLegal = ref(true)
const isSuccess = ref(0)
const resultData = ref("")
const haveInit = ref(false)

const img = ref()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handleImageChange = (file) => img.value = URL.createObjectURL(file.raw)

const onSubmit = async function () {
  const res = await ocr.recognize(document.getElementById("imgsource"))
  console.log('res:', res)
  ElNotification({
    title: 'Ocr',
    message: h('i', {style: 'color: teal'}, 'ocr识别任务已完成'),
  })
  for (const re of res.text) {
    resultData.value += re
    resultData.value += '\n'
  }
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const resetForm = () => {
  resultData.value = []
};

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '预热OCR模块中，预计需要一分钟，请耐心等待',
    background: 'rgba(255,255,255)',
  })
  await ocr.init().then(() => {
    console.log('loading OK')
    loading.close()
  })
})
</script>