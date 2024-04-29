/**
 * @typedef {Object} SlideObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 * @property {function(number)} index - 跳轉到索引位置(數字)
 */
/**
 * 平滑移動的輪播圖
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 0.5
 * @returns {SlideObj} 可調用 infinity()、stop()、index()、next()、prev()
 */
export function Slide(itemList, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 0.5

	const fragmentBefore = document.createDocumentFragment()
	const fragmentAfter = document.createDocumentFragment()
	const len = itemList.length
	let nodesOverallWidth = []
	let i = 0
	let offsetX = 0
	let initX = 0

	for (let i = 0; i < len; i++) {
		const c = getComputedStyle(itemList[i])
		const w = parseFloat(c.width.replace('px', ''))
		const ml = parseFloat(c.marginLeft.replace('px', ''))
		const mr = parseFloat(c.marginRight.replace('px', ''))
		const t = w + ml + mr

		initX += t
		nodesOverallWidth.push(t)
	}
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
	function index(index) {
		offsetX = 0
		for (let i = 0; i < index; i++) {
			nodesOverallWidth[i]
		}
		target.style.transitionDuration = transition + 's'
		target.style.transitionProperty = 'all'
		target.style.transform = `translateX(${offsetX}px)`
		i = index
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
 * @property {function(number=)} delay - 設置z-index延遲(毫秒)，預設為400毫秒
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
	delay()

	function zoomIn(item) {
		item.style.scale = 1
		item.style.transform = `translateX(0)`
	}
	function zoomOut(item, isLeft = true) {
		item.style.scale = 0.5
		const w = width - item.offsetWidth * (1 / 2)
		item.style.transform = `translateX(${isLeft ? -w : w}px)`
	}
	function delay(delay = 400) {
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
		delay()
	}
	function next() {
		i++

		i = i >= len ? 0 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1

		zoomOut(itemList[l], true)
		zoomIn(itemList[i])
		zoomOut(itemList[r], false)
		delay()
	}
	function previous() {
		i--

		i = i < 0 ? len - 1 : i
		const l = i - 1 < 0 ? len - 1 : i - 1
		const r = i + 1 >= len ? 0 : i + 1

		zoomOut(itemList[l], true)
		zoomIn(itemList[i])
		zoomOut(itemList[r], false)
		delay()
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
		delay: delay,
	}
}

/**
 * @typedef {Object} FadeObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function(number)} index - 跳轉到索引位置(數字)
 * @property {function} active - 回傳目前索引的元素
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 */
/**
 * 淡入淡出的輪播圖，最後一個會第一張顯示，
 * @param {NodeList} itemList 輪播圖的物品列
 * @param {Element} target 存放物品列的目標元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 1
 * @returns {FadeObj} 可調用 infinity()、stop()、index()、next()、prev()、active()
 */
export function Fade(itemList, transition = null) {
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
	function active(){
		return itemList[i]
	}
	function next() {
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
		active: active,
	}
}

/**
 * @typedef {Object} GalleryObj
 * @property {function(number=)} infinity - 無限撥放下一張，間隔秒數(毫秒)，預設為5000毫秒
 * @property {function} stop - 停止撥放
 * @property {function(number)} index - 跳轉到索引位置(數字)
 * @property {function} next - 撥放下一張
 * @property {function} prev - 撥放上一張
 */
/**
 * 像畫廊一樣的輪播圖，垂直的物品會被包在.wrpae裡，控制.wrape寬度以適應版面所需，可設置垂直物品的數量控制高度
 * @param {NodeList} itemList 輪播圖的物品列，將會被重新包裝
 * @param {number} verticle 垂直物品的數量
 * @param {Element} target 存放物品列的目標元素，將會被替換成新的元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 0.5
 * @returns {GalleryObj} 可調用 infinity()、stop()、index()、next()、prev()
 */
export function Gallery(itemList, verticle, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 0.5

	// 重新編排元素結構
	const newTarget = target.cloneNode(false)
	const fragmentF = document.createDocumentFragment()
	const fragmentS = document.createDocumentFragment()
	const fragmentT = document.createDocumentFragment()
	let wrapeF = document.createElement('div')
	let wrapeS = document.createElement('div')
	let wrapeT = document.createElement('div')
	_wrpe(wrapeF)
	_wrpe(wrapeS)
	_wrpe(wrapeT)
	for (const [key, item] of itemList.entries()) {
		wrapeF.appendChild(item)
		wrapeS.appendChild(item.cloneNode(true))
		wrapeT.appendChild(item.cloneNode(true))

		if ((key + 1) % verticle === 0) {
			fragmentF.appendChild(wrapeF)
			fragmentS.appendChild(wrapeS)
			fragmentT.appendChild(wrapeT)

			wrapeF = document.createElement('div')
			wrapeS = document.createElement('div')
			wrapeT = document.createElement('div')
			_wrpe(wrapeF)
			_wrpe(wrapeS)
			_wrpe(wrapeT)
		}
	}
	function _wrpe(wrpe) {
		wrpe.classList.add('wrap')
	}
	newTarget.appendChild(fragmentF)
	newTarget.appendChild(fragmentS)
	newTarget.appendChild(fragmentT)
	target.parentNode.replaceChild(newTarget, target)

	// 輪播
	const wrapes = newTarget.querySelectorAll('.wrap')
	const len = wrapes.length / 3
	let nodesOverallWidth = []
	let i = 0
	let offsetX = 0
	let initX = 0

	for (let i = 0; i < len; i++) {
		const c = getComputedStyle(wrapes[i])
		const w = parseFloat(c.width.replace('px', ''))
		const ml = parseFloat(c.marginLeft.replace('px', ''))
		const mr = parseFloat(c.marginRight.replace('px', ''))
		const t = w + ml + mr

		initX += t
		nodesOverallWidth.push(t)
	}
	newTarget.style.left = -initX + 'px'
	newTarget.ontransitionend = function () {
		if (Math.abs(i) >= len) {
			newTarget.style.transition = '0s'
			newTarget.style.transform = `translateX(0px)`
			offsetX = 0
			i = 0
		}
	}

	function next() {
		offsetX -= nodesOverallWidth[i < 0 ? len + i : i]
		newTarget.style.transitionDuration = transition + 's'
		newTarget.style.transitionProperty = 'all'
		newTarget.style.transform = `translateX(${offsetX}px)`
		i++
	}
	function previous() {
		i--
		offsetX += nodesOverallWidth[i < 0 ? len + i : i]
		newTarget.style.transitionDuration = transition + 's'
		newTarget.style.transitionProperty = 'all'
		newTarget.style.transform = `translateX(${offsetX}px)`
	}
	function index(index) {
		offsetX = 0
		for(let i = 0; i < index; i++){
			nodesOverallWidth[i]
		}
		newTarget.style.transitionDuration = transition + 's'
		newTarget.style.transitionProperty = 'all'
		newTarget.style.transform = `translateX(${offsetX}px)`
		i = index
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
		index: index,
	}
}
