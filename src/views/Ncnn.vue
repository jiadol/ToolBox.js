<template>
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="输入路径">
            <a-space align="center">
                <a-input-search v-model:value="formState.inputFile" placeholder="input search text"
                    enter-button="Search" size="default" @search="onFile" @change="onChangeInput" />
                <template v-if="inputLegal">
                    <check-circle-two-tone />
                </template>
                <template v-else>
                    <close-circle-two-tone two-tone-color="red" />
                </template>
            </a-space>
        </a-form-item>
        <a-form-item label="输出路径">
            <a-space align="center">
                <a-input-search v-model:value="formState.outputDir" placeholder="input search text"
                    enter-button="Search" size="default" @search="onDir" @change="onChangeOutput" />
                <template v-if="outputLegal">
                    <check-circle-two-tone />
                </template>
                <template v-else>
                    <close-circle-two-tone two-tone-color="red" />
                </template>
            </a-space>
        </a-form-item>
        <a-form-item label="显卡选择">
            <a-checkbox-group v-model:value="formState.type" disabled>
                <a-checkbox value="1" name="auto">auto</a-checkbox>
            </a-checkbox-group>
        </a-form-item>
        <a-form-item label="降噪等级">
            <a-radio-group v-model:value="formState.denoise" button-style="solid">
                <a-radio-button value="-1">-1</a-radio-button>
                <a-radio-button value="0">0</a-radio-button>
                <a-radio-button value="1">1</a-radio-button>
                <a-radio-button value="2">2</a-radio-button>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="放大等级">
            <a-radio-group v-model:value="formState.upscale" button-style="solid">
                <a-radio-button value="1">1x</a-radio-button>
                <a-radio-button value="2">2x</a-radio-button>
                <a-radio-button value="4">4x</a-radio-button>
                <a-radio-button value="8">8x</a-radio-button>
                <a-radio-button value="16">16x</a-radio-button>
                <a-radio-button value="32">32x</a-radio-button>
            </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" :loading="iconLoading" @click="onSubmit">
                <template #icon>
                    <PoweroffOutlined />
                </template>
                提交
            </a-button>
            <a-button style="margin-left: 10px" @click="handleRefresh">刷新</a-button>
        </a-form-item>
    </a-form>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '100px' }" v-if="isSuccess === 3">
        <a-steps :current="1">
            <a-step title="输入" />
            <a-step title="处理" status="error" />
            <a-step title="输出" />
        </a-steps>
    </div>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '100px' }" v-else>
        <a-steps :current="isSuccess">
            <a-step title="输入" />
            <a-step title="处理" />
            <a-step title="输出" />
        </a-steps>
    </div>
</template>

<script lang="js">
import { defineComponent, reactive, toRaw, defineProps, onUpdated, ref } from 'vue';
import { PoweroffOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue';
import runshell from '../../ncnn/exec'
const Store = require('electron-store')
const { dialog } = require('@electron/remote')
const fs = require('fs')

export default defineComponent({
    components: {
        PoweroffOutlined,
        CheckCircleTwoTone,
        CloseCircleTwoTone
    },

    setup() {
        const defaultSavePath = ref(new Store().get('defaultPath','C:\\'))
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
        return {
            labelCol: {
                style: {
                    width: "150px",
                },
            },
            wrapperCol: {
                span: 14,
            },
            formState,
            onFile,
            onDir,
            onSubmit,
            iconLoading,
            isSuccess,
            handleRefresh,
            inputLegal,
            outputLegal,
            onChangeInput,
            onChangeOutput,
        };
    }

});
</script>