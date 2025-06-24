/**
 * 博客文档查看器 - 支持PDF、Word、Excel、PPT等文件的嵌入显示
 * 作者: Stone Ocean
 * 功能: 在博客中嵌入和预览各种文档格式
 */

class DocumentViewer {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeViewers());
        } else {
            this.initializeViewers();
        }
    }

    initializeViewers() {
        // 查找所有文档嵌入元素
        const docElements = document.querySelectorAll('[data-doc-viewer]');
        docElements.forEach(element => {
            this.createViewer(element);
        });
    }

    createViewer(element) {
        // 防止重复初始化
        if (element.hasAttribute('data-doc-viewer-initialized')) {
            return;
        }
        element.setAttribute('data-doc-viewer-initialized', 'true');

        const fileUrl = element.getAttribute('data-file-url');
        const fileType = element.getAttribute('data-file-type') || this.getFileType(fileUrl);
        const width = element.getAttribute('data-width') || '100%';
        const height = element.getAttribute('data-height') || '600px';
        const title = element.getAttribute('data-title') || '文档预览';

        if (!fileUrl) {
            console.error('DocumentViewer: 缺少文件URL');
            return;
        }

        // 创建查看器容器
        const container = this.createContainer(width, height, title, fileUrl, fileType);
        const viewer = this.createViewerByType(fileType, fileUrl, width, height);
        
        if (viewer) {
            container._contentArea.appendChild(viewer);
            element.appendChild(container);
        } else if (fileType.toLowerCase() === 'other') {
            // other类型只显示标题栏，不显示内容区域
            element.appendChild(container);
        } else {
            // 如果无法创建查看器，显示下载链接
            const downloadLink = this.createDownloadLink(fileUrl, title);
            element.appendChild(downloadLink);
        }
    }

    createContainer(width, height, title, fileUrl, fileType = '') {
        const container = document.createElement('div');
        container.className = 'doc-viewer-container';
        container.style.cssText = `
            width: ${width};
            height: ${height};
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        // 添加标题栏
        const titleBar = document.createElement('div');
        titleBar.className = 'doc-viewer-title';
        titleBar.style.cssText = `
            background: #f5f5f5;
            padding: 10px 15px;
            border-bottom: 1px solid #ddd;
            font-weight: 500;
            color: #333;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
        `;

        // 折叠/展开按钮（other类型不显示）
        const toggleBtn = document.createElement('button');
        if (fileType.toLowerCase() !== 'other') {
            toggleBtn.innerHTML = '▶';
            toggleBtn.title = '折叠/展开';
            toggleBtn.className = 'doc-viewer-toggle-btn';
            toggleBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                color: #6c757d;
                transition: all 0.2s;
                font-size: 12px;
                margin-right: 8px;
            `;
            titleBar.appendChild(toggleBtn);
        }

        // 标题文本
        const titleText = document.createElement('span');
        titleText.textContent = title;
        titleText.style.cssText = `
            flex: 1;
        `;
        titleBar.appendChild(titleText);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        // 下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = `<img src="/assets/download.svg" alt="下载" style="width: 16px; height: 16px;">`;
        downloadBtn.title = '下载文件';
        downloadBtn.className = 'doc-viewer-download-btn';
        downloadBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            color: #6c757d;
            transition: all 0.2s;
            font-size: 14px;
        `;
        downloadBtn.onclick = (e) => {
            e.stopPropagation();
            this.downloadFile(fileUrl, title);
        };
        buttonContainer.appendChild(downloadBtn);

        titleBar.appendChild(buttonContainer);
        container.appendChild(titleBar);

        // 内容区域
        const contentArea = document.createElement('div');
        contentArea.className = 'doc-viewer-content';
        contentArea.style.cssText = `
            height: 0;
            overflow: hidden;
            transition: height 0.3s ease;
        `;
        container.appendChild(contentArea);

        // 折叠/展开功能（other类型不需要）
        if (fileType.toLowerCase() === 'other') {
            // other类型只显示标题栏，固定高度
            container.style.height = '45px';
            contentArea.style.display = 'none';
        } else {
            // 其他类型的折叠/展开功能
            let isCollapsed = true;
            container.style.height = '45px';

            const toggleCollapse = () => {
                isCollapsed = !isCollapsed;
                if (isCollapsed) {
                    contentArea.style.height = '0';
                    toggleBtn.innerHTML = '▶';
                    container.style.height = '45px';
                } else {
                    contentArea.style.height = `calc(${height} - 45px)`;
                    toggleBtn.innerHTML = '▼';
                    container.style.height = height;
                }
            };

            toggleBtn.onclick = (e) => {
                e.stopPropagation();
                toggleCollapse();
            };

            titleBar.onclick = (e) => {
                if (e.target === titleBar || e.target === titleText) {
                    toggleCollapse();
                }
            };
        }

        // 存储内容区域引用，供后续使用
        container._contentArea = contentArea;

        return container;
    }

    createViewerByType(fileType, fileUrl, width, height) {
        const adjustedHeight = `calc(${height} - 45px)`; // 减去标题栏高度

        switch (fileType.toLowerCase()) {
            case 'pdf':
                return this.createPDFViewer(fileUrl, width, adjustedHeight);
            case 'doc':
            case 'docx':
                return this.createOfficeViewer(fileUrl, width, adjustedHeight, 'word');
            case 'xls':
            case 'xlsx':
                return this.createOfficeViewer(fileUrl, width, adjustedHeight, 'excel');
            case 'ppt':
            case 'pptx':
                return this.createOfficeViewer(fileUrl, width, adjustedHeight, 'powerpoint');
            case 'txt':
                return this.createTextViewer(fileUrl, width, adjustedHeight);
            case 'other':
                return null; // other类型只显示标题栏和下载按钮
            default:
                return null;
        }
    }

    createPDFViewer(fileUrl, width, height) {
        // 使用PDF.js或浏览器内置PDF查看器
        const iframe = document.createElement('iframe');
        iframe.src = fileUrl;
        iframe.style.cssText = `
            width: 100%;
            height: ${height};
            border: none;
        `;
        iframe.setAttribute('allowfullscreen', 'true');
        return iframe;
    }

    createOfficeViewer(fileUrl, width, height, type) {
        // 使用Microsoft Office Online Viewer
        const iframe = document.createElement('iframe');
        const encodedUrl = encodeURIComponent(fileUrl);
        
        // Microsoft Office Online查看器
        iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
        
        iframe.style.cssText = `
            width: 100%;
            height: ${height};
            border: none;
        `;
        iframe.setAttribute('allowfullscreen', 'true');
        
        // 添加错误处理
        iframe.onerror = () => {
            console.warn('Office在线查看器加载失败，尝试使用Google Docs查看器');
            iframe.src = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
        };
        
        return iframe;
    }

    createTextViewer(fileUrl, width, height) {
        const container = document.createElement('div');
        container.style.cssText = `
            width: 100%;
            height: ${height};
            overflow: auto;
            padding: 15px;
            background: #fff;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
        `;

        // 异步加载文本内容
        fetch(fileUrl)
            .then(response => response.text())
            .then(text => {
                container.textContent = text;
            })
            .catch(error => {
                container.innerHTML = `<p style="color: #e74c3c;">无法加载文本文件: ${error.message}</p>`;
            });

        return container;
    }

    createDownloadLink(fileUrl, title) {
        const container = document.createElement('div');
        container.className = 'doc-download-container';
        container.style.cssText = `
            padding: 20px;
            text-align: center;
            border: 2px dashed #ddd;
            border-radius: 8px;
            margin: 20px 0;
            background: #f9f9f9;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = '📄';
        icon.style.cssText = `
            font-size: 48px;
            margin-bottom: 10px;
        `;

        const link = document.createElement('a');
        link.href = fileUrl;
        link.textContent = `下载 ${title}`;
        link.target = '_blank';
        link.style.cssText = `
            display: inline-block;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: background 0.3s;
        `;
        
        link.addEventListener('mouseenter', () => {
            link.style.background = '#2980b9';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.background = '#3498db';
        });

        container.appendChild(icon);
        container.appendChild(link);
        
        return container;
    }

    getFileType(url) {
        if (!url) return 'unknown';
        
        const extension = url.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'pdf',
            'doc': 'doc',
            'docx': 'docx',
            'xls': 'xls',
            'xlsx': 'xlsx',
            'ppt': 'ppt',
            'pptx': 'pptx',
            'txt': 'txt',
            'other': 'other' // 添加other类型
        };
        
        return typeMap[extension] || 'unknown';
    }

    downloadFile(fileUrl, fileName) {
        try {
            // 创建一个临时的 a 标签来触发下载
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName || 'document';
            link.target = '_blank';
            
            // 添加到 DOM 并触发点击
            document.body.appendChild(link);
            link.click();
            
            // 清理
            document.body.removeChild(link);
        } catch (error) {
            console.error('下载文件失败:', error);
            // 如果下载失败，尝试在新窗口打开
            window.open(fileUrl, '_blank');
        }
    }

    // 静态方法：快速创建文档查看器
    static embed(options) {
        const {
            container,
            fileUrl,
            fileType,
            width = '100%',
            height = '600px',
            title = '文档预览'
        } = options;

        if (!container || !fileUrl) {
            console.error('DocumentViewer.embed: 缺少必要参数');
            return;
        }

        const element = typeof container === 'string' 
            ? document.querySelector(container)
            : container;

        if (!element) {
            console.error('DocumentViewer.embed: 找不到容器元素');
            return;
        }

        element.setAttribute('data-doc-viewer', 'true');
        element.setAttribute('data-file-url', fileUrl);
        if (fileType) element.setAttribute('data-file-type', fileType);
        element.setAttribute('data-width', width);
        element.setAttribute('data-height', height);
        element.setAttribute('data-title', title);

        const viewer = new DocumentViewer();
        viewer.createViewer(element);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.DocumentViewer = DocumentViewer;
    new DocumentViewer();
}

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentViewer;
}