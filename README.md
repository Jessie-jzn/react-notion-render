<p align="center">
  <img alt="React Notion Simplify" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# React Notion Simplify

一个快速、准确的 Notion 页面 React 渲染器

<p>
  <a href="https://www.npmjs.com/package/react-notion-simplify">
    <img src="https://img.shields.io/npm/v/react-notion-simplify.svg" alt="NPM">
  </a>
  <a href="https://github.com/Jessie-jzn/react-notion-simplify">
    <img src="https://img.shields.io/github/stars/Jessie-jzn/react-notion-simplify?style=social" alt="GitHub">
  </a>
  <a href="https://prettier.io">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" alt="Prettier Code Formatting">
  </a>
</p>

## 项目说明

本项目是基于 [NotionX/react-notion-x](https://github.com/NotionX/react-notion-x) 的改进版本。由于原项目已不再维护，我们在其基础上进行了以下优化：

- ✨ 提供更多配置选项
- 🛠️ 修复原项目中的已知问题
- 🔄 持续更新维护
- 📦 更好的打包优化
- 🎯 更友好的中文支持

## 特性

- 🚀 高性能渲染
- 🎯 准确还原 Notion 页面样式和交互
- 💪 TypeScript 支持
- 🎨 可自定义样式
- 📱 响应式设计
- 🖼️ 支持图片懒加载
- 🔗 支持内部链接
- 📑 支持目录导航

## 安装

```bash
npm install react-notion-simplify
# 或者
yarn add react-notion-simplify
```

## 与原版的主要区别

1. **更多配置项**

   - 支持自定义主题
   - 可配置的图片加载行为
   - 灵活的布局选项

2. **性能优化**

   - 优化了大型页面的渲染性能
   - 改进了图片加载策略
   - 减小了包体积

3. **Bug 修复**

   - 修复了原版中的已知问题
   - 提高了稳定性

## 配置选项

| 属性                       | 类型      | 默认值   | 描述                     |
| -------------------------- | --------- | -------- | ------------------------ |
| recordMap                  | RecordMap | required | Notion 页面数据          |
| fullPage                   | boolean   | false    | 是否渲染完整页面         |
| darkMode                   | boolean   | false    | 是否启用暗色模式         |
| previewImages              | boolean   | true     | 是否预览图片             |
| showCollectionViewDropdown | boolean   | true     | 是否显示集合视图下拉菜单 |
| showTableOfContents        | boolean   | false    | 是否显示目录             |
| customTheme                | object    | {}       | 自定义主题配置           |
| imageOptions               | object    | {}       | 图片加载配置             |

## 自定义样式

你可以通过以下方式自定义样式：

```css
/* 覆盖默认样式 */
.notion-page {
  padding: 2em;
}
.notion-title {
  font-size: 2.5em;
}
```

## 常见问题

1. **如何获取 recordMap？**

   - 可以通过 Notion API 获取
   - 或使用 `notion-client` 包

2. **支持哪些 Notion 块类型？**

   - 文本块
   - 图片
   - 代码块
   - 表格
   - 列表
   - 等等...

## 使用说明

### 基础使用

```jsx
import { NotionRenderer } from "react-notion-simplify";
import { NotionAPI } from "notion-client";

// 基础样式已内置，无需额外引入
const MyNotionPage = ({ pageId }) => {
  const [recordMap, setRecordMap] = useState(null);

  useEffect(() => {
    const notion = new NotionAPI();
    notion.getPage(pageId).then(setRecordMap);
  }, [pageId]);

  return recordMap ? <NotionRenderer recordMap={recordMap} /> : null;
};
```

### 样式引入

```jsx
// 核心样式已内置，无需额外引入
import { NotionRenderer } from "react-notion-simplify";

// 如果需要代码高亮功能，需要单独引入主题样式
import "react-notion-simplify/dist/themes/prism-theme.css";
```

## 样式定制

### 默认样式

包已经内置了核心样式，无需额外引入。这包括：

- 基础布局
- 文本样式
- 响应式设计
- 等等

### 主题定制

1. **使用预设主题**

```jsx
<NotionRenderer
  recordMap={recordMap}
  darkMode={true} // 启用暗色主题
/>
```
