/**
 * 蜂巢佈局，目前慘不忍睹
 * 寫死的有: itemList數量，各個wrape的margin-top比例，ul為固定1:1
 * 存在問題: ul固定1:1且整體尺寸以容器(含.honeycomb以上之父容器)高度決定，因此高度大於寬度時，ul卡在上面無解
 * 尚未完成: 數量小於7的排列組合、除了正六角形排列外的排列組合、ul適應各數量的尺寸邏輯、
 * @param {NodeList} itemList 物品列
 * @param {Element} target 存放物品列的目標元素，將會被替換成新的元素
 * @param {number} transition 過渡時間(秒)，優先級: 參數 > 最終樣式 > 默認值 = 0.5
 * @returns 
 */
export function Honeycomb(itemList, target, transition = null) {
	const _t = parseInt(
		getComputedStyle(itemList[0]).transitionDuration.replace('s', '')
	)
	transition = transition || _t ? _t : 0.5

	// 蜂巢排列組合邏輯
	const newTarget = target.cloneNode(false)
	const len = itemList.length
	if (len !== 7) return // 測試用
	const turns = (len - 1) / 6 + 1
	const rows = turns * 2 - 1
	let columns = undefined || 3 // 測試3
	// const remaining = (len - 1) % 6
	let count = 0
	let wrap = document.createElement('div')
	wrap.classList.add('wrap')
	wrap.style.height = 100 / rows + '%'
	wrap.setAttribute('data-wrap', 0)
	if (turns < 2) {
		// 少於7的排列組合邏輯
	} else {
		let _r = 1
		for (let o = -(turns - 1); o <= turns - 1; o++) {
			const q = rows - Math.abs(o)

			for (let i = 0; i < q; i++) {
				itemList[count].setAttribute('data-item', i * 2 + Math.abs(o))
				wrap.append(itemList[count])
				count++
			}
			newTarget.append(wrap)
			wrap = document.createElement('div')
			wrap.classList.add('wrap')
			wrap.style.height = 100 / rows + '%'
			wrap.setAttribute('data-wrap', _r)
			_r++
		}

		// 剩餘數量的排列組合邏輯
	}

	// 佈局
	target.parentNode.replaceChild(newTarget, target)
	for (const item of itemList) {
		item.style.transitionDuration = transition + 's'
		item.style.transitionProperty = 'scale'
	}

	// 事件
	const zoomIn = 1.25
	const zoomOut = 0.75
	for (const item of itemList) {
		const wrap = parseInt(item.parentNode.getAttribute('data-wrap'))
		const self = parseInt(item.getAttribute('data-item'))
		item.onmouseenter = () => {
			item.style.scale = zoomIn

			const b = newTarget.querySelector(`[data-wrap='${wrap - 1}']`)
			if (b) {
				const bl = b.querySelector(`[data-item='${self - 1}']`)
				const br = b.querySelector(`[data-item='${self + 1}']`)
				if (bl) bl.style.scale = zoomOut
				if (br) br.style.scale = zoomOut
			}
			const s = newTarget.querySelector(`[data-wrap='${wrap}']`)
			const sl = s.querySelector(`[data-item='${self - 2}']`)
			const sr = s.querySelector(`[data-item='${self + 2}']`)
			if (sl) sl.style.scale = zoomOut
			if (sr) sr.style.scale = zoomOut
			const a = newTarget.querySelector(`[data-wrap='${wrap + 1}']`)
			if (a) {
				const al = a.querySelector(`[data-item='${self - 1}']`)
				const ar = a.querySelector(`[data-item='${self + 1}']`)
				if (al) al.style.scale = zoomOut
				if (ar) ar.style.scale = zoomOut
			}
		}
		item.onmouseleave = () => {
			item.style.scale = 1

			const b = newTarget.querySelector(`[data-wrap='${wrap - 1}']`)
			if (b) {
				const bl = b.querySelector(`[data-item='${self - 1}']`)
				const br = b.querySelector(`[data-item='${self + 1}']`)
				if (bl) bl.style.scale = 1
				if (br) br.style.scale = 1
			}
			const s = newTarget.querySelector(`[data-wrap='${wrap}']`)
			const sl = s.querySelector(`[data-item='${self - 2}']`)
			const sr = s.querySelector(`[data-item='${self + 2}']`)
			if (sl) sl.style.scale = 1
			if (sr) sr.style.scale = 1
			const a = newTarget.querySelector(`[data-wrap='${wrap + 1}']`)
			if (a) {
				const al = a.querySelector(`[data-item='${self - 1}']`)
				const ar = a.querySelector(`[data-item='${self + 1}']`)
				if (al) al.style.scale = 1
				if (ar) ar.style.scale = 1
			}
		}
	}
}
