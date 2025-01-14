import * as React from "react";
import * as types from "notion-types";
import {
  getBlockCollectionId,
  getBlockIcon,
  getBlockParentPage,
  getPageTableOfContents,
  getTextContent,
  uuidToId,
} from "notion-utils";

// 组件导入
import { Audio } from "./components/audio"; // 音频播放组件,用于渲染音频内容
import { EOI } from "./components/eoi"; // 外部对象实例组件,用于渲染外部嵌入内容
import { File } from "./components/file"; // 文件组件,用于渲染文件下载
import { LazyImage } from "./components/lazy-image"; // 图片懒加载组件,优化图片加载性能
import { PageAside } from "./components/page-aside"; // 页面侧边栏组件,包含目录等内容
import { PageIcon } from "./components/page-icon"; // 页面图标组件,显示页面的图标
import { PageTitle } from "./components/page-title"; // 页面标题组件,渲染页面标题
import { SyncPointerBlock } from "./components/sync-pointer-block"; // 同步指针块组件,处理块引用
import { Text } from "./components/text"; // 文本组件,处理富文本渲染
import { useNotionContext } from "./context"; // Notion上下文Hook,提供全局配置和状态
import { LinkIcon } from "./icons/link-icon"; // 链接图标组件
import { cs, getListNumber, isUrl } from "./utils"; // 工具函数

/**
 * 块组件的属性接口
 */
interface BlockProps {
  block: types.Block; // Notion块数据
  level: number; // 嵌套层级

  className?: string; // 自定义类名
  bodyClassName?: string; // 内容区域类名

  // 页面布局相关组件
  header?: React.ReactNode; // 页面头部
  footer?: React.ReactNode; // 页面底部
  pageHeader?: React.ReactNode; // 页面标题上方区域
  pageFooter?: React.ReactNode; // 页面底部区域
  pageTitle?: React.ReactNode; // 页面标题
  pageAsideTop?: React.ReactNode;
  pageAsideBottom?: React.ReactNode;
  pageCover?: React.ReactNode; // 页面封面

  hideBlockId?: boolean; // 是否隐藏块ID
  disableHeader?: boolean; // 是否禁用头部

  children?: React.ReactNode;
}

/**
 * 目录缩进级别缓存
 * 用于存储块的缩进级别
 */
const tocIndentLevelCache: Record<string, number> = {};

/**
 * 页面封面样式缓存
 * 用于缓存不同位置的封面样式
 */
const pageCoverStyleCache: Record<string, object> = {};

/**
 * 页面链接属性接口
 */
interface PageLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className: string;
  href: string;
  children?: React.ReactNode;
  style?: any;
}

/**
 * 标题属性接口
 */
interface HeaderProps {
  block: types.Block;
}

/**
 * 集合属性接口
 */
interface CollectionProps {
  block: types.Block;
  className?: string;
  ctx: NotionContext;
}

/**
 * 复选框属性接口
 */
interface CheckboxProps {
  isChecked: boolean;
  blockId: string;
}

/**
 * Notion组件类型接口
 */
interface NotionComponents {
  Link: React.FC<PageLinkProps>;
  PageLink: React.FC<PageLinkProps>;
  Embed: React.FC<{ block: types.Block }>;
  Collection: React.FC<CollectionProps>;
  Equation: React.FC<{ block: types.EquationBlock; className?: string }>;
  Code: React.FC<{ block: types.CodeBlock }>;
  Checkbox: React.FC<CheckboxProps>;
  Header: React.FC<HeaderProps>;
  Callout?: React.FC<{ block: types.Block; className?: string }>;
}

/**
 * Notion上下文接口
 */
interface NotionContext {
  components: NotionComponents;
  fullPage?: boolean;
  darkMode?: boolean;
  recordMap: types.ExtendedRecordMap;
  mapPageUrl: (pageId: string) => string;
  mapImageUrl: (url: string, block: types.Block) => string;
  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;
  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;
}

/**
 * Notion块渲染组件
 * 负责根据不同的块类型渲染对应的内容
 */
export const Block: React.FC<BlockProps> = (props) => {
  const ctx = useNotionContext();
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition,
  } = ctx;

  // 当前活动的目录项
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const {
    block,
    children,
    level,
    className,
    bodyClassName,
    header,
    footer,
    pageHeader,
    pageFooter,
    pageTitle,
    pageAsideTop,
    pageAsideBottom,
    pageCover,
    hideBlockId,
    disableHeader,
  } = props;

  // 如果块不存在，返回null
  if (!block) {
    return null;
  }

  // 处理集合视图页面
  if (level === 0 && block.type === "collection_view") {
    (block as any).type = "collection_view_page";
  }

  // 生成块ID
  const blockId = hideBlockId ? "notion-block" : `notion-block-${uuidToId(block.id)}`;

  // 根据块类型渲染对应内容
  switch (block.type) {
    case "page":
    case "collection_view_page": // 页面块和集合视图页面块
      return level === 0 ? renderFullPage() : renderPageLink();

    case "header": // h1级标题
    case "sub_header": // h2级标题
    case "sub_sub_header": // h3级标题
      return renderHeader();

    case "divider": // 分割线
      return <hr className={cs("notion-hr", blockId)} />;

    case "text": {
      // 文本块,包含普通文本和富文本
      if (!block.properties && !block.content?.length) {
        return <div className={cs("notion-blank", blockId)}>&nbsp;</div>;
      }

      const blockColor = block.format?.block_color;
      return (
        <div className={cs("notion-text", blockColor && `notion-${blockColor}`, blockId)}>
          {block.properties?.title && <Text value={block.properties.title} block={block} />}
          {children && <div className="notion-text-children">{children}</div>}
        </div>
      );
    }

    case "bulleted_list": // 无序列表
    case "numbered_list": {
      // 有序列表
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === "bulleted_list" ? (
          <ul className={cs("notion-list", "notion-list-disc", blockId)}>{content}</ul>
        ) : (
          <ol start={start} className={cs("notion-list", "notion-list-numbered", blockId)}>
            {content}
          </ol>
        );

      const output = block.content ? (
        <>
          {block.properties && (
            <li>
              <Text value={block.properties.title} block={block} />
            </li>
          )}
          {wrapList(children)}
        </>
      ) : block.properties ? (
        <li>
          <Text value={block.properties.title} block={block} />
        </li>
      ) : null;

      const isTopLevel = block.type !== recordMap.block[block.parent_id]?.value?.type;
      const start = getListNumber(block.id, recordMap.block);
      return isTopLevel ? wrapList(output, start) : output;
    }
    case "embed": // 嵌入块,用于嵌入外部内容
      return <components.Embed block={block} />;

    case "audio": // 音频块
      return <Audio block={block as types.AudioBlock} />;

    case "file": // 文件块
      return <File block={block as types.FileBlock} className={blockId} />;

    case "equation": // 数学公式块
      return <components.Equation block={block as types.EquationBlock} className={blockId} />;

    case "code": // 代码块
      return <components.Code block={block as types.CodeBlock} />;

    case "column_list": // 分栏布局块
      return <div className={cs("notion-row", blockId)}>{children}</div>;

    case "quote": {
      // 引用块
      if (!block.properties) return null;
      const blockColor = block.format?.block_color;
      return (
        <blockquote className={cs("notion-quote", blockColor && `notion-${blockColor}`, blockId)}>
          <div>
            <Text value={block.properties.title} block={block} />
          </div>
          {children}
        </blockquote>
      );
    }

    case "collection_view": // 数据库视图块
      return <components.Collection block={block} className={blockId} ctx={ctx} />;

    case "callout": // 标注块,用于突出显示内容
      return components.Callout ? (
        <components.Callout block={block} className={blockId} />
      ) : (
        <div
          className={cs(
            "notion-callout",
            block.format?.block_color && `notion-${block.format?.block_color}_co`,
            blockId
          )}
        >
          <PageIcon block={block} />
          <div className="notion-callout-text">
            <Text value={block.properties?.title} block={block} />
            {children}
          </div>
        </div>
      );

    case "bookmark": {
      // 书签块,用于保存外部链接
      if (!block.properties) return null;
      const link = block.properties.link;
      if (!link || !link[0]?.[0]) return null;

      let title = getTextContent(block.properties.title) || getTextContent(link);
      if (title.startsWith("http")) {
        try {
          title = new URL(title).hostname;
        } catch (err) {
          // ignore invalid links
        }
      }

      return (
        <div className="notion-row">
          <components.Link
            target="_blank"
            rel="noopener noreferrer"
            className={cs(
              "notion-bookmark",
              block.format?.block_color && `notion-${block.format.block_color}`,
              blockId
            )}
            href={link[0][0]}
          >
            <div>
              {title && (
                <div className="notion-bookmark-title">
                  <Text value={[[title]]} block={block} />
                </div>
              )}
              {block.properties?.description && (
                <div className="notion-bookmark-description">
                  <Text value={block.properties?.description} block={block} />
                </div>
              )}
              <div className="notion-bookmark-link">
                {block.format?.bookmark_icon && (
                  <div className="notion-bookmark-link-icon">
                    <LazyImage src={mapImageUrl(block.format?.bookmark_icon, block)} alt={title} />
                  </div>
                )}
                <div className="notion-bookmark-link-text">
                  <Text value={link} block={block} />
                </div>
              </div>
            </div>
            {block.format?.bookmark_cover && (
              <div className="notion-bookmark-image">
                <LazyImage
                  src={mapImageUrl(block.format?.bookmark_cover, block)}
                  alt={getTextContent(block.properties?.title)}
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </components.Link>
        </div>
      );
    }

    case "toggle": // 折叠块
      return (
        <details className={cs("notion-toggle", blockId)}>
          <summary>
            <Text value={block.properties?.title} block={block} />
          </summary>
          <div>{children}</div>
        </details>
      );

    case "table_of_contents": {
      // 目录块
      const page = getBlockParentPage(block, recordMap) as types.PageBlock | null;
      if (!page) return null;

      const toc = getPageTableOfContents(page, recordMap);
      const blockColor = block.format?.block_color;

      return (
        <div
          className={cs("notion-table-of-contents", blockColor && `notion-${blockColor}`, blockId)}
        >
          {toc.map((tocItem) => (
            <a
              key={tocItem.id}
              href={`#${uuidToId(tocItem.id)}`}
              className="notion-table-of-contents-item"
            >
              <span
                className="notion-table-of-contents-item-body"
                style={{
                  display: "inline-block",
                  marginLeft: tocItem.indentLevel * 24,
                }}
              >
                {tocItem.text}
              </span>
            </a>
          ))}
        </div>
      );
    }

    case "to_do": {
      // 待办事项块
      const isChecked = block.properties?.checked?.[0]?.[0] === "Yes";
      return (
        <div className={cs("notion-to-do", blockId)}>
          <div className="notion-to-do-item">
            <components.Checkbox blockId={blockId} isChecked={isChecked} />
            <div className={cs("notion-to-do-body", isChecked && `notion-to-do-checked`)}>
              <Text value={block.properties?.title} block={block} />
            </div>
          </div>
          <div className="notion-to-do-children">{children}</div>
        </div>
      );
    }

    case "transclusion_container": // 同步容器块
      return <div className={cs("notion-sync-block", blockId)}>{children}</div>;
    case "transclusion_reference": // 同步引用块
      return <SyncPointerBlock {...props} />;

    case "alias": {
      // 别名块,用于引用其他页面
      const blockPointerId = block?.format?.alias_pointer?.id;
      const linkedBlock = recordMap.block[blockPointerId]?.value;
      if (!linkedBlock) {
        console.log('"alias" missing block', blockPointerId);
        return null;
      }

      return (
        <components.PageLink
          className={cs("notion-page-link", blockPointerId)}
          href={mapPageUrl(blockPointerId)}
        >
          <PageTitle block={linkedBlock} />
        </components.PageLink>
      );
    }

    case "table": // 表格块
      return (
        <table className={cs("notion-simple-table", blockId)}>
          <tbody>{children}</tbody>
        </table>
      );

    case "table_row": {
      // 表格行
      const tableBlock = recordMap.block[block.parent_id]?.value as types.TableBlock;
      const order = tableBlock.format?.table_block_column_order;
      const formatMap = tableBlock.format?.table_block_column_format;
      const backgroundColor = block.format?.block_color;

      if (!tableBlock || !order) {
        return null;
      }

      return (
        <tr
          className={cs(
            "notion-simple-table-row",
            backgroundColor && `notion-${backgroundColor}`,
            blockId
          )}
        >
          {order.map((column) => {
            const color = formatMap?.[column]?.color;
            return (
              <td
                key={column}
                className={color ? `notion-${color}` : ""}
                style={{ width: formatMap?.[column]?.width || 120 }}
              >
                <div className="notion-simple-table-cell">
                  <Text value={block.properties?.[column] || [["ㅤ"]]} block={block} />
                </div>
              </td>
            );
          })}
        </tr>
      );
    }

    case "external_object_instance": // 外部对象实例块
      return <EOI block={block} className={blockId} />;

    default:
      if (process.env.NODE_ENV !== "production") {
        console.log("Unsupported type " + (block as any).type, JSON.stringify(block, null, 2));
      }
      return <div />;
  }

  /**
   * 渲染完整页面
   */
  function renderFullPage(): React.ReactNode {
    const {
      page_icon = defaultPageIcon,
      page_cover = defaultPageCover,
      page_cover_position = defaultPageCoverPosition,
      page_full_width,
      page_small_text,
    } = block.format || {};

    if (fullPage) {
      const properties =
        block.type === "page"
          ? block.properties
          : ({
              title:
                recordMap.collection[getBlockCollectionId(block, recordMap) || ""]?.value?.name ||
                [],
            } as types.PropertyMap);

      const coverPosition = (1 - (page_cover_position || 0.5)) * 100;
      const pageCoverObjectPosition = `center ${coverPosition}%`;
      let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition];
      if (!pageCoverStyle) {
        pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
          objectPosition: pageCoverObjectPosition,
        };
      }

      const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon;
      const isPageIconUrl = pageIcon && isUrl(pageIcon);

      const toc = getPageTableOfContents(block as types.PageBlock, recordMap);

      const hasToc = showTableOfContents && toc.length >= minTableOfContentsItems;
      // const hasAside = (hasToc || pageAsideTop || pageAsideBottom) && !page_full_width;
      const hasAside = hasToc || pageAsideTop || pageAsideBottom;
      const hasPageCover = pageCover || page_cover;

      return (
        <div
          className={cs(
            "notion",
            "notion-app",
            darkMode ? "dark-mode" : "light-mode",
            blockId,
            className
          )}
        >
          <div className="notion-viewport" />

          <div className="notion-frame">
            {!disableHeader && <components.Header block={block} />}
            {header}

            <div className="notion-page-scroller">
              {hasPageCover &&
                (pageCover ? (
                  pageCover
                ) : (
                  <div className="notion-page-cover-wrapper">
                    <LazyImage
                      src={mapImageUrl(page_cover, block)}
                      alt={getTextContent(properties?.title) || ""}
                      priority={true}
                      className="notion-page-cover"
                      style={pageCoverStyle as React.CSSProperties}
                    />
                  </div>
                ))}

              <main
                className={cs(
                  "notion-page",
                  hasPageCover ? "notion-page-has-cover" : "notion-page-no-cover",
                  page_icon ? "notion-page-has-icon" : "notion-page-no-icon",
                  isPageIconUrl ? "notion-page-has-image-icon" : "notion-page-has-text-icon",
                  "notion-full-page",
                  page_full_width && "notion-full-width",
                  page_small_text && "notion-small-text",
                  bodyClassName
                )}
              >
                {page_icon && (
                  <PageIcon block={block} defaultIcon={defaultPageIcon} inline={false} />
                )}

                {pageHeader}

                <h1 className="notion-title">
                  {pageTitle ?? <Text value={block.properties?.title} block={block} />}
                </h1>

                {(block.type === "collection_view_page" ||
                  (block.type === "page" && block.parent_table === "collection")) && (
                  <components.Collection block={block} ctx={ctx} />
                )}

                {block.type !== "collection_view_page" && (
                  <div
                    className={cs(
                      "notion-page-content",
                      hasAside ? "notion-page-content-has-aside" : "",
                      hasToc ? "notion-page-content-has-toc" : ""
                    )}
                  >
                    <article className="notion-page-content-inner">{children}</article>

                    {hasAside && (
                      <PageAside
                        toc={toc}
                        activeSection={activeSection}
                        setActiveSection={(section: string | null) => setActiveSection(section)}
                        hasToc={!!hasToc}
                        hasAside={!!hasAside}
                        pageAsideTop={pageAsideTop}
                        pageAsideBottom={pageAsideBottom}
                      />
                    )}
                  </div>
                )}

                {pageFooter}
              </main>

              {footer}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <main
          className={cs(
            "notion",
            darkMode ? "dark-mode" : "light-mode",
            "notion-page",
            page_full_width && "notion-full-width",
            page_small_text && "notion-small-text",
            blockId,
            className,
            bodyClassName
          )}
        >
          <div className="notion-viewport" />

          {pageHeader}

          {(block.type === "collection_view_page" ||
            (block.type === "page" && block.parent_table === "collection")) && (
            <components.Collection block={block} ctx={ctx} />
          )}

          {block.type !== "collection_view_page" && children}

          {pageFooter}
        </main>
      );
    }
  }

  /**
   * 渲染页面链接
   */
  function renderPageLink(): React.ReactNode {
    const blockColor = block.format?.block_color;

    return (
      <components.PageLink
        className={cs("notion-page-link", blockColor && `notion-${blockColor}`, blockId)}
        href={mapPageUrl(block.id)}
      >
        <PageTitle block={block} />
      </components.PageLink>
    );
  }

  /**
   * 渲染标题
   */
  function renderHeader(): React.ReactNode {
    if (!block.properties) return null;

    const blockColor = block.format?.block_color;
    const id = uuidToId(block.id);
    const title = getTextContent(block.properties.title) || `Notion Header ${id}`;

    // we use a cache here because constructing the ToC is non-trivial
    let indentLevel = tocIndentLevelCache[block.id];
    let indentLevelClass = "";

    if (indentLevel === undefined) {
      const page = getBlockParentPage(block, recordMap) as types.PageBlock | null;

      if (page) {
        const toc = getPageTableOfContents(page, recordMap);
        const tocItem = toc.find((tocItem) => tocItem.id === block.id);

        if (tocItem) {
          indentLevel = tocItem.indentLevel;
          tocIndentLevelCache[block.id] = indentLevel;
        }
      }
    }

    if (indentLevel !== undefined) {
      indentLevelClass = `notion-h-indent-${indentLevel}`;
    }

    const isH1 = block.type === "header";
    const isH2 = block.type === "sub_header";
    const isH3 = block.type === "sub_sub_header";

    const classNameStr = cs(
      isH1 && "notion-h notion-h1",
      isH2 && "notion-h notion-h2",
      isH3 && "notion-h notion-h3",
      blockColor && `notion-${blockColor}`,
      indentLevelClass,
      blockId
    );

    const innerHeader = (
      <span>
        <div id={id} className="notion-header-anchor" />
        {!block.format?.toggleable && (
          <a className="notion-hash-link" href={`#${id}`} title={title}>
            <LinkIcon />
          </a>
        )}

        <span className="notion-h-title">
          <Text value={block.properties.title} block={block} />
        </span>
      </span>
    );
    let headerBlock = null;

    //page title takes the h1 so all header blocks are greater
    if (isH1) {
      headerBlock = (
        <h2 className={classNameStr} data-id={id}>
          {innerHeader}
        </h2>
      );
    } else if (isH2) {
      headerBlock = (
        <h3 className={classNameStr} data-id={id}>
          {innerHeader}
        </h3>
      );
    } else {
      headerBlock = (
        <h4 className={classNameStr} data-id={id}>
          {innerHeader}
        </h4>
      );
    }

    if (block.format?.toggleable) {
      return (
        <details className={cs("notion-toggle", blockId)}>
          <summary>{headerBlock}</summary>
          <div>{children}</div>
        </details>
      );
    } else {
      return headerBlock;
    }
  }
};
