<template>
    <div>
        <a-space direction="vertical">
            <a-input-search v-model:value="defaultSavePath" placeholder="input search text" enter-button="Search"
                size="large" @search="onDir" />
        </a-space>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useStore } from '../store/mainStore.js'
const { dialog } = require('@electron/remote')
import { defineComponent, ref, reactive, toRefs } from 'vue';

export default defineComponent({
    setup() {
        const store = useStore()
        const { defaultSavePath } = storeToRefs(store)
        const onDir = searchValue => {
            dialog.showOpenDialog({
                title: 'Select File',
                defaultPath: defaultSavePath.value,
                properties: [
                    'openDirectory',
                ],
            }).then((result) => {
                store.changePath(result.filePaths[0])
            })

        };
        return {
            defaultSavePath,
            onDir,
        }
    }
})
</script>

<style lang='css'>

</style>