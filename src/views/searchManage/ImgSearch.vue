<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" :model="formState">
        <el-form-item label="图片" name="输入路径">
          <el-space>
            <el-input v-model="formState.inputPath" placeholder="选择文件/文件夹"
                      size="large" @search="onFile" autocomplete="off" @input="onChange">
              <template #append>
                <el-button :icon="Search" @click="onFile"/>
              </template>
            </el-input>
            <IconAutoChange :value="formState.inputLegal"/>
          </el-space>
        </el-form-item>
        <el-form-item label="选择引擎">
          <el-radio-group v-model="formState.engine" button-style="solid">
            <template v-for="(value,key) in marks">
              <el-radio-button :label="key">{{ value }}</el-radio-button>
            </template>
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
      <el-table :data="resultData" stripe style="width: 100%">
        <el-table-column prop="site" label="数据来源" width="180"/>
        <el-table-column prop="similarity" label="置信度" width="180"/>
        <el-table-column prop="author" label="作者" width="180"/>
        <el-table-column prop="url" label="链接" width="180" fixed/>
      </el-table>
    </el-footer>
  </el-container>
</template>

<script setup>
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {Search, SwitchButton} from "@element-plus/icons-vue";
import IconAutoChange from "../../components/IconAutoChange.vue";

const {dialog} = require('@electron/remote')
const fs = require('fs')
const Store = require('electron-store')


const formRef = ref();
const formState = reactive({
  inputPath: new Store().get('defaultPath', 'C:\\'),
  engine: 1,
  inputLegal: true,
})

const isSuccess = ref(0)
const resultData = ref([])
const iconLoading = ref(false)

const onChange = async () => {
  await fs.promises.access(formState.inputPath, fs.constants.F_OK, (err) => {
    if (err) formState.inputLegal = false
    else formState.inputLegal = true
  })
}

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
    formState.inputPath = result.filePaths[0]
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

// const baidubce = async () => {


//     // 设置APPID/AK/SK
//     var APP_ID = "28114402";
//     var API_KEY = "8V0PxfGQaqqyGvYfq1YssLmc";
//     var SECRET_KEY = "pFtBzCarqIqOSilMKf0ixQZFckuQFbhu";

//     // 新建一个对象，建议只保存一个对象调用服务接口
//     var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);
// }

const onSubmit = async () => {
  const sagiri = require('sagiri', {results: 5})
  const cilent = sagiri("e45d818ace236475d45afa438d0f14826208724e")
  await cilent(formState.inputPath).then(res => {
    res.forEach(element => {
      var ahr = element["authorName"] == null ? "null" : element["authorName"]
      var tmp = {
        site: element["site"],
        similarity: element["similarity"],
        author: ahr,
        url: element["url"],
      }
      resultData.value.push(tmp)
    })
    console.log(resultData.value)
  })
}

const handleRefresh = () => {

}

const resetForm = () => {
  formState.resultData.value = []
};

const marks = {
  0: 'baidubce',
  1: 'trace.moe',
  2: 'sauceNAO',
}
</script>