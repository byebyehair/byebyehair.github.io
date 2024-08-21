'use strict';

// back-to-top
$(document).ready((function (_this) {
  return function () {
    let bt
    bt = $('#back_to_top')
    if ($(document).width() > 480) {
      $(window).scroll(function () {
        let st
        st = $(window).scrollTop()
        if (st > 30) {
          return bt.css('display', 'block')
        } else {
          return bt.css('display', 'none')
        }
      })
      return bt.click(function () {
        $('body,html').animate({
          scrollTop: 0,
        }, 800)
        return false
      })
    }
  }
})(this))

// nav-toggle
$(document).ready((function (_this) {
  return function () {
    let nav,icon
    icon = $('#menu_icon')
    nav = $('#site_nav')
    icon.click(function () {
      nav.slideToggle(250)
    })
  }
})(this))

// FancyBox
$('[data-fancybox="gallery"]').fancybox({
  arrows: false,
  infobar: false,
  buttons: [],
  clickContent: "close",
  autoFocus: false,
  backFocus: false,
  wheel: false,
  mobile: {
    clickContent: "close",
    clickSlide: "close",
    dblclickContent: false,
    dblclickSlide: false
  },
});


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
