/*
 * @Author: xkloveme
 * @Date: 2022-11-02 14:59:51
 * @LastEditTime: 2022-11-02 15:02:00
 * @LastEditors: xkloveme
 * @Description: oss 上传
 * @FilePath: /js-web/src/api/system/oss.js
 * @Copyright © xkloveme
 */
import request from "@/utils/request";

// oss 上传编辑器上传图片资源
export const editUploadOss = (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return  request.post('/oss/ossUpload', formData, config)
  }