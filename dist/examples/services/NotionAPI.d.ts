import * as notion from "notion-types";
export interface SignedUrlRequest {
    permissionRecord: PermissionRecord;
    url: string;
}
export interface PermissionRecord {
    table: string;
    id: notion.ID;
}
export interface SignedUrlResponse {
    signedUrls: string[];
}
/**
 * Notion API 客户端主类
 * 用于处理与 Notion API 的所有交互
 */
export declare class NotionAPI {
    private readonly _apiBaseUrl;
    private readonly _authToken?;
    private readonly _activeUser?;
    private readonly _userTimeZone;
    private readonly _databaseId?;
    /**
     * 构造函数
     * @param apiBaseUrl - API基础URL，默认为相对路径"/api/v3"
     * @param authToken - 认证令牌
     * @param activeUser - 活动用户
     * @param userTimeZone - 用户时区，默认为"America/New_York"
     * @param databaseId - 数据库ID
     */
    constructor({ apiBaseUrl, authToken, activeUser, userTimeZone, databaseId, }?: {
        apiBaseUrl?: string;
        authToken?: string;
        userLocale?: string;
        userTimeZone?: string;
        activeUser?: string;
        databaseId?: string;
    });
    /**
     * 获取页面内容
     * @param pageId - 页面ID
     * @param options - 配置选项
     * @returns Promise<notion.ExtendedRecordMap> - 返回页面数据
     */
    getPage(pageId: string, { concurrency, fetchMissingBlocks, fetchCollections, signFileUrls, chunkLimit, chunkNumber, }?: {
        concurrency?: number;
        fetchMissingBlocks?: boolean;
        fetchCollections?: boolean;
        signFileUrls?: boolean;
        chunkLimit?: number;
        chunkNumber?: number;
    }): Promise<notion.ExtendedRecordMap>;
    /**
     * 添加文件的签名URL
     * @param recordMap - 记录映射
     * @param contentBlockIds - 内容块ID数组
     */
    addSignedUrls({ recordMap, contentBlockIds, }: {
        recordMap: notion.ExtendedRecordMap;
        contentBlockIds?: string[];
    }): Promise<void>;
    /**
     * Fetches raw page data from Notion.
     *
     * @param pageId - The ID of the Notion page to fetch.
     * @param options - Additional options for the request.
     * @param options.chunkLimit - The number of content chunks to fetch per request (default: 100).
     * @param options.chunkNumber - The chunk number to start fetching from (default: 0).
     * @param options.gotOptions - Additional options to pass to the got request.
     * @returns The raw page data from Notion.
     * @throws Will throw an error if the pageId is invalid.
     */
    getPageRaw(pageId: string, { chunkLimit, chunkNumber, }?: {
        chunkLimit?: number;
        chunkNumber?: number;
    }): Promise<notion.PageChunk>;
    /**
     * 获取数据库id
     * @param collectionId 集合ID
     * @param collectionViewId 集合视图ID
     * @param collectionView 集合视图对象
     * @param param3
     * @returns
     */
    getCollectionData(collectionId: string, collectionViewId: string, collectionView?: any, { limit, searchQuery, userTimeZone, loadContentCover, }?: {
        type?: notion.CollectionViewType;
        limit?: number;
        searchQuery?: string;
        userTimeZone?: string;
        userLocale?: string;
        loadContentCover?: boolean;
    }): Promise<notion.CollectionInstance>;
    getUsers(userIds: string[]): Promise<notion.RecordValues<notion.User>>;
    getBlocks(blockIds: string[]): Promise<notion.PageChunk>;
    getSignedFileUrls(urls: SignedUrlRequest[]): Promise<SignedUrlResponse>;
    search(params: notion.SearchParams): Promise<notion.SearchResults>;
    /**
     * Generic fetch method to make API requests to Notion.
     *
     * @param params - Parameters for the fetch request.
     * @param params.endpoint - The API endpoint to hit.
     * @param params.body - The request body.
     * @param params.gotOptions - Additional options to pass to the got request.
     * @param params.headers - Additional headers for the request.
     * @returns The response from the Notion API.
     */
    fetch<T>({ endpoint, body, headers: clientHeaders, }: {
        endpoint: string;
        body: object;
        headers?: Record<string, string>;
    }): Promise<T>;
}
