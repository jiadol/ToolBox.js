<template>
    <div>
        <a-space direction="vertical">
            <a-input-search v-model:value="defaultSavePath" placeholder="input search text" enter-button="Search"
                size="large" @search="onDir" />
        </a-space>
    </div>
</template>

<script>
const { dialog } = require('@electron/remote')
const Store = require('electron-store')
import { defineComponent, ref, reactive, toRefs } from 'vue';

export default defineComponent({
    setup() {
        const store = new Store()
        const defaultSavePath = ref(store.get('defaultPath','C:\\'))
        const onDir = searchValue => {
            dialog.showOpenDialog({
                title: 'Select File',
                defaultPath: defaultSavePath.value,
                properties: [
                    'openDirectory',
                ],
            }).then((result) => {
                defaultPath.value = result.filePaths[0]
                store.set('defaultPath',defaultPath.value)
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