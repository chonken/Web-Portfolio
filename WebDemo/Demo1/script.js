const body = document.querySelector('body')
const menuBtn = document.querySelector('.menuBtn')
const menuBtnSpan = document.querySelectorAll('span')
const nav = document.querySelector('nav')
const partnerList = document.querySelectorAll('.partner li')
const partners = document.querySelector('.partner ul')
const skills = document.querySelectorAll('.skills ul')
const skillList = document.querySelectorAll('.skills ul li')
const customers = document.querySelector('.customer ul')
const customerEntire = document.querySelector('.customer .entire')
const customerCarousel = document.querySelector('.customer .carousel')
const menuBtnAniToggle = () => {
	let active = false
	return () => {
		if (active) {
			menuBtnSpan[0].style.transform = 'rotate(0)'
			menuBtnSpan[1].style.opacity = '1'
			menuBtnSpan[2].style.transform = 'rotate(0)'
			menuBtnSpan[2].style.borderTop = '3px solid darkred'
		} else {
			menuBtnSpan[0].style.transform = 'rotate(45deg)'
			menuBtnSpan[1].style.opacity = '0'
			menuBtnSpan[2].style.transform = 'rotate(-45deg)'
			menuBtnSpan[2].style.borderTop = '1px solid darkred'
		}
		active = !active
	}
}

;(function Init() {
	PartnerCarousel()
	AddCanvas()
	CustomerCarousel(30)
})()
/**
 * 合作夥伴的輪播圖
 * !當網頁失去焦點一會兒後，會出現過度效果跳過頭的情況
 */
function PartnerCarousel() {
	const fragment = document.createDocumentFragment()
	const len = partnerList.length
	let nodesOverallWidth = new Array(len).fill(0)
	// 假如放在全域執行，偶爾會出現getComputedStyle算錯，可能是未加載完整
	window.onload = () => {
		nodesOverallWidth = nodesOverallWidth.map((_, i) => {
			const c = getComputedStyle(partnerList[i])
			const w = parseFloat(c.width.replace('px', ''))
			const ml = parseFloat(c.marginLeft.replace('px', ''))
			const mr = parseFloat(c.marginRight.replace('px', ''))
			return w + ml + mr
		})
		partnerList.forEach((node) => {
			fragment.append(node.cloneNode(true))
		})
		partners.append(fragment)
	}

	let i = 0
	let offsetX = 0
	partners.ontransitionend = function () {
		if (i >= len) {
			this.style.transition = '0s'
			partners.style.transform = `translateX(0px)`
			offsetX = 0
			i = 0
		}
	}
	setInterval(() => {
		offsetX += nodesOverallWidth[i]
		partners.style.transition = '0.5s'
		partners.style.transform = `translateX(-${offsetX}px)`
		i++
	}, 1000)
}

function AddCanvas() {
	skillList.forEach(function (item) {
		item.append(Arrow(item.clientWidth / 2))
	})
}

function Arrow(radius) {
	/** @type {HTMLCanvasElement} */
	const cvs = document.createElement('canvas')
	const ctx = cvs.getContext('2d')
	const px = devicePixelRatio
	radius *= px

	cvs.width = radius * 2
	cvs.height = radius * 2

	ctx.lineWidth = px
	ctx.strokeStyle = 'darkgray'

	ctx.beginPath()
	ctx.arc(radius, radius, radius - px, 0, Math.PI * (330 / 180))
	ctx.stroke()

	return cvs
}
/**
 * @param {Number} q 數量必須是3的倍數
 */
function CustomerCarousel(quantity) {
	let percent = 0
	if (window.innerWidth > 1180) {
		return
	} else if (window.innerWidth > 850) {
		percent = 25
	} else if (window.innerWidth > 540) {
		percent = 33.3
	} else {
		percent = 50
	}

	const q = Math.floor(quantity / 3)
	const list = Array.from(customerEntire.children)
	const fragmentF = document.createDocumentFragment()
	const fragmentS = document.createDocumentFragment()

	let wrap = document.createElement('div')
	let clone = document.createElement('div')
	wrap.classList.add('wrap')
	clone.classList.add('wrap')
	let _c = 0
	list.forEach((item) => {
		if (_c > 2) {
			fragmentF.appendChild(wrap)
			wrap = document.createElement('div')
			wrap.classList.add('wrap')
			fragmentS.appendChild(clone)
			clone = document.createElement('div')
			clone.classList.add('wrap')
			_c = 1
		} else _c++

		wrap.appendChild(item)
		clone.appendChild(item.cloneNode(true))
	})
	customerCarousel.appendChild(fragmentF)
	customerCarousel.appendChild(fragmentS)

	let _q = q - 1
	customerCarousel.ontransitionend = () => {
		if (_q < 1) {
			customerCarousel.style.transition = '0s'
			customerCarousel.style.transform = `translateX(0)`
			offsetX = percent
			_q = q - 1
		}
	}
	let offsetX = percent
	setInterval(() => {
		customerCarousel.style.transition = '0.5s'
		customerCarousel.style.transform = `translateX(-${offsetX}%)`
		offsetX += percent
		_q--
	}, 1000)
}

// 事件函數
/**
 * !無法控制到before after的動畫
 */
menuBtn.addEventListener('click', menuBtnAniToggle())
menuBtn.addEventListener('click', () => {
	body.classList.toggle('over-hidden')
	// !過度失效
	nav.classList.toggle('active')
})
