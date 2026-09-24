/**************************
 * slide
 * アコーディオンのスライド開閉用の関数
 * @param {HTMLElement} element スライドするdom
 * @param {number} [duration] スライドするスピード
**************************/

// slideUp
export function slideUp(element: HTMLElement, duration: number = 300): void {
	element.style.height = element.offsetHeight + "px";
	element.offsetHeight;
	element.style.transitionProperty = "height, margin, padding";
	element.style.transitionDuration = duration + "ms";
	element.style.transitionTimingFunction = "ease";
	element.style.overflow = "hidden";
	element.style.height = "0";
	element.style.paddingTop = "0";
	element.style.paddingBottom = "0";
	element.style.marginTop = "0";
	element.style.marginBottom = "0";
	setTimeout(() => {
		element.style.display = "none";
		element.style.removeProperty("height");
		element.style.removeProperty("padding-top");
		element.style.removeProperty("padding-bottom");
		element.style.removeProperty("margin-top");
		element.style.removeProperty("margin-bottom");
		element.style.removeProperty("overflow");
		element.style.removeProperty("transition-duration");
		element.style.removeProperty("transition-property");
		element.style.removeProperty("transition-timing-function");
	}, duration);
};

// slideDown
export function slideDown(element: HTMLElement, duration: number = 300): void {
	element.style.removeProperty("display");
	let display = window.getComputedStyle(element).display;
	if (display === "none") {
		display = "block";
	}
	element.style.display = display;
	let height = element.offsetHeight;
	element.style.overflow = "hidden";
	element.style.height = "0";
	element.style.paddingTop = "0";
	element.style.paddingBottom = "0";
	element.style.marginTop = "0";
	element.style.marginBottom = "0";
	element.offsetHeight;
	element.style.transitionProperty = "height, margin, padding";
	element.style.transitionDuration = duration + "ms";
	element.style.transitionTimingFunction = "ease";
	element.style.height = height + "px";
	element.style.removeProperty("padding-top");
	element.style.removeProperty("padding-bottom");
	element.style.removeProperty("margin-top");
	element.style.removeProperty("margin-bottom");
	setTimeout(() => {
		element.style.removeProperty("height");
		element.style.removeProperty("overflow");
		element.style.removeProperty("transition-duration");
		element.style.removeProperty("transition-property");
		element.style.removeProperty("transition-timing-function");
	}, duration);
};