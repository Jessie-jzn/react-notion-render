import * as types from "notion-types";

/**
 * 图片URL映射函数
 * 用于处理Notion中的图片URL
 */
export const defaultMapImageUrl = (url: string, block: types.Block): string => {
  if (!url) {
    return "";
  }

  if (url.startsWith("data:")) {
    return url;
  }

  // 如果是相对路径，添加Notion域名
  if (url.startsWith("/")) {
    url = `https://www.notion.so${url}`;
  }

  // 处理S3图片URL
  if (url.includes("secure.notion-static.com")) {
    url = url.replace("secure.notion-static.com", "www.notion.so");
  }

  return url;
};
