/*
 * @Author: xkloveme
 * @Date: 2022-04-02 17:44:36
 * @LastEditTime: 2022-09-08 17:15:35
 * @LastEditors: xkloveme
 * @Description: 打包文件输出版本到public目录
 * @FilePath: /sx-agencies/vite/rollup-plugin-version.js
 * @Copyright © xkloveme
 */
import { execSync } from "child_process";
const packageInfo = require("../package.json"); // 拿到package.json的相关信息

export default function createGitVersion(
  viteEnv,
  options = { fileName: "version.json" }
) {
  const { fileName } = options;
  const { VITE_APP_ENV } = viteEnv;
  return {
    name: "generateGitVersion",
    // 生成文件输出
    generateBundle() {
      try {
        // 执行命令失败进行异常捕获
        const command = "git log -1 --pretty=format:";
        const commandContent = "git log -3 --pretty=format:%s --abbrev-commit";
        const Branch = execSync(`${command}%d`).toString().trim();
        const Hash = execSync(`${command}%H`).toString().trim();
        const author = execSync(`${command}%cn`).toString().trim();
        const email = execSync(`${command}%ce`).toString().trim();
        const content = execSync(`${commandContent}`).toString().trim();
        // 生成版本时间
        let getNowTime = function () {
          let dateTime;
          let yy = new Date().getFullYear();
          let mm = new Date().getMonth() + 1;
          let dd = new Date().getDate();
          let hh = new Date().getHours();
          let mf =
            new Date().getMinutes() < 10
              ? "0" + new Date().getMinutes()
              : new Date().getMinutes();
          let ss =
            new Date().getSeconds() < 10
              ? "0" + new Date().getSeconds()
              : new Date().getSeconds();
          dateTime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
          return dateTime;
        };
        const jsonStr = {
          name: `${packageInfo.description}--${VITE_APP_ENV}`,
          version: packageInfo.version,
          url:
            VITE_APP_ENV == "production"
              ? packageInfo.homepage
              : packageInfo.homepageTest,
          gitlab: packageInfo.repository.url,
          Branch: `${Branch}`,
          Hash: `${Hash}`,
          CommitUser: `${author}(${email})`,
          CommitContent: `${content}`,
          time: getNowTime()
        };
        this.emitFile({
          type: "asset",
          fileName: fileName,
          source: JSON.stringify(jsonStr, null, "\t")
        });
      } catch (error) {
        console.log(error);
        console.log(
          `------Use it in the Git version management directory------`
        );
      }
    }
  };
}
