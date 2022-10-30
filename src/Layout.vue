<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" theme="light" collapsible>
            <a-affix :offset-top="0">
                <div class="logo" />
                <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline" :open-keys="openKeys"
                    @openChange="onOpenChange">
                    <a-menu-item key="1" @click="nowSelected = 1">
                        <DesktopOutlined />
                        <span>Waifu2x-ncnn</span>
                    </a-menu-item>
                    <a-menu-item key="2" @click="nowSelected = 2">
                        <mobile-outlined />
                        <span>OCR</span>
                    </a-menu-item>
                    <a-menu-item key="3" @click="nowSelected = 3">
                        <api-two-tone />
                        <span>图像搜索</span>
                    </a-menu-item>
                    <a-sub-menu key="2">
                        <template #title>
                            <span>
                                <setting-outlined />
                                <span>设置</span>
                            </span>
                        </template>
                        <a-menu-item key="20" @click="nowSelected = 20">全局设置</a-menu-item>
                        <a-menu-item key="21">关于</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-affix>
        </a-layout-sider>
        <a-layout>
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item>Main</a-breadcrumb-item>
                    <a-breadcrumb-item>ncnn</a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <template v-if="nowSelected == 1">
                        <Ncnn>
                        </Ncnn>
                    </template>
                    <template v-else-if="nowSelected == 2">
                        <OcrVue>
                        </OcrVue>
                    </template>
                    <template v-else-if="nowSelected == 3">
                        <ImgSearch>
                        </ImgSearch>
                    </template>
                    <template v-else-if="nowSelected == 20">
                        <SettingPage>
                        </SettingPage>
                    </template>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                @ 2022 alchemaniaC All Rights Reserved<br />*Version 0.2.0 preview*
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
import { PieChartOutlined, DesktopOutlined, SettingOutlined, UserOutlined, TeamOutlined, FileOutlined, MobileOutlined,ApiTwoTone } from '@ant-design/icons-vue';
import { defineComponent, ref, reactive, toRefs } from 'vue';
import Ncnn from './views/Ncnn.vue'
import SettingPage from './views/SettingPage.vue'
import OcrVue from './views/Ocr.vue';
import ImgSearch from "./views/ImgSearch.vue"

export default defineComponent({
    components: {
        PieChartOutlined,
        DesktopOutlined,
        UserOutlined,
        TeamOutlined,
        FileOutlined,
        SettingOutlined,
        MobileOutlined,
        ApiTwoTone,
        Ncnn,
        SettingPage,
        OcrVue,
        ImgSearch,
    },

    setup() {
        const nowSelected = ref(0)
        const state = reactive({
            rootSubmenuKeys: ['3'],
            openKeys: [],
            selectedKeys: [],
        });

        const onOpenChange = openKeys => {
            const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
            if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                state.openKeys = openKeys;
            } else {
                state.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        };

        const handleNcnnClick = () => nowSelected.value = 1
        return {
            ...toRefs(state),
            onOpenChange,
            collapsed: ref(true),
            selectedKeys: ref(['1']),
            handleNcnnClick,
            nowSelected,
        };
    }
});
</script>

<style>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>