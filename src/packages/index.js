import WtNumber from "./wt-number";
import WtTable from "./wt-table";
import WtModal from "./wt-modal";
import WtScroll from "./wt-scroll";
import WtChart from "./wt-chart";
import WtUpload from "./wt-upload";
import WtJ2e from "./wt-j2e";
import WtE2j from "./wt-e2j";
import WtVerify from "./wt-verify";
import WtEditor from "./wt-editor";
import WtMap from "./wt-map";
// import WtUploadFile from './wt-upload-file'
// import WtScroll from './wt-scroll'
// import WtModal from './wt-modal'
// import WtScrollList from './wt-scroll-list'
import { directives } from "./directive/index";
// import WtUploadFile from './wt-uploadFile'
// import WtForm from './wt-form/index.vue'
// import WtSearch from './wt-search/index.vue'
// import dayjs from 'dayjs'

const components = [
  WtNumber,
  WtTable,
  WtChart,
  WtScroll,
  WtModal,
  WtUpload,
  WtJ2e,
  WtE2j,
  WtVerify,
  WtEditor,
  WtMap
];

const install = Vue => {
  // 遍历注册组件
  components.forEach(component => {
    Vue.component(component.name || component.__name, component);
  });
  // 遍历注册自定义指令
  Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key]);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  ...components
};
