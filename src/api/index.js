/*
 * @Author: xkloveme
 * @Date: 2021-10-25 14:31:48
 * @LastEditTime: 2022-05-10 17:00:07
 * @LastEditors: xkloveme
 * @Description:  所有api
 * @FilePath: /la-ft-web/src/api/index.js
 * @Copyright © xkloveme
 */
const files = import.meta.globEager("../api/**/*.js");
let Apis = {};
const excludeFileNames = "api/index.js";
Object.keys(files).forEach(c => {
  if (!c.endsWith(excludeFileNames)) {
    Apis = { ...Apis, ...files[c] };
  }
});
export default Apis;
