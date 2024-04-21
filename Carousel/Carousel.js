/**
 * @typedef {Object} SlideObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 */
/**
 * 平滑移動的輪播圖
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 0.5
 * @returns {SlideObj} 可調用 infinity()、stop()、next()、prev()
 */
export function Slide(itemList, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 0.5

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
		target.style.transitionDuration = transition + 's'
		target.style.transitionProperty = 'all'
		target.style.transform = `translateX(${offsetX}px)`
		i++
	}
	function previous() {
		i--
		offsetX += nodesOverallWidth[i < 0 ? len + i : i]
		target.style.transitionDuration = transition + 's'
		target.style.transitionProperty = 'all'
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

/**
 * @typedef {Object} FocusObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function(number|Element)} index - 跳轉到索引位置(數字 | 元素)
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 * @property {function} active - 目前元素
 * @property {function(number=)} zIndex - 設置z-index延遲(毫秒)，預設為400毫秒
 */
/**
 * 切換聚焦的輪播圖，``itemList``最少三個
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 0.5
 * @returns {FocusObj} 可調用 infinity()、stop()、index()、next()、prev()、active()、zIndex()
 */
export function Focus(itemList, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 0.5

	const len = itemList.length
	const width = target.clientWidth
	let i = 0

	for (const [key, item] of itemList.entries()) {
		item.style.transitionDuration = transition + 's'
		item.style.transitionProperty = 'transform, scale'
		item.style.zIndex = !key ? '1' : '-2'
		zoomOut(item, true)
	}

	zoomIn(itemList[i])
	zoomOut(itemList[i + 1], false)
	zIndex()

	function zoomIn(item) {
		item.style.scale = 1
		item.style.transform = `translateX(0)`
	}
	function zoomOut(item, isLeft = true) {
		item.style.scale = 0.5
		const w = width - item.offsetWidth * (1 / 2)
		item.style.transform = `translateX(${isLeft ? -w : w}px)`
	}
	function zIndex(delay = 400) {
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1
		const ll = l - 1 < 0 ? len - 1 : l - 1
		const rr = r + 1 >= len ? 0 : r + 1

		setTimeout(() => {
			itemList[i].style.zIndex = '1'
		}, transition * (delay / 2))
		setTimeout(() => {
			itemList[ll].style.zIndex = '-1'
			itemList[rr].style.zIndex = '-1'

			itemList[i].style.zIndex = '1'
			itemList[l].style.zIndex = '0'
			itemList[r].style.zIndex = '0'
		}, transition * delay)
	}

	/**
	 * @param {(number|Element)} index
	 */
	function index(index) {
		if (typeof index === 'number') {
			i = index
		} else {
			for (const [key, item] of itemList.entries()) {
				if (item === index) i = key
			}
		}

		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1

		zoomOut(itemList[l], true)
		zoomIn(itemList[i])
		zoomOut(itemList[r], false)
		zIndex()
	}
	function next() {
		i++

		i = i >= len ? 0 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1

		zoomOut(itemList[l], true)
		zoomIn(itemList[i])
		zoomOut(itemList[r], false)
		zIndex()
	}
	function previous() {
		i--

		i = i < 0 ? len - 1 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1

		zoomOut(itemList[l], true)
		zoomIn(itemList[i])
		zoomOut(itemList[r], false)
		zIndex()
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
	function active() {
		return itemList[i]
	}

	return {
		infinity: infinity,
		stop: () => {
			clearInterval(_id)
			_id = undefined
		},
		index: index,
		next: next,
		prev: previous,
		active: active,
		zIndex: zIndex,
	}
}

/**
 * @typedef {Object} FadeObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function(number)} index - 跳轉到索引位置(數字)
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 */
/**
 * 淡入淡出的輪播圖，最後一個會第一張顯示，
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 1
 * @returns {FadeObj} 可調用 infinity()、stop()、index()、next()、prev()
 * @returns
 */
export function Fade(itemList, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 1

	const len = itemList.length
	let i = len - 1

	for (const [key, item] of itemList.entries()) {
		item.style.transitionDuration = transition + 's'
		item.style.transitionProperty = 'opacity'
		if (key === len - 1) fadeIn(item)
		else fadeOut(item)
	}

	function fadeIn(item) {
		item.style.pointerEvents = 'auto'
		item.style.opacity = '1'
	}
	function fadeOut(item) {
		item.style.opacity = '0'
		item.style.pointerEvents = 'none'
	}

	function index(index) {
		fadeOut(itemList[i])
		i = index
		fadeIn(itemList[i])
	}
	function next() {
		console.log(1)
		fadeOut(itemList[i])
		i++
		i = i >= len ? 0 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1
		fadeIn(itemList[i])
	}
	function prev() {
		fadeOut(itemList[i])
		i--
		i = i < 0 ? len - 1 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1
		fadeIn(itemList[i])
	}
	let _id = undefined
	/**
	 * @param {number} sec 間隔秒數(毫秒)
	 */
	function infinity(sec = 5000) {
		// 	if (_id) return
		// 	_id = setInterval(() => {
		// 		next()
		// 	}, sec)
	}

	return {
		infinity: infinity,
		stop: () => {
			clearInterval(_id)
			_id = undefined
		},
		next: next,
		prev: prev,
		index: index,
	}
}
