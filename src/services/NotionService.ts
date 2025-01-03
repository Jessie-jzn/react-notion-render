import { NotionAPI } from "../NotionAPI";
import { NOTION_TOKEN } from "../lib/constants";

/**
 * Notion服务类
 * 封装了与Notion API的交互逻辑
 */
class NotionService {
  private notionAPI: NotionAPI;

  constructor() {
    this.notionAPI = new NotionAPI({
      authToken: NOTION_TOKEN,
    });
  }

  /**
   * 获取指定页面的内容
   * @param pageId - 页面ID
   * @returns Promise<any> - 返回页面数据
   */
  async getPage(pageId: string) {
    try {
      const page = await this.notionAPI.getPage(pageId);
      return page;
    } catch (error: any) {
      console.error("Error fetching page:", error.body || error);
      throw new Error("Failed to fetch page");
    }
  }
}

export default NotionService;
