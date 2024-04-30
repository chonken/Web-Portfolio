/**
 * 依據滾輪的滾動播放動畫
 * @param {Element} targetScroll 滾動條的所在元素
 * @param {Element} target 要執行動畫的目標容器
 * @param  {...Function} args 要執行的所有動畫
 */
export function Animation(targetScroll, target, ...args) {
	// 整理args
	convert(args)

	let percent = progress(target)
	let last = percent
	if (last !== 0) {
		animate()
	}
	targetScroll.addEventListener('scroll', () => {
		percent = progress(target)
		if (last !== 0 && last !== 100) {
			animate()
		}
		last = percent
	})

	function animate() {
		for (const arg of args) {
			if (percent >= arg.start) {
				const p = ((percent - arg.start) / (arg.end - arg.start)) * 100
				arg.fn(p)
				if (percent >= arg.end) {
					arg.fn(100)
				}
			} else {
				arg.fn(0)
			}
		}
	}
}
/**
 * 水平滾動，主要用rotate方式實現，適合用於局部展示或改變整體滾動，較不適合與一般滾動混用
 *
 * 優點: 完全與一般滾動一樣流暢
 *
 * 缺點: 滾動條在上方、除非是正方形否則內容物的寬度單位不能是%、若放在一般滾動裡面的話，必須滑鼠移入(至少要動一次)才能開始滾動，否則會被判定是一般滾動
 */
export function HorizonByRotate() {
	const target = document.querySelector('.horizon-by-rotate')
	const scrollbar = document.querySelector('.rotate-scrollbar')
	const content = document.querySelector('.rotate-content')
	scrollbar.style.width = target.clientHeight + 'px'
	scrollbar.style.height = target.clientWidth + 'px'
	scrollbar.style.transform = `translateY(${target.clientHeight}px) rotate(270deg)`
	content.style.height = target.clientHeight + 'px'
}
/**
 * @typedef {Object} ByAniObj
 * @property {object} start - 水平滾動前的動畫，{ duration: 持續時間(%), pixelHeight: 動畫高度(px), fn: 動畫(percent): void }
 * @property {object} scrolling - 水平滾動中的動畫，{ duration: 持續時間(%), pixelHeight: 動畫高度(px), fn: 動畫(percent): void }
 * @property {object} end - 水平滾動後的動畫，{ duration: 持續時間(%), pixelHeight: 動畫高度(px), fn: 動畫(percent): void }
 */
/**
 * 依據滾輪的滾動播放動畫(附加水平滾動效果)
 * 優點: 可與一般滾動流暢得混用、可與滾輪的滾動播放動畫效果完美配合
 * 缺點: 要完全與一般滾動一樣流暢滾動需要自行計算、因為水平滾動軸的垂直滾動空間是JS事後補上的，因此滾動後刷新會大跳轉，可事先手動填上解決
 * @param {Element} targetScroll 滾動條的所在元素
 * @param {Element} target 要執行動畫的目標容器
 * @param {ByAniObj}
 */
export function HorizonByAnimation(
	targetScroll,
	target,
	{ start = undefined, scrolling = undefined, end = undefined }
) {
	const args = []
	const byAni = target.querySelector('.horizon-by-ani')
	const content = target.querySelector('.horizon-by-ani > .ani-content')
	const oldHeight = start?.pixelHeight + end?.pixelHeight || 0
	const newHeight = content.offsetWidth + oldHeight
	const total = 1 - byAni.clientWidth / content.offsetWidth
	target.style.height = newHeight + 'px'
	const start_d = toPercent(start?.duration || 0)
	const end_d = toPercent(end?.duration || 0)

	// 整體動畫流程
	if (start) {
		args.push({
			start: 0,
			duration: (oldHeight * start_d) / newHeight,
			fn: start.fn,
		})
	}
	function hr(percent) {
		content.style.transform = `translateX(-${total * percent}%)`
	}
	args.push({
		start: 'auto',
		duration: (newHeight - oldHeight * (1 - end_d)) / newHeight,
		fn: hr,
	})
	if (scrolling) {
		// 還沒測試
		args.push({
			start: (oldHeight * start_d) / newHeight,
			duration: (newHeight - oldHeight * (1 - end_d)) / newHeight,
			fn: scrolling.fn,
		})
	}
	if (end) {
		args.push({
			start: 'auto',
			duration: 'auto',
			fn: end.fn,
		})
	}

	Animation(targetScroll, target, ...args)
}

function progress(target) {
	const screen = target.querySelector('.screen')
	const screenY = screen.offsetTop
	const screenH = screen.offsetHeight
	const targetH = target.offsetHeight
	return Math.round((screenY / (targetH - screenH)) * 100)
}
// function toPercent(arg, offset = undefined) {
// 	if (typeof arg === 'string') {
// 		if (arg === 'auto' && offset) return offset
// 		const n = parseInt(arg.replace('%', ''))
// 		if (n >= 0 && n <= 100) return n
// 	}
// 	if (typeof arg === 'number') {
// 		if (arg >= 0 && arg <= 1) {
// 			return arg * 100
// 		}
// 		if (arg > 1 && arg <= 100) {
// 			return arg
// 		}
// 	}
// 	return NaN
// }
function toPercent(arg) {
	if (typeof arg === 'string') {
		if (arg === 'auto') return 'auto'
		if (arg === 'fill') return 'fill'
		const n = parseInt(arg.replace('%', ''))
		if (n >= 0 && n <= 100) return n / 100
	}
	if (typeof arg === 'number') {
		if (arg >= 0 && arg <= 1) {
			return arg
		}
		// if (arg > 1 && arg <= 100) {
		// 	return arg / 100
		// }
	}
	return console.error(
		"請填寫正確(0.0~1.0 || '0%'~'100%' || 'auto' || 'fill'): ",
		arg
	)
}
function convert(args) {
	let start = 0
	let end = 0

	for (const [i, arg] of args.entries()) {
		const _s = toPercent(arg.start)
		const _d = toPercent(arg.duration)
		// const _e = toPercent(arg.end)

		// 上一個duration是auto，幫上一個填end
		if (end === 'auto') {
			if (_s === 'auto' || _s === 'fill') {
				end = args[i - 1].end = start * 100
			} else {
				end = args[i - 1].end = _s * 100
			}
		}

		// fill不佔空間，相當於是position: absolute
		if (_s === 'fill' || _d === 'fill') {
			if (_s === 'fill') {
				arg.start = 0
			} else {
				arg.start = _s * 100
			}
			if (_d === 'fill') {
				arg.end = (1 - _s) * 100
			} else {
				arg.end = _d * 100
			}
		} else {
			// 普通流程
			if (_s === 'auto') {
				start = end
				arg.start = start * 100
			} else {
				start = _s
				arg.start = start * 100
			}
			if (_d === 'auto') {
				end = 'auto'
			} else {
				end = _d
				arg.end = end * 100
			}
		}
	}
	// 補上最後一個duration: auto
	if (end === 'auto') {
		args[args.length - 1].end = 100
	}
}
