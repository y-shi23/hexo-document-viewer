/**
 * Hexo Document Viewer Plugin
 * 为 Hexo 博客提供文档嵌入和预览功能
 * 支持 PDF、Word、Excel、PowerPoint 等格式
 */

'use strict';

const path = require('path');
const fs = require('fs');

// 注册标签
hexo.extend.tag.register('doc', function(args) {
  const url = args[0];
  const type = args[1] || 'pdf';
  const title = args[2] || '文档预览';
  const width = args[3] || '100%';
  const height = args[4] || '600px';

  if (!url) {
    throw new Error('doc: 缺少文件URL参数');
  }

  const viewerId = 'doc-' + Math.random().toString(36).substr(2, 9);

  const html = `
<div id="${viewerId}" 
     data-doc-viewer="true"
     data-file-url="${url}"
     data-file-type="${type}"
     data-width="${width}"
     data-height="${height}"
     data-title="${title}">
</div>`;

  return html;
}, { ends: false });

// 注册生成器，用于复制静态资源
hexo.extend.generator.register('document-viewer-assets', function(locals) {
  const assetsPath = path.join(__dirname, 'assets');
  const files = [];
  
  try {
    // 复制 JavaScript 文件
    if (fs.existsSync(path.join(assetsPath, 'documentViewer.js'))) {
      const jsContent = fs.readFileSync(path.join(assetsPath, 'documentViewer.js'), 'utf8');
      files.push({
        path: 'js/documentViewer.js',
        data: jsContent
      });
    }
    
    // 复制 CSS 文件
    if (fs.existsSync(path.join(assetsPath, 'documentViewer.css'))) {
      const cssContent = fs.readFileSync(path.join(assetsPath, 'documentViewer.css'), 'utf8');
      files.push({
        path: 'css/documentViewer.css',
        data: cssContent
      });
    }

    // 复制 download.svg 文件
    if (fs.existsSync(path.join(assetsPath, 'download.svg'))) {
      const svgContent = fs.readFileSync(path.join(assetsPath, 'download.svg'), 'utf8');
      files.push({
        path: 'assets/download.svg',
        data: svgContent
      });
    }
  } catch (error) {
    console.warn('Document Viewer Plugin: Failed to load assets', error.message);
  }
  
  return files;
});

// 注册过滤器，自动注入CSS和JS
hexo.extend.filter.register('after_render:html', function(str, data) {
  // 检查页面是否包含文档查看器
  if (str.includes('data-doc-viewer="true"')) {
    const cssLink = '<link rel="stylesheet" href="/css/documentViewer.css">';
    const jsScript = '<script src="/js/documentViewer.js"></script>';

    // 注入CSS（如果尚未注入）
    if (!str.includes('/css/documentViewer.css')) {
      str = str.replace('</head>', cssLink + '\n</head>');
    }
    
    // 注入JS（如果尚未注入）
    if (!str.includes('/js/documentViewer.js')) {
      str = str.replace('</body>', jsScript + '\n</body>');
    }
  }
  
  return str;
});

/**
 * 解析标签参数
 * @param {Array} args - 参数数组
 * @returns {Object} 解析后的选项对象
 */
function parseArgs(args) {
  const options = {};
  
  // 第一个参数通常是URL
  if (args.length > 0) {
    options.url = args[0];
  }
  
  // 解析其他参数
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.includes('=')) {
      const [key, value] = arg.split('=');
      options[key] = value;
    }
  }
  
  return options;
}

// 导出插件信息
module.exports = {
  name: 'hexo-document-viewer',
  version: '1.0.4',
  description: 'Document viewer plugin for Hexo'
};