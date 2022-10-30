<template>
    <a-form ref="formRef" name="custom-validation" :model="state" v-bind="layout">
        <a-form-item has-feedback label="图片" name="输入路径">
            <a-space align="center">
                <a-input-search v-model:value="state.inputPath" placeholder="选择文件/文件夹" enter-button="Search"
                    size="default" @search="onFile" autocomplete="off" @change="onChange" />
                <template v-if="state.inputLegal">
                    <check-circle-two-tone />
                </template>
                <template v-else>
                    <close-circle-two-tone two-tone-color="red" />
                </template>
            </a-space>
        </a-form-item>
        <a-form-item label="选择引擎">
            <a-slider v-model:value="state.engine" :marks="marks" :step="null" :min=0 :max=2></a-slider>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">Submit</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item>
    </a-form>
    <a-table :columns="columns" :data-source="resultData">
    </a-table>
</template>

<script>
import { ArrowUpOutlined, CheckCircleTwoTone, CloseCircleTwoTone, InfoCircleTwoTone } from '@ant-design/icons-vue';
import { acceptHMRUpdate, storeToRefs } from 'pinia';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { useStore } from '../store/mainStore';
const { dialog } = require('@electron/remote')
import path from 'path-browserify';
const fs = require('fs')


export default defineComponent({
    components: {
        CheckCircleTwoTone,
        CloseCircleTwoTone,
        InfoCircleTwoTone,
    },
    setup() {
        const { defaultSavePath } = storeToRefs(useStore())
        const formRef = ref();
        const state = reactive({
            inputPath: defaultSavePath.value,
            engine: 1,
            inputLegal: true,
        })

        const isSuccess = ref(0)
        const resultData = ref([])

        const onChange = async () => {
            await fs.promises.access(state.inputPath, fs.constants.F_OK, (err) => {
                if (err) state.inputLegal = false
                else state.inputLegal = true
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
                state.inputPath = result.filePaths[0]
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

        const onSubmit = async () => {
            const sagiri = require('sagiri', { results: 5 })
            const cilent = sagiri("e45d818ace236475d45afa438d0f14826208724e")
            await cilent(state.inputPath).then(res => {
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

        const resetForm = () => {
            state.resultData.value = []
        };


        return {
            state,
            formRef,
            layout,
            resetForm,
            onChange,
            onFile,
            isSuccess,
            resultData,
            onSubmit,
            columns: [
                {
                    title: '数据来源',
                    dataIndex: 'site',
                    key: 'site',
                },
                {
                    title: '置信度',
                    dataIndex: 'similarity',
                    key: 'similarity',
                },
                {
                    title: '作者',
                    dataIndex: 'author',
                    key: 'author',
                },
                {
                    title: '链接',
                    dataIndex: 'url',
                    key: 'url'
                }
            ],
            marks: {
                0: 'baidubce',
                1: 'trace.moe',
                2: 'sauceNAO',
            }
        };
    },

});
</script>