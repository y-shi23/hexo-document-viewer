# Hexo Document Viewer Plugin

![示例](https://pub-31e73f1cf821435c9feacfaad3c1a156.r2.dev/2025-06/250624190931696_1750763371794.png)
一个用于在 Hexo 博客中嵌入和预览文档的插件，支持 PDF、Word、Excel、PowerPoint 等多种格式。

## 功能特性

- 📄 支持多种文档格式：PDF、DOC/DOCX、XLS/XLSX、PPT/PPTX、TXT
- 🎨 美观的界面设计，支持暗色主题
- 📱 响应式设计，移动端友好
- ⚡ 自动注入 CSS 和 JavaScript，无需手动配置
- 🔧 灵活的参数配置
- 🌐 支持在线文档查看器（Microsoft Office Online、Google Docs）

## 安装


```bash
npm install hexo-document-viewer --save
```

## 使用方法

```txt
{% doc 文件url 文件类型 '文件名（展示的名称）' %}
```


示例：
```txt
{% doc https://cloud.url/name.pdf pdf 'nameofpdf' %}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

Ocean
