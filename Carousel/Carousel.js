/**
 * @typedef {Object} CarouselObject
 * @property {function(number)} infinity - 無限撥放下一張，間隔秒數(毫秒)
 * @property {function} stop - 停止撥放
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 */
/**
 * 平滑移動的輪播圖
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @returns {CarouselObject} 可調用 infinity()、next()、prev()
 */
export function Slide(itemList, target) {
	const fragmentBefore = document.createDocumentFragment()
	const fragmentAfter = document.createDocumentFragment()
	const len = itemList.length
	let nodesOverallWidth = new Array(len).fill(0)
	let i = 0
	let offsetX = 0
	let initX = 0

	nodesOverallWidth = nodesOverallWidth.map((_, i) => {
		const c = getComputedStyle(itemList[i])
		const w = parseFloat(c.width.replace('px', ''))
		const ml = parseFloat(c.marginLeft.replace('px', ''))
		const mr = parseFloat(c.marginRight.replace('px', ''))
		const t = w + ml + mr

		initX += t
		return t
	})
	target.style.left = -initX + 'px'
	itemList.forEach((node) => {
		fragmentBefore.append(node.cloneNode(true))
		fragmentAfter.append(node.cloneNode(true))
	})
	target.append(fragmentBefore)
	target.append(fragmentAfter)
	target.ontransitionend = function () {
		if (Math.abs(i) >= len) {
			target.style.transition = '0s'
			target.style.transform = `translateX(0px)`
			offsetX = 0
			i = 0
		}
	}

	function next() {
		offsetX -= nodesOverallWidth[i < 0 ? len + i : i]
		target.style.transition = '0.5s'
		target.style.transform = `translateX(${offsetX}px)`
		i++
	}
	function previous() {
		i--
		offsetX += nodesOverallWidth[i < 0 ? len + i : i]
		target.style.transition = '0.5s'
		target.style.transform = `translateX(${offsetX}px)`
	}
	let _id = undefined
	/**
	 * @param {number} sec 間隔秒數(毫秒)
	 */
	function infinity(sec = 5000) {
		if (_id) return

		_id = setInterval(() => {
			next()
		}, sec)
	}

	return {
		infinity: infinity,
		stop: () => {
			clearInterval(_id)
			_id = undefined
		},
		next: next,
		prev: previous,
	}
}

export function Focus(){
	
}