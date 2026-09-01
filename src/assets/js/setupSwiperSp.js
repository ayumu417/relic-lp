import Swiper, { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import "swiper/css/bundle";

/**
 * SP時のみSwiperを初期化する関数
 * @param {string} targetSelector - 初期化対象のスライダーのクラス名 (例: ".js-swiper")
 * @param {number|string} slidesPerView - スライドの表示枚数（デフォルト: 1.15）
 * @param {number|string} spaceBetween - スライド間の余白（デフォルト: "3.5%"）
 */
export function setupResponsiveSwiperSp(targetSelector, slidesPerView = 1.15, spaceBetween = "3.5%") {
  // 指定されたクラス名を持つ要素をすべて取得
  const sliders = document.querySelectorAll(targetSelector);

  // 該当する要素がなければ処理を終了
  if (sliders.length === 0) return;

  // SPサイズを判定するメディアクエリ
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  // 生成したSwiperインスタンスを保持する配列
  let swiperInstances = [];

  // ナンバリング処理
  sliders.forEach((slider) => {
    // --- 1. Swiper初期化前のナンバリング処理 ---
    // まだクローンが生成されていないオリジナルのスライドだけを取得
    const originalSlides = slider.querySelectorAll(".swiper-slide");

    originalSlides.forEach((slide, index) => {
      if (slide) {
        // padStartで "01", "02" とゼロ埋めする
        const numberStr = String(index + 1).padStart(2, "0");
        // CSS変数を使ってナンバリング
        slide.style.setProperty("--slide-num", `"${numberStr}"`);
      }
    });
  });

  function initSwiper() {
    // SPサイズの場合
    if (mediaQuery.matches) {
      // まだ初期化されていなければSwiperを生成
      if (swiperInstances.length === 0) {
        sliders.forEach((slider) => {
          // ページネーション要素を取得（存在する場合のみ）
          const paginationEl = slider.querySelector(".swiper-pagination");

          // --- 2. Swiperの初期化 ---
          const instance = new Swiper(slider, {
            modules: [Navigation, Pagination, Autoplay, EffectFade],
            centeredSlides: true,
            mousewheel: false,
            autoHeight: false,
            loop: true,
            slidesPerView: slidesPerView, // 引数で受け取った値を適用
            speed: 500,
            spaceBetween: spaceBetween,   // 引数で受け取った値を適用

            // ページネーション要素がある場合のみ設定を有効化
            pagination: paginationEl ? {
              el: paginationEl,
              clickable: true,
            } : false,
          });

          swiperInstances.push(instance);
        });
      }
    }
    // PCサイズの場合
    else {
      // 既にSwiperが初期化されていれば破棄する
      if (swiperInstances.length > 0) {
        swiperInstances.forEach((instance) => {
          instance.destroy(true, true);
        });
        // 配列を空にしてリセット
        swiperInstances = [];
      }
    }
  }

  // ページ読み込み時に初回の判定を実行
  initSwiper();

  // 画面幅がリサイズされ、ブレイクポイントを跨いだ時に再判定
  mediaQuery.addEventListener("change", initSwiper);
}