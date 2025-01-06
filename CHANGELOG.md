# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2025-01-06

### Changed

- 修复 page-aside 组件中的 throttle 依赖问题
- 重新添加 lodash.throttle 依赖

## [1.0.1] - 2025-01-06

### Changed

- 优化包体积，减少依赖项
- 将 katex 和 prismjs 移至 peerDependencies
- 添加 optionalDependencies 分类
- 启用 Tree Shaking 优化
- 优化 webpack 构建配置
- 改进 CSS 模块化配置

### Added

- 添加 sideEffects 配置以支持 Tree Shaking
- 新增 TerserPlugin 压缩优化
- 完善 .npmignore 配置

### Removed

- 移除未使用的依赖项
  - format-number
  - p-map
  - react-modal
  - lodash.throttle
  - react-image

## [1.0.0] - 2025-01-06

### Added

- 初始版本发布
- 支持基础 Notion 块渲染
- 支持自定义主题
- 支持响应式设计
- TypeScript 支持
- 完整的类型定义
- webpack 和 TypeScript 构建配置
- 基础组件实现
  - 文本渲染
  - 页面图标
  - 标题组件
  - 代码块
  - 图片处理
  - LaTeX 公式

### Features

- 高性能渲染
- 准确还原 Notion 页面样式和交互
- 可自定义样式
- 支持图片懒加载
- 支持内部链接
- 支持目录导航
