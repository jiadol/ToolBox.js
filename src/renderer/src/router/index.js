import * as VueRouter from 'vue-router'
import { createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import('../views/Layout.vue'),
        children: [
            {
                path: '/search',
                name: 'ImgSearch',
                component: () => import('../views/searchManage/ImgSearch.vue'),
            },
            {
                path: '/ncnn',
                name: 'Ncnn',
                component: () => import('../views/ncnnManage/Ncnn.vue'),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/ocr',
                name: 'Ocr',
                component: () => import('../views/ocrManage/Ocr.vue'),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/settings',
                component: () => import('../views/settingManage/Settings.vue'),
            },
        ]
    },
    // {
    //     path: '*',
    //     redirect: '/'
    // }

]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    // base: process.env.BASE_URL,
    routes, // `routes: routes` 的缩写
})

//登录拦截，拦截非登录请求(暂时不需要)
// router.beforeEach((to, from, next) => {
//     if (to.path.startsWith('/login')) {
//         next()
//     } else {
//         let user = cookies.get('userid')
//         if (!user) {
//             next({
//                 path: '/login'
//             })
//         } else {
//             next()
//         }
//     }
// });


export default router
