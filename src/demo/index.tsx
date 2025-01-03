import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { NotionRenderer } from "../NotionRenderer";
import NotionService from "../services/NotionService";
import "../../src/notion.css";
const notionService = new NotionService();

/**
 * Notion渲染器演示组件
 * 用于展示Notion页面渲染效果
 */
const Demo = () => {
  const [recordMap, setRecordMap] = useState(null);

  useEffect(() => {
    // 指定要渲染的Notion页面ID
    const pageId = "46bd7000f4f345d7a338cc796a37e1b7";

    // 获取页面数据
    notionService
      .getPage(pageId)
      .then((data) => setRecordMap(data))
      .catch(console.error);
  }, []);

  if (!recordMap) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Notion Renderer Demo</h1>
      <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Demo />);
}
