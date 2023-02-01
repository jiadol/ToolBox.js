<template>
  <el-upload
    class="upload-demo"
    drag
    multiple
    style="flex: auto;padding-right: 12px"
    action="aaa"
    :limit="1"
    :on-exceed="handleExceed"
    :auto-upload="false"
    ref="upload"
    :on-change="handleChange"
    accept=".jpg,.png,.webp,.jpeg"
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      拖拽文件 或 <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png 文件大小小于5MB 限制一张图片
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { ref, watch } from "vue";

const prop = defineProps(["img"]);
const emit = defineEmits(["update:img"]);
const img = ref(null);
const upload = ref();
const handleExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  // file.uid = genFileId()
  upload.value.handleStart(file);
};
const handleChange = (file) => emit("update:img", file.raw);
</script>

<style>
.el-upload-dragger {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
