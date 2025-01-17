import * as React from "react";

import throttle from "lodash.throttle";
import { TableOfContentsEntry, uuidToId } from "notion-utils";

import { cs } from "../utils";

// 定义 PageAside 组件的属性接口
export const PageAside: React.FC<{
  toc: Array<TableOfContentsEntry>; // 目录条目数组
  activeSection: string | null; // 当前激活的章节
  setActiveSection: (activeSection: string | null) => unknown; // 设置激活章节的函数
  hasToc: boolean; // 是否显示目录
  hasAside: boolean; // 是否显示侧边栏
  pageAsideTop?: React.ReactNode; // 目录上方的自定义内容
  pageAsideBottom?: React.ReactNode; // 目录下方的自定义内容
  className?: string; // 自定义类名
  tocTitle?: string;
}> = ({
  toc,
  activeSection,
  setActiveSection,
  pageAsideTop,
  pageAsideBottom,
  hasToc,
  hasAside,
  className,
  tocTitle = "Table of Contents",
}) => {
  const [isFloatingTocOpen, setIsFloatingTocOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(true);

  const throttleMs = 1000;
  // 创建节流函数用于处理滚动监听
  const actionSectionScrollSpy = React.useMemo(
    () =>
      throttle(() => {
        // 获取所有标题元素
        const sections = document.getElementsByClassName("notion-h");

        let prevBBox: DOMRect = null;
        let currentSectionId = activeSection;

        // 遍历所有标题元素
        for (let i = 0; i < sections.length; ++i) {
          const section = sections[i];
          if (!section || !(section instanceof Element)) continue;

          if (!currentSectionId) {
            currentSectionId = section.getAttribute("data-id");
          }

          // 获取元素的位置信息
          const bbox = section.getBoundingClientRect();
          const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0;
          const offset = Math.max(150, prevHeight / 4);

          // 检查元素是否在视口中
          if (bbox.top - offset < 0) {
            currentSectionId = section.getAttribute("data-id");

            prevBBox = bbox;
            continue;
          }

          // 如果找到最后一个可见元素，退出循环
          break;
        }

        setActiveSection(currentSectionId);
      }, throttleMs),
    [activeSection, setActiveSection]
  );

  // 添加滚动事件监听器
  React.useEffect(() => {
    if (!hasToc) {
      return;
    }

    window.addEventListener("scroll", actionSectionScrollSpy);

    // 初始化时执行一次
    actionSectionScrollSpy();

    // 清理函数
    return () => {
      window.removeEventListener("scroll", actionSectionScrollSpy);
    };
  }, [hasToc, actionSectionScrollSpy]);

  // 检测屏幕尺寸
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1000); // 768px 作为断点
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notion-floating-toc-wrapper")) {
        setIsFloatingTocOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobile]);

  const renderTableOfContents = () => (
    <div className="notion-aside-table-of-contents">
      <div className="notion-aside-table-of-contents-header">{tocTitle}</div>
      <nav className="notion-table-of-contents">
        {toc.map((tocItem) => {
          const id = uuidToId(tocItem.id);
          return (
            <a
              key={id}
              href={`#${id}`}
              className={cs(
                "notion-table-of-contents-item",
                `notion-table-of-contents-item-indent-level-${tocItem.indentLevel}`,
                activeSection === id && "notion-table-of-contents-active-item"
              )}
              onClick={() => isMobile && setIsFloatingTocOpen(false)}
            >
              <span
                className="notion-table-of-contents-item-body"
                style={{
                  display: "inline-block",
                  marginLeft: tocItem.indentLevel * 16,
                }}
              >
                {tocItem.text}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );

  // 如果没有侧边栏，返回 null
  if (!hasAside) {
    return null;
  }

  if (isMobile) {
    return (
      hasToc && (
        <div
          className="notion-floating-toc-wrapper"
          // // 移动端不需要鼠标悬停事件
          // onMouseEnter={() => setIsFloatingTocOpen(true)}
          // onMouseLeave={() => setIsFloatingTocOpen(false)}
        >
          <div
            className="notion-floating-toc-button"
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              setIsFloatingTocOpen(!isFloatingTocOpen);
            }}
          >
            <div className="notion-floating-toc-button-icon">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          {isFloatingTocOpen && (
            <div
              className="notion-floating-toc-container"
              onClick={(e) => e.stopPropagation()} // 防止点击内容时关闭
            >
              {renderTableOfContents()}
            </div>
          )}
        </div>
      )
    );
  }

  return (
    <aside className={cs("notion-aside", className)}>
      {pageAsideTop}

      {hasToc && renderTableOfContents()}

      {pageAsideBottom}
    </aside>
  );
};
