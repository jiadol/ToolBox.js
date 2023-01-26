<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" name="custom-validation">
        <ImageSelect v-model:img="img"></ImageSelect>
        <img :src="imgHide" id="imgsource" v-show="false" alt="" />
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <el-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <el-button type="primary" @click="onSubmit">提交
            <template #icon>
              <el-icon>
                <SwitchButton />
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
import { reactive, ref, h, onBeforeMount } from "vue";
import { Search, SwitchButton, Warning } from "@element-plus/icons-vue";
import * as ocr from "./lib/index";
import { ElLoading, ElMessage, ElNotification } from "element-plus";
import ImageSelect from "../../components/ImageSelect.vue";
import electron from "electron";


const { dialog } = require("@electron/remote/main");
const Store = require("electron-store");
const fs = require("fs");

const formRef = ref();

const inputLegal = ref(true);
const isSuccess = ref(0);
const resultData = ref("");
const haveInit = ref(false);

const imgHide = ref();
const img = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleImageChange = (file) => imgHide.value = URL.createObjectURL(file.raw);

const onSubmit = async function() {
  const res = await ocr.recognize(document.getElementById("imgsource"));
  console.log("res:", res);
  ElNotification({
    title: "Ocr",
    message: h("i", { style: "color: teal" }, "ocr识别任务已完成")
  });
  for (const re of res.text) {
    resultData.value += re;
    resultData.value += "\n";
  }
};

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const resetForm = () => {
  resultData.value = [];
};

onBeforeMount(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "预热OCR模块中，预计需要一分钟，请耐心等待",
    background: "rgb(255,255,255)"
  });
  // electron.ipcRenderer.send("rtm-ocr", "init");
  // electron.ipcRenderer.on("mtr-ocr", (event, initOk, message) => {
  //   loading.close();
  //   if (!initOk)
  //     ElMessage({
  //       type: "error",
  //       message: "出现错误，无法使用该模块"
  //     });
  // });
  await ocr.init();
});
</script>
