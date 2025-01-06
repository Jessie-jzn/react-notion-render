import * as React from "react";
import { Block } from "./block";
import { useNotionContext } from "./context";

// NotionBlockRenderer component is responsible for rendering individual blocks within a Notion page.
export const NotionBlockRenderer: React.FC<{
  className?: string;
  bodyClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disableHeader?: boolean;
  blockId?: string;
  hideBlockId?: boolean;
  level?: number;
}> = ({ level = 0, blockId, ...props }) => {
  const { recordMap } = useNotionContext();
  const id = blockId || Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  if (!block) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("missing block", blockId);
    }

    return null;
  }

  return (
    <Block key={id} level={level} block={block} {...props}>
      {block?.content?.map((contentBlockId) => (
        <NotionBlockRenderer
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </Block>
  );
};
