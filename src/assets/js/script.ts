/**
 * スムーススクロールの実装
 * 遅延読み込み対策の為、再起処理の仕様にて実装
 * ユーザーの操作感知でイベント停止
 */
(() => {
  let isUserInterrupted: boolean = false;

  // ユーザーの操作を検知した際に実行されるハンドラ（スクロール強制停止）
  const cancelScrollHandler = (): void => {
    if (!isUserInterrupted) {
      isUserInterrupted = true;
      window.scrollTo({
        top: window.scrollY,
        behavior: 'auto'
      });
    }
  };

  // キーボード操作用のハンドラ（名前付き関数にすることで後で解除可能にする）
  const keydownHandler = (e: KeyboardEvent): void => {
    // 画面スクロールを引き起こすキー操作を検知
    const scrollKeys: string[] = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"];
    if (scrollKeys.includes(e.code)) {
      cancelScrollHandler();
    }
  };

  const setupSmoothScroll = (): void => {
    // HTMLAnchorElementとして取得
    const smoothScrollLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    smoothScrollLinks.forEach((anchor) => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: MouseEvent) {
        document.querySelector("body")?.classList.add("is-anker-clicked");
        e.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        const targetElement = document.querySelector<HTMLElement>(href);

        if (targetElement) {
          const header = document.querySelector<HTMLElement>('#header');
          const headerHeight = header ? header.offsetHeight : 0;
          let count = 0;

          // 初期化：フラグを戻し、各種ユーザー操作の監視を開始
          isUserInterrupted = false;
          window.addEventListener('wheel', cancelScrollHandler, { passive: true });
          window.addEventListener('touchstart', cancelScrollHandler, { passive: true });
          window.addEventListener('keydown', keydownHandler, { passive: true }); // キーボード操作の監視

          // 監視解除用のヘルパー関数
          const removeListeners = (): void => {
            window.removeEventListener('wheel', cancelScrollHandler);
            window.removeEventListener('touchstart', cancelScrollHandler);
            window.removeEventListener('keydown', keydownHandler); // キーボード操作の監視も解除
          };

          async function ankerlink_smooth(before: number): Promise<void> {
            // ユーザー操作があった場合は再帰ループを終了し、監視を解除
            if (isUserInterrupted) {
              removeListeners();
              return;
            }

            if (count <= 5) {
              let elementPosition = targetElement!.getBoundingClientRect().top;
              let targetPosition = elementPosition + window.scrollY - headerHeight;
              let diff = Math.abs(targetPosition - before);

              if (diff > 20) {
                count++;
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth',
                });

                await new Promise((resolve) => setTimeout(resolve, 1000));
                ankerlink_smooth(targetPosition);
              } else {
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth',
                });

                // 完了時に監視を解除
                removeListeners();
              }
            } else {
              // 上限回数に達した場合も監視を解除
              removeListeners();
            }
          }

          ankerlink_smooth(0);
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', setupSmoothScroll);
  document.addEventListener('astro:page-load', setupSmoothScroll);
})();