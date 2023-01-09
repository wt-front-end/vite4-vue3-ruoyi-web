import { createApp } from "vue";
import elementPlus from "./elementPlus";
import App from "./App";
import store from "./store";
import router from "./router";
import "./permission"; // permission control
import 'uno.css'
const app = createApp(App);
app.use(router);
app.use(store);
app.use(elementPlus);
app.mount("#app");
