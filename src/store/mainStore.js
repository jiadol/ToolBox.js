import { defineStore } from "pinia";

// 注意：**pinia-plugin-persist要触发actions里的方法才会生效**
// 设置持久化为window.localstorage才会本地存储生效

export const useStore = defineStore('mainStore', {
    state() {
        return {
            defaultSavePath: "C:\\Users\\Administrator\\Desktop",
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.localStorage,
            }
        ]
    },
    getters: {
        getDefaultSavePath: state => {
            return state.defaultSavePath
        }
    },
    actions: {
        changePath(newPath) {
            this.defaultSavePath = newPath
            return true
        }
    }
})

