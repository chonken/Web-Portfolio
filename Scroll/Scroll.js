/**
 * 依據滾輪的滾動播放動畫
 * @param {Element} targetScroll 滾動條的所在元素
 * @param {Element} target 要執行動畫的目標容器
 * @param  {...Function} args 要執行的所有動畫
 */
export function Animation(targetScroll, target, ...args) {
	// 整理args
	for (const [i, arg] of args.entries()) {
		arg.start = toPercent(arg.start)
		arg.duration = toPercent(
			arg.duration,
			(toPercent(args[i + 1]?.start) || 100) - arg.start
		)
	}

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
			if (percent >= arg.start && percent <= arg.start + arg.duration) {
				const p = ((percent - arg.start) / arg.duration) * 100
				arg.fn(p)
			}
		}
	}
}

function progress(target) {
	const screen = target.querySelector('.screen')
	const screenY = screen.offsetTop
	const screenH = screen.offsetHeight
	const targetH = target.offsetHeight
	return Math.round((screenY / (targetH - screenH)) * 100)
}
function toPercent(arg, offset = undefined) {
	if (typeof arg === 'string') {
		if (arg === 'auto' && offset) return offset
		const n = parseInt(arg.replace('%', ''))
		if (n >= 0 && n <= 100) return n
	}
	if (typeof arg === 'number') {
		if (arg >= 0 && arg <= 1) {
			return arg * 100
		}
		if (arg > 1 && arg <= 100) {
			return arg
		}
	}
	return NaN
}
