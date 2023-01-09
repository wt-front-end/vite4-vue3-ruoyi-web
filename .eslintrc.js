/*
 * @Author: xkloveme
 * @Date: 2022-01-07 17:59:21
 * @LastEditTime: 2022-10-28 14:26:12
 * @LastEditors: xkloveme
 * @Description: ESlint
 * @FilePath: /js-web/.eslintrc.js
 * @Copyright © xkloveme
 */

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "prettier",
    "@vue/prettier"
  ],
  plugins: ["prettier"],
  rules: {
    "no-undef": 0,
    "no-unused-vars": 0,
    "prettier.semi": 0,
    "no-irregular-whitespace": 0,
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    semi: [0, "never"],
    "vue/multi-word-component-names": "off" // 关闭名称校验
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        mocha: true
      }
    }
  ],
  globals: {
    defineProps: "readonly"
  }
};
