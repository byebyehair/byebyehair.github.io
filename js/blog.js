function addTargetBlankToExternalLinks() {
    // 获取当前页面的所有 <a> 标签
    const links = document.querySelectorAll('a[href]');

    // 获取当前页面的 URL
    const currentUrl = new URL(window.location.href);
    const currentHost = currentUrl.hostname;

    // 遍历每个 <a> 标签
    links.forEach(link => {
        try {
            // 创建一个新的 URL 对象来解析 href 属性
            const linkUrl = new URL(link.href);

            // 检查链接的主机名是否与当前页面不同
            if (linkUrl.hostname !== currentHost) {
                // 添加 target="_blank" 以在新标签页打开外部链接
                link.target = '_blank';
            }
        } catch (error) {
            // 如果 href 不是一个有效的 URL，则忽略它
            console.error(`Invalid URL: ${link.href}`, error);
        }
    });
}

addTargetBlankToExternalLinks();