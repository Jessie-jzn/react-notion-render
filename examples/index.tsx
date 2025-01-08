import React from "react";
import { createRoot } from "react-dom/client";
import { NotionRenderer } from "../src";
import recordMapData from "./recordMap.json";
import PageAsideTop from "./pageAsideTop";
// import "./notion.css";

const App = () => {
  return (
    <div style={{ maxWidth: "100vw", margin: "0 auto", padding: "20px" }}>
      <h1>React Notion Simplify Demo</h1>
      <div style={{ marginTop: "20px" }}>
        <NotionRenderer
          recordMap={recordMapData}
          fullPage={true}
          darkMode={false}
          previewImages={true}
          showTableOfContents={true}
          pageAsideTop={<PageAsideTop />}
          pageAsideBottom={<PageAsideTop />}
        />
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find root element");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
