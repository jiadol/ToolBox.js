import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import db from "./dexie";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.mount("#app");
// 将db初始化提升,在用户有感知之前必然可以初始化完成
db.open();
console.log("dexie ready to receive connect");
