<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" :model="formState" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片" name="输入路径">
              <ImageUpload v-model:img="formState.img"></ImageUpload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择引擎">
              <el-radio-group v-model="formState.engine" button-style="solid">
                <template v-for="(value,key) in marks">
                  <el-radio-button :label="key">{{ value }}</el-radio-button>
                </template>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="进度">
              <el-progress type="circle" :text-inside="true" :percentage="10" align="center">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">Progressing</span>
                </template>
              </el-progress>
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-card>
        <el-table :data="resultData" border height="250">
          <el-table-column prop="site" label="数据来源" />
          <el-table-column prop="similarity" label="置信度" />
          <el-table-column prop="author" label="作者" />
          <el-table-column label="URL" width="80" fixed="right">
            <template v-slot="scope">
              <el-link type="primary" :herf="scope.row.url">链接</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-footer>
  </el-container>
</template>

<script setup>
import { defineComponent, reactive, ref, toRefs, watch } from "vue";
import { Search, SwitchButton } from "@element-plus/icons-vue";
import ImageUpload from "@renderer/components/ImageSelect.vue";
import { ElMessage } from "element-plus";
import sagiri from "sagiri";

const fs = require("fs");
const Store = require("electron-store");
const electron = require("electron");

const formRef = ref();
const formState = reactive({
  engine: 1,
  img: null
});

const isSuccess = ref(0);
const resultData = ref([]);
const iconLoading = ref(false);

const runSagiri = async () => {
  electron.ipcRenderer.send("rtm-sagiri", formState.img.path.toString());
  electron.ipcRenderer.on("mtr-sagiri", (event, message) => {
    console.log(message);
    if (!Array.isArray(message)) return;
    message.forEach(element => {
      const author = element["authorName"] == null ? "null" : element["authorName"];
      const tmp = {
        site: element["site"],
        similarity: element["similarity"],
        author: author,
        url: element["url"]
      };
      resultData.value.push(tmp);
    });
  });
};


const onSubmit = () => {
  if (formState.img == null) {
    ElMessage({
      type: "error",
      message: "图片不可以为空"
    });
    return;
  }
  runSagiri();
};

const handleRefresh = () => {

};

const resetForm = () => {
  formState.resultData.value = [];
};

const marks = {
  0: "baidubce",
  1: "trace.moe",
  2: "sauceNAO"
};

</script>
