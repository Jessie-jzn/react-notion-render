import * as React from "react";
import mediumZoom from "@fisch0920/medium-zoom";
import { ExtendedRecordMap } from "notion-types";
import { NotionContextProvider } from "./context";
import { NotionBlockRenderer } from "./NotionBlockRenderer";
import {
  MapImageUrlFn,
  MapPageUrlFn,
  NotionComponents,
  SearchNotionFn,
} from "./types";

/**
 * Notion页面渲染器组件
 * 负责渲染整个Notion页面的内容
 */
export const NotionRenderer: React.FC<{
  recordMap: ExtendedRecordMap;
  components?: Partial<NotionComponents>;
  mapPageUrl?: MapPageUrlFn;
  mapImageUrl?: MapImageUrlFn;
  searchNotion?: SearchNotionFn;
  isShowingSearch?: boolean;
  onHideSearch?: () => void;
  rootPageId?: string;
  rootDomain?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  forceCustomImages?: boolean;
  showCollectionViewDropdown?: boolean;
  linkTableTitleProperties?: boolean;
  isLinkCollectionToUrlProperty?: boolean;
  isImageZoomable?: boolean;
  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;
  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;
  className?: string;
  bodyClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  pageHeader?: React.ReactNode;
  pageFooter?: React.ReactNode;
  pageTitle?: React.ReactNode;
  pageAside?: React.ReactNode;
  pageCover?: React.ReactNode;
  blockId?: string;
  hideBlockId?: boolean;
  disableHeader?: boolean;
}> = ({
  components,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  searchNotion,
  isShowingSearch,
  onHideSearch,
  fullPage,
  rootPageId,
  rootDomain,
  darkMode,
  previewImages,
  forceCustomImages,
  showCollectionViewDropdown,
  linkTableTitleProperties,
  isLinkCollectionToUrlProperty,
  isImageZoomable = true,
  showTableOfContents,
  minTableOfContentsItems,
  defaultPageIcon,
  defaultPageCover,
  defaultPageCoverPosition,
  ...rest
}) => {
  // Memoize the mediumZoom instance to avoid unnecessary re-renders
  const zoom = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      mediumZoom({
        background: "rgba(0, 0, 0, 0.8)",
        minZoomScale: 2.0,
        margin: getMediumZoomMargin(),
      }),
    []
  );

  return (
    <NotionContextProvider
      components={components}
      recordMap={recordMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImageUrl}
      searchNotion={searchNotion}
      isShowingSearch={isShowingSearch}
      onHideSearch={onHideSearch}
      fullPage={fullPage}
      rootPageId={rootPageId}
      rootDomain={rootDomain}
      darkMode={darkMode}
      previewImages={previewImages}
      forceCustomImages={forceCustomImages}
      showCollectionViewDropdown={showCollectionViewDropdown}
      linkTableTitleProperties={linkTableTitleProperties}
      isLinkCollectionToUrlProperty={isLinkCollectionToUrlProperty}
      showTableOfContents={showTableOfContents}
      minTableOfContentsItems={minTableOfContentsItems}
      defaultPageIcon={defaultPageIcon}
      defaultPageCover={defaultPageCover}
      defaultPageCoverPosition={defaultPageCoverPosition}
      zoom={isImageZoomable ? zoom : null}
    >
      <NotionBlockRenderer {...rest} />
    </NotionContextProvider>
  );
};

// Helper function to determine the margin for mediumZoom based on window width
function getMediumZoomMargin() {
  const width = window.innerWidth;

  if (width < 500) {
    return 8;
  } else if (width < 800) {
    return 20;
  } else if (width < 1280) {
    return 30;
  } else if (width < 1600) {
    return 40;
  } else if (width < 1920) {
    return 48;
  } else {
    return 72;
  }
}
