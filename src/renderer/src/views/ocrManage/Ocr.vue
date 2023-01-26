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
import { reactive, ref, h, onBeforeMount } from "vue";
import { Search, SwitchButton, Warning } from "@element-plus/icons-vue";
import { ElLoading, ElMessage, ElNotification } from "element-plus";
import ImageSelect from "../../components/ImageSelect.vue";
import Tesseract from "tesseract.js";

const { dialog } = require("@electron/remote");
const Store = require("electron-store");

const formRef = ref();
const resultData = ref("");

const imgHide = ref();
const img = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const percentage = ref(0);
const pStatus = ref();
const pDeclaration = ref("未开始");

const onSubmit = async function() {
  try {
    Tesseract.recognize(
      img.value.path,
      "chi_sim+eng",
      {
        logger: m => {
          pDeclaration.value = m.status;
          percentage.value = Math.floor(m.progress * 100);
        }
      }
    ).then(({ data: { text } }) => {
      resultData.value = text;
      pDeclaration.value = "已完成";
      pStatus.value = "success";
    });
  } catch (e) {
    pDeclaration.value = "Ocr Core出现未知错误";
    pStatus.value = "exception";
  }

};

const resetForm = () => {
  resultData.value = [];
};


</script>

<style lang="scss">
.el-textarea {

  /*滚动条整体部分*/
  .el-textarea__inner::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  /*滚动条的轨道*/
  .el-textarea__inner::-webkit-scrollbar-track {
    background-color: #ffffff;
  }

  /*滚动条里面的小方块，能向上向下移动*/
  .el-textarea__inner::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }

  .el-textarea__inner::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, 0.3);
  }

  .el-textarea__inner::-webkit-scrollbar-thumb:active {
    background-color: rgba(144, 147, 153, 0.3);
  }

  /*边角，即两个滚动条的交汇处*/
  .el-textarea__inner::-webkit-scrollbar-corner {
    background-color: #ffffff;
  }
}
</style>
