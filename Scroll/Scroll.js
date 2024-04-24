/**
 * 還沒寫完
 * 存在問題: 在快速往回滾動的請況下，會出現開頭>0就滾出滾動事件區域，導致未正確往回撥放之最初狀態。在目標元素滾到一半時刷新頁面，會導致再次滾動之前會是初始狀態，並非播放一半，且之前撥放完的動畫也會初始化
 * 等待補完往回超出區域後補0、當刷新後撥放全部動畫一次，解決上面問題
 * @param {*} targetScroll 
 * @param {*} target 
 * @param {*} fn 
 */
export function Animation(targetScroll, target, fn) {
	window.addEventListener('scroll', () => {
		const scroll = targetScroll.scrollY
		if (
			scroll >= target.offsetTop &&
			scroll <= target.offsetTop + target.offsetHeight
		) {
			fn(progress(target))
		}
	})
}

function progress(target) {
	const screen = target.querySelector('.screen')
	const screenY = screen.offsetTop
	const screenH = screen.offsetHeight
	const elementH = target.offsetHeight
	return Math.round((screenY / (elementH - screenH)) * 100)
}
