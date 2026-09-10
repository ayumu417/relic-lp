// CSSはビルド時に解決し、初期表示時のレイアウト崩れ(CLS)を防ぐため、同期読み込みに
import "swiper/css/bundle";

/**
 * SP時のみSwiperを初期化する関数
 * @param {string} targetSelector - 初期化対象のスライダーのクラス名 (例: ".js-swiper")
 * @param {number|string} slidesPerView - スライドの表示枚数（デフォルト: 1.15）
 * @param {number|string} spaceBetween - スライド間の余白（デフォルト: "3.5%"）
 */
export function setupResponsiveSwiperSp(targetSelector, slidesPerView = 1.15, spaceBetween = "3.5%") {
  const sliders = document.querySelectorAll(targetSelector);
  if (sliders.length === 0) return;

  const mediaQuery = window.matchMedia("(max-width: 768px)");
  let swiperInstances = [];
  let isLoaded = false;
  let SwiperClass, swiperModules;

  // ナンバリング処理（同期実行）
  // JSの動的読み込みを待たずにDOMへのクラス付与を完了させておく
  sliders.forEach((slider) => {
    const originalSlides = slider.querySelectorAll(".swiper-slide");
    originalSlides.forEach((slide, index) => {
      if (slide) {
        const numberStr = String(index + 1).padStart(2, "0");
        slide.style.setProperty("--slide-num", `"${numberStr}"`);
      }
    });
  });

  // Swiperの初期化（モジュールロード済み前提）
  const initSwiper = () => {
    if (mediaQuery.matches) {
      if (!isLoaded || swiperInstances.length > 0) return;

      sliders.forEach((slider) => {
        const paginationEl = slider.querySelector(".swiper-pagination");
        const instance = new SwiperClass(slider, {
          modules: swiperModules,
          centeredSlides: true,
          mousewheel: false,
          autoHeight: false,
          loop: true,
          slidesPerView: slidesPerView,
          speed: 500,
          spaceBetween: spaceBetween,
          pagination: paginationEl ? { el: paginationEl, clickable: true } : false,
        });
        swiperInstances.push(instance);
      });
    } else {
      if (swiperInstances.length > 0) {
        swiperInstances.forEach((instance) => instance.destroy(true, true));
        swiperInstances = [];
      }
    }
  };

  // IntersectionObserverによる遅延読み込み
  const observer = new IntersectionObserver(async (entries, obs) => {
    if (entries.some(entry => entry.isIntersecting)) {
      obs.disconnect(); // 1つでも画面に入ったら監視を解除

      if (!isLoaded) {
        // 画面に近づいたタイミングで初めてSwiper本体を動的インポート
        const { default: Swiper, Navigation, Pagination, Autoplay, EffectFade } = await import("swiper");
        SwiperClass = Swiper;
        swiperModules = [Navigation, Pagination, Autoplay, EffectFade];
        isLoaded = true;
      }
      
      initSwiper();
    }
  }, { rootMargin: "300px 0px" });

  sliders.forEach(slider => observer.observe(slider));

  // リサイズイベントのハンドリング
  mediaQuery.addEventListener("change", initSwiper);
}