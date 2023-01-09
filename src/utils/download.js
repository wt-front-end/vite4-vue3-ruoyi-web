import { validURL } from "@/utils/validate";

/**
 * 文件及图片附件下载
 * @param {*} fileName 数据源
 * @param {*} url
 */
export const downloadFile = (signedUrl, fileName) => {
  const alink = document.createElement("a");
  alink.href = signedUrl;
  alink.setAttribute("download", fileName);
  alink.setAttribute("target", "_blank");
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
  window.URL.revokeObjectURL(alink.href);
};

export const downloadIamge = (imgsrc, name) => {
  const image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL("image/png");
    const alink = document.createElement("a");
    const event = new MouseEvent("click");
    alink.download = name || "images";
    alink.href = url;
    alink.dispatchEvent(event);
  };
  image.src = imgsrc;
};

export const downloadFileIamge = (url, fileName) => {
  const filesSuffix = new RegExp(/\.(xlsx|xls|doc|docx|txt|pdf)$/);
  const imagesSuffix = new RegExp(/\.(png|jpg|jpeg)$/);
  if (validURL(url)) {
    if (filesSuffix.test(fileName)) {
      downloadFile(url, fileName);
    } else if (imagesSuffix.test(fileName)) {
      downloadIamge(url, fileName);
    }
  } else {
    console.error("下载失败", url);
    window.open(url, ifileName);
  }
};
