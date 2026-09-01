/**
 * スムーススクロールの実装
 */
(() => {
  const setupSmoothScroll = () => {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
          // ヘッダー要素を取得
          const header = document.querySelector('#header');
          // ヘッダーが存在すればその高さを、なければ0を設定
          const headerOffset = header ? header.offsetHeight : 0; 

          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', setupSmoothScroll);
  document.addEventListener('astro:page-load', setupSmoothScroll);
})();