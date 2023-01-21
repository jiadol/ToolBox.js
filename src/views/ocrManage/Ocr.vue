<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" name="custom-validation">
        <el-form-item label="图片/文件夹" name="输入路径">
          <el-space>
            <el-input v-model="formState.inputPath" placeholder="输入文件路径"
                      size="large">
              <template #append>
                <el-button :icon="Search" @click="onFile"/>
              </template>
            </el-input>
            <IconAutoChange :value="inputLegal"/>
          </el-space>
        </el-form-item>
        <el-form-item label="启用文字方向检测">
          <el-space align="center">
            <el-switch v-model="formState.doAngle" checked-children="I" un-checked-children="O"/>
            <el-tooltip content="实验性功能,仅在图片角度为90~270之间开启,有可能出现漏行问题">
              <el-icon>
                <warning color="red"/>
              </el-icon>
            </el-tooltip>
          </el-space>
        </el-form-item>
        <el-form-item label="启用GPU">
          <el-switch v-model="formState.gpu" checked-children="I" un-checked-children="O"/>
        </el-form-item>
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
      <!--      <el-list size="small" v-model:datel-source="resultData">-->
      <!--        <template #renderItem="{ item }">-->
      <!--          <el-list-item>{{ item }}</el-list-item>-->
      <!--        </template>-->
      <!--      </el-list>-->
    </el-footer>
  </el-container>
</template>

<script setup>
import {computed, defineComponent, reactive, ref, watch} from 'vue';
import path from 'path-browserify';
import {Search, SwitchButton, Warning} from "@element-plus/icons-vue";
import IconAutoChange from "../../components/IconAutoChange.vue";
import Tesseract from "tesseract.js";


const {dialog} = require('@electron/remote')
const Store = require('electron-store')
const fs = require('fs')

const store = new Store()
const defaultSavePath = ref(store.get('defaultPath', 'C:\\'))
const formRef = ref();
const formState = reactive({
  inputPath: '',
  doAngle: false,
  gpu: false,
});
const inputLegal = ref(true)
const isSuccess = ref(0)
const resultData = ref([])

const onChange = async () => await fs.promises.access(formState.inputPath, fs.constants.F_OK, (err) => inputLegal.value = err ? false : true);

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
  }).then((result) => { //在此读取图片
    formState.inputPath = result.filePaths[0]
    console.log(formState.inputPath)
    onChange()
  })
};

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
};

// const onSubmit = () => {
//   //commands
//   const os = require('os')
//   const cmdpath = path.resolve()
//   const cmd = (formState.gpu ? cmdpath + "\\RapidOcr-ncnn\\win-BIN-GPU-x64\\RapidOcrNcnn.exe" : cmdpath + "\\RapidOcr-ncnn\\win-BIN-CPU-x64\\RapidOcrNcnn.exe")
//       + " --models " + cmdpath + "\\RapidOcr-ncnn\\models"
//       + " --det ch_PP-OCRv3_det_infer"
//       + " --cls ch_ppocr_mobile_v2.0_cls_infer"
//       + " --rec ch_PP-OCRv3_rec_infer"
//       + " --keys ppocr_keys_v1.txt"
//       + " --image " + formState.inputPath
//       + " --numThread " + os.cpus().length
//       + " --padding 50"
//       + " --maxSideLen 1024"
//       + " --boxScoreThresh 0.5"
//       + " --boxThresh 0.3"
//       + " --unClipRatio 1.6"
//       + " --doAngle " + (formState.doAngle ? '1' : '0')
//       + " --mostAngle 1"
//       + " --GPU " + (formState.gpu ? '0' : '-1')
//   console.log(cmd)
//   // child-process
//   const exec = require('child_process').exec;
//   console.log("child-process load successfully.")
//   isSuccess.value = 1
//   try {
//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         isSuccess.value = 3
//       } else {
//         //print results
//         const temp = formState.inputPath.split('\\')
//         const oldName = temp.pop()
//         const outPath = temp.join("\\") + "\\" + oldName + "-result.txt"
//         console.log(outPath)
//         fs.readFile(outPath, 'utf8', function (err, data) {
//           if (err) {
//             return console.log('读取失败', err)
//           }
//           var lock = true
//           data.split('\n').forEach(item => {
//             if (item.includes("FullDetectTime"))
//               lock = false
//             if (!lock && item != "") resultData.value.push(item)
//           })
//           console.log(resultData)
//           isSuccess.value = 2
//
//         })
//       }
//     })
//
//   } catch (error) {
//     isSuccess.value = 3
//     console.error(error)
//   }
//
// }
const onSubmit = async () => {
  await Tesseract.recognize(
      formState.inputPath,
      'chi_sim',
      {logger: m => console.log(m)}
  ).then(({data: {text}}) => {
    console.log(text);
  })
}

const resetForm = () => {
  resultData.value = []
};

watch(formState, () => {
  console.log(formState)
})
</script>