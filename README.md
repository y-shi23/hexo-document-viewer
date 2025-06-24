# Hexo Document Viewer Plugin

一个用于在 Hexo 博客中嵌入和预览文档的插件，支持 PDF、Word、Excel、PowerPoint 等多种格式。

## 功能特性

- 📄 支持多种文档格式：PDF、DOC/DOCX、XLS/XLSX、PPT/PPTX、TXT
- 🎨 美观的界面设计，支持暗色主题
- 📱 响应式设计，移动端友好
- ⚡ 自动注入 CSS 和 JavaScript，无需手动配置
- 🔧 灵活的参数配置
- 🌐 支持在线文档查看器（Microsoft Office Online、Google Docs）

## 安装

### 方法一：NPM 安装（推荐）

```bash
npm install hexo-document-viewer --save
```

### 方法二：手动安装

1. 将插件文件复制到 `node_modules/hexo-document-viewer/` 目录
2. 在博客根目录的 `package.json` 中添加依赖：

```json
{
  "dependencies": {
    "hexo-document-viewer": "^1.0.0"
  }
}
```

## 使用方法

### 基本用法

在 Markdown 文件中使用 `document_viewer` 标签：

```markdown
{% document_viewer https://example.com/document.pdf %}
```

### 高级用法

```markdown
{% document_viewer https://example.com/document.pdf type=pdf width=100% height=800px title=我的PDF文档 %}
```

### 参数说明

| 参数 | 说明 | 默认值 | 示例 |
|------|------|--------|---------|
| `url` | 文档URL（必需） | - | `https://example.com/doc.pdf` |
| `type` | 文件类型 | 自动检测 | `pdf`, `docx`, `xlsx`, `pptx`, `txt` |
| `width` | 查看器宽度 | `100%` | `800px`, `90%` |
| `height` | 查看器高度 | `600px` | `500px`, `80vh` |
| `title` | 显示标题 | `文档预览` | `我的文档` |

### 使用示例

#### PDF 文档
```markdown
{% document_viewer /assets/manual.pdf title=用户手册 height=700px %}
```

#### Word 文档
```markdown
{% document_viewer https://example.com/report.docx type=docx title=项目报告 %}
```

#### Excel 表格
```markdown
{% document_viewer /data/statistics.xlsx width=90% height=500px title=数据统计 %}
```

#### PowerPoint 演示文稿
```markdown
{% document_viewer https://example.com/presentation.pptx title=产品介绍 %}
```

#### 文本文件
```markdown
{% document_viewer /logs/system.txt type=txt height=400px title=系统日志 %}
```

## 支持的文件格式

### PDF 文件
- 使用浏览器内置 PDF 查看器
- 支持缩放、搜索等功能

### Office 文档
- **Word**: `.doc`, `.docx`
- **Excel**: `.xls`, `.xlsx`
- **PowerPoint**: `.ppt`, `.pptx`
- 使用 Microsoft Office Online 查看器
- 备用 Google Docs 查看器

### 文本文件
- `.txt` 文件
- 直接显示文本内容
- 支持代码高亮样式

## 配置选项

插件会自动注入必要的 CSS 和 JavaScript 文件，无需额外配置。如果需要自定义样式，可以在主题的 CSS 文件中覆盖相关样式。

### 自定义样式

```css
/* 自定义文档查看器容器样式 */
.doc-viewer-container {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* 自定义标题栏样式 */
.doc-viewer-title {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

## 注意事项

1. **跨域问题**: 确保文档 URL 支持跨域访问或使用相对路径
2. **文件大小**: 大文件可能加载较慢，建议优化文件大小
3. **浏览器兼容性**: 现代浏览器支持良好，IE 可能存在兼容性问题
4. **HTTPS**: 在 HTTPS 站点中，建议使用 HTTPS 文档链接

## 故障排除

### 文档无法显示
1. 检查文档 URL 是否正确
2. 确认文档支持在线预览
3. 检查浏览器控制台是否有错误信息

### 样式异常
1. 清除浏览器缓存
2. 检查是否有 CSS 冲突
3. 确认插件文件完整

## 更新日志

### v1.0.0
- 初始版本发布
- 支持 PDF、Office 文档、文本文件预览
- 响应式设计和暗色主题支持
- 自动注入资源文件

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

Stone Ocean

---

如果这个插件对你有帮助，请给个 ⭐ Star！