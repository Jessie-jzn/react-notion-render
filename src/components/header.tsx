import * as React from "react";

import * as types from "notion-types";
import { useNotionContext } from "../context";
import { cs } from "../utils";

/**
 * Header组件属性接口
 */
interface HeaderProps {
  block: types.Block;
}

/**
 * Notion页面头部组件
 */
export const Header: React.FC<HeaderProps> = ({ block }) => {
  const { components } = useNotionContext();

  return (
    <header className="notion-header">
      <div className="notion-nav-header">
        {components.PageAside && <components.PageAside block={block} />}
      </div>
    </header>
  );
};

// 确保导出默认组件
export default Header;
