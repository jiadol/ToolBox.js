<template>
    <a-form ref="formRef" name="custom-validation" :model="formState" v-bind="layout">
        <a-form-item has-feedback label="图片/文件夹" name="输入路径">
            <a-space align="center">
                <a-input-search v-model:value="formState.inputPath" placeholder="选择文件/文件夹" enter-button="Search"
                    size="default" @search="onFile" autocomplete="off" @change="onChange" />
                <template v-if="inputLegal">
                    <check-circle-two-tone />
                </template>
                <template v-else>
                    <close-circle-two-tone two-tone-color="red" />
                </template>
            </a-space>
        </a-form-item>
        <a-form-item label="启用文字方向检测">
            <a-space align="center">
                <a-switch v-model:checked="formState.doAngle" checked-children="I" un-checked-children="O" />
                <a-tooltip>
                    <template #title>实验性功能,仅在图片角度为90~270之间开启,有可能出现漏行问题</template>
                    <info-circle-two-tone two-tone-color="brown"/>
                </a-tooltip>
            </a-space>
        </a-form-item>
        <a-form-item label="启用GPU">
            <a-switch v-model:checked="formState.gpu" checked-children="I" un-checked-children="O" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">Submit</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item>
    </a-form>
    <a-list size="small" v-model:data-source="resultData">
        <template #renderItem="{ item }">
            <a-list-item>{{ item }}</a-list-item>
        </template>
    </a-list>
</template>

<script>
import { CheckCircleTwoTone, CloseCircleTwoTone,InfoCircleTwoTone } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import path from 'path-browserify';
const { dialog } = require('@electron/remote')
const Store = require('electron-store')
const fs = require('fs')

export default defineComponent({
    components: {
        CheckCircleTwoTone,
        CloseCircleTwoTone,
        InfoCircleTwoTone,
    },
    setup() {
        const defaultSavePath = ref(new Store().get('defaultPath','C:\\'))
        const formRef = ref();
        const formState = reactive({
            inputPath: defaultSavePath.value,
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

        const onSubmit = () => {
            //commands
            const os = require('os')
            const cmdpath = path.resolve()
            const cmd = (formState.gpu ? cmdpath + "\\RapidOcr-ncnn\\win-BIN-GPU-x64\\RapidOcrNcnn.exe" : cmdpath + "\\RapidOcr-ncnn\\win-BIN-CPU-x64\\RapidOcrNcnn.exe")
                + " --models " + cmdpath + "\\RapidOcr-ncnn\\models"
                + " --det ch_PP-OCRv3_det_infer"
                + " --cls ch_ppocr_mobile_v2.0_cls_infer"
                + " --rec ch_PP-OCRv3_rec_infer"
                + " --keys ppocr_keys_v1.txt"
                + " --image " + formState.inputPath
                + " --numThread " + os.cpus().length
                + " --padding 50"
                + " --maxSideLen 1024"
                + " --boxScoreThresh 0.5"
                + " --boxThresh 0.3"
                + " --unClipRatio 1.6"
                + " --doAngle " + (formState.doAngle ? '1' : '0')
                + " --mostAngle 1"
                + " --GPU " + (formState.gpu ? '0' : '-1')
            console.log(cmd)
            // child-process
            const exec = require('child_process').exec;
            console.log("child-process load successfully.")
            isSuccess.value = 1
            try {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        isSuccess.value = 3
                    } else {
                        //print results
                        const temp = formState.inputPath.split('\\')
                        const oldName = temp.pop()
                        const outPath = temp.join("\\") + "\\" + oldName + "-result.txt"
                        console.log(outPath)
                        fs.readFile(outPath, 'utf8', function (err, data) {
                            if (err) {
                                return console.log('读取失败', err)
                            }
                            var lock = true
                            data.split('\n').forEach(item => {
                                if (item.includes("FullDetectTime"))
                                    lock = false
                                if (!lock && item != "") resultData.value.push(item)
                            })
                            console.log(resultData)
                            isSuccess.value = 2

                        })
                    }
                })

            } catch (error) {
                isSuccess.value = 3
                console.error(error)
            }

        }

        const resetForm = () => {
            resultData.value = []
        };


        return {
            formState,
            formRef,
            layout,
            resetForm,
            inputLegal,
            onChange,
            onFile,
            onSubmit,
            isSuccess,
            resultData,
        };
    },

});
</script>