# Changelog

All notable changes to this project will be documented in this file.

## [1.0.19] - 2024-01-07

### Changed

- 优化样式加载策略
  - 核心样式 `styles.css` 现在会打包进 JS 中自动加载
  - 主题样式 `prism-theme.css` 改为单独打包，支持按需加载
- 更新 webpack 配置
  - 修改 CSS 加载器配置，区分核心样式和主题样式
  - 主题文件现在会打包到 `dist/themes/` 目录

## [1.0.14] - 2024-01-07

### Added

- 新增图标类型定义文件
  - 添加 `property-icon.d.ts`
  - 添加 `type-multi-select.d.ts`
  - 添加 `type-github.d.ts`
  - 添加 `type-formula.d.ts`
  - 添加 `type-file.d.ts`
  - 添加 `type-email.d.ts`
  - 添加 `type-date.d.ts`
  - 添加 `type-checkbox.d.ts`
  - 添加 `collection-view-icon.d.ts`
  - 添加 `collection-view-board.d.ts`
  - 添加 `collection-view-calendar.d.ts`
  - 添加 `collection-view-gallery.d.ts`
  - 添加 `collection-view-table.d.ts`

### Changed

- 优化项目结构
  - 重构 `src/styles` 目录结构
  - 更新 `webpack.config.cjs` 构建配置
  - 优化 `dist` 目录组织

### Development

- 添加示例代码
  - 新增 `examples/index.tsx` 示例入口
  - 新增 `examples/recordMap.json` 示例数据
- 更新项目配置
  - 添加 `.npmrc` 配置文件
  - 更新 `.npmignore` 规则

## [1.0.12] - 2024-01-06

### Changed

- 优化构建配置
- 修复依赖问题
- 完善示例代码

## [1.0.11] - 2024-01-06

### Changed

- 更新 test:eslint 脚本配置
- 优化 test:prettier 脚本配置
- 调整 ESLint 规则配置
- 降级 TypeScript 到官方支持的版本

### Added

- 添加 ESLint 配置文件
- 添加 .eslintignore 配置
- 优化 ESLint 检查规则
- 添加 Prettier 配置文件
- 添加 .prettierignore 配置

## [1.0.6] - 2025-01-06

### Changed

- 优化构建配置，完善示例文件夹排除规则
- 更新 webpack 配置以排除 src/examples 目录
- 更新 tsconfig.json 排除规则
- 优化 .npmignore 配置，确保示例代码不被发布

### Added

- 添加 ESLint 配置和依赖
- 添加 Prettier 配置和依赖

## [1.0.4] - 2025-01-06

### Changed

- 重新添加 react-image 依赖
- 修复图片组件依赖问题
- 优化 webpack externals 配置
- 添加 Node.js 版本要求

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
