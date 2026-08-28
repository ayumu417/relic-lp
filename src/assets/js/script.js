import Swiper from 'swiper';

export function initCommonScripts() {
  document.addEventListener("DOMContentLoaded", () => {
    /*-------------------------------------------
      共通swiper 
    -------------------------------------------*/
    // サムネイル付きスライダー
    (() => {
      const thumbnail_slider_wrappers = document.querySelectorAll(
        ".js-thumbnail_slider_wrapper",
      );
      thumbnail_slider_wrappers.forEach((thumbnail_slider_wrapper) => {
        /***** option *****/
        let thumb_sp_space = "0%";
        let data_thumb_sp_space = thumbnail_slider_wrapper.dataset.thumb_sp_space;
        if (data_thumb_sp_space) {
          thumb_sp_space = data_thumb_sp_space;
        }

        let thumbnail_slider = thumbnail_slider_wrapper.querySelector(
          ".js-thumbnail_slider_main",
        );
        let thumbnail_slider_thumb = thumbnail_slider_wrapper.querySelector(
          ".js-thumbnail_slider_thumb",
        );

        /***** main *****/
        let thumbnail_slider_block = new Swiper(thumbnail_slider, {
          slidesPerView: 1,
          loop: true,
          effect: "fade",
          allowTouchMove: true,
          speed: 700,
          fadeEffect: {
            crossFade: true,
          },

          // スライド変更時
          on: {
            slideChange: function () {
              const realIndex = this.realIndex; // loop:true 対応

              // active 全解除
              thumbnail_slider_thumb
                .querySelectorAll(".swiper-slide")
                .forEach((el) => {
                  el.classList.remove("active");
                });

              // 対応する番号に active
              const target = thumbnail_slider_thumb.querySelector(
                `.swiper-slide[data-slide="${realIndex}"]`,
              );
              if (target) {
                target.classList.add("active");
              }
            },
          },
        });

        /***** thumbnail *****/
        let thumbnail_slider_thumb_block = null;
        const SpThumbSwiper = () => {
          thumbnail_slider_thumb_block = new Swiper(thumbnail_slider_thumb, {
            slidesPerView: 4.3,
            loop: false,
            loopAdditionalSlides: 1,
            spaceBetween: thumb_sp_space,
            dots: true,
            pagination: {
              el: ".thumbnail_slider_thumb_pagination",
              clickable: true,
            },
          });
        };
        const checkBreakpoint = (e) => {
          if (e.matches) {
            SpThumbSwiper();
          } else if (thumbnail_slider_thumb_block) {
            thumbnail_slider_thumb_block.destroy(true, true);
          }
        };
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        mediaQuery.addEventListener("change", checkBreakpoint);
        checkBreakpoint(mediaQuery);

        if (thumbnail_slider_block) {
          thumbnail_slider_thumb
            .querySelectorAll(".swiper-slide")
            .forEach((btn) => {
              btn.addEventListener("click", function () {
                thumbnail_slider_thumb.classList.remove("active");
                this.classList.add("active");

                const index = Number(btn.dataset.slide);

                // loop:true の場合は slideToLoop を使うのがベスト
                thumbnail_slider_block.slideToLoop(index);
                thumbnail_slider_block.autoplay.stop();
              });
            });
        }
      });
    })();
    
  });
}