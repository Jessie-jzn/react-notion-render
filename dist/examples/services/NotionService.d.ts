export declare const NOTION_TOKEN: string;
/**
 * Notion服务类
 * 封装了与Notion API的交互逻辑
 */
declare class NotionService {
    private notionAPI;
    constructor();
    /**
     * 获取指定页面的内容
     * @param pageId - 页面ID
     * @returns Promise<any> - 返回页面数据
     */
    getPage(pageId: string): Promise<import("notion-types").ExtendedRecordMap>;
}
export default NotionService;
