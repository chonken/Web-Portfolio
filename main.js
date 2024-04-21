import { Slide } from './Carousel/Carousel.js'

/** @type {HTMLCanvasElement} */
const banner = document.getElementById('banner')
const coverCtx = banner.getContext('2d')

const cards = document.querySelectorAll('.card')
const game = document.getElementById('game')
const canvas = document.getElementById('canvas')
const scroll = document.getElementById('scroll')
const menu = document.getElementById('menu')
const carousel = document.getElementById('carousel')
const web = document.getElementById('web')

const POINT_SIZE = 10
const MAX_POINTS = 36
const MAX_DISTANCE = 250

const goSidePoint = Math.sqrt(MAX_POINTS)
const menuSidePoint = (MAX_POINTS - 6) / 3

class Point {
	constructor(size) {
		this.overflow = this.rebound
		this.move = true
		this.size = size
		this.x = getRandom(size, window.innerWidth - size)
		this.y = getRandom(size, window.innerHeight - size)
		this.speedX = getRandom(-50, 50)
		this.speedY = getRandom(-50, 50)
		this.lastTime = Date.now()
	}

	/**
	 * @param {number} x 目標x座標
	 * @param {number} y 目標y座標
	 */

	rebound() {
		if (this.x < this.size / 2) {
			this.x = this.size / 2
			this.speedX = -this.speedX
		}
		if (this.x > banner.width - this.size / 2) {
			this.x = banner.width - this.size / 2
			this.speedX = -this.speedX
		}
		if (this.y < this.size / 2) {
			this.y = this.size / 2
			this.speedY = -this.speedY
		}
		if (this.y > banner.height - this.size / 2) {
			this.y = banner.height - this.size / 2
			this.speedY = -this.speedY
		}
	}
	arroundY() {
		if (this.x < this.size / 2) {
			this.x = this.size / 2
			this.speedX = -this.speedX
		}
		if (this.x > banner.width - this.size / 2) {
			this.x = banner.width - this.size / 2
			this.speedX = -this.speedX
		}
		if (this.y < this.size / 2) {
			this.y = banner.height - this.size / 2
		}
		if (this.y > banner.height - this.size / 2) {
			this.y = this.size / 2
		}
	}

	specDraw(x, y) {
		const offsetTime = (Date.now() - this.lastTime) / 500
		const _x = x - this.x
		const _y = y - this.y

		this.x = Math.abs(_x) > 0.1 ? this.x + _x * offsetTime : x
		this.y = Math.abs(_y) > 0.1 ? this.y + _y * offsetTime : y

		this._draw()
	}
	randDraw() {
		if (this.move) {
			this.overflow()

			const offsetTime = (Date.now() - this.lastTime) / 1000
			this.x += this.speedX * offsetTime
			this.y += this.speedY * offsetTime
		}
		this._draw()
	}

	_draw() {
		coverCtx.beginPath()
		coverCtx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2)
		coverCtx.fillStyle = '#fff'
		coverCtx.fill()

		this.lastTime = Date.now()
	}
}
class Graph {
	constructor(maxPoints, pointSize, maxDistance) {
		this.drawPoint = { method: 'random', fn: undefined }
		this.maxDistance = maxDistance
		this.maxPoints = maxPoints
		this.points = new Array(maxPoints).fill(0).map(() => {
			return new Point(pointSize)
		})
	}

	changeSpeedX(speed) {
		for (let p = 0; p < this.maxPoints; p++) {
			this.points[p].speedX = speed
		}
	}
	changeSpeedY(speed) {
		for (let p = 0; p < this.maxPoints; p++) {
			this.points[p].speedY = speed
		}
	}
	recoverySpeed() {
		for (let p = 0; p < this.maxPoints; p++) {
			this.points[p].speedX = getRandom(-50, 50)
			this.points[p].speedY = getRandom(-50, 50)
		}
	}

	/**
	 * @param {String} method rebound: 反彈, arroundY: Y軸環繞, arroundX: X軸環繞
	 */
	overflow(method) {
		for (let p = 0; p < this.maxPoints; p++) {
			if (method === 'rebound') {
				this.points[p].overflow = this.points[p].rebound
			}
			if (method === 'arroundY') {
				this.points[p].overflow = this.points[p].arroundY
			}
		}
	}

	/**
	 * @param {String} formation go: 正四方實心隊形, menu: 垂直矩形中空靠左隊形
	 * @param {Number} width 關鍵邊長的長度
	 */
	align(formation, width) {
		if (formation === 'go') {
			this.drawPoint.method = 'specific'
			this.drawPoint.fn = () => {
				const min = Math.min(banner.width, banner.height)
				const gap = min / (width + 1)
				let marginX = 0
				let marginY = 0
				if (min === banner.width) {
					marginX = gap
					marginY = (banner.height - gap * (width - 1)) / 2
				} else {
					marginX = (banner.width - gap * (width - 1)) / 2
					marginY = gap
				}
				for (let y = 0; y < width; y++) {
					for (let x = 0; x < width; x++) {
						const _x = marginX + x * gap
						const _y = marginY + y * gap
						this.points[y * width + x].specDraw(_x, _y)
					}
				}
			}
		}

		//去頭去尾去第二，剩餘三角排列
		if (formation === 'menu') {
			this.drawPoint.method = 'specific'
			this.drawPoint.fn = () => {
				const _h = width * 2 + 3
				const gap = banner.height / (_h + 1)
				const marginY = gap / 2
				const marginX = gap * 3
				for (let y = 0; y < _h; y++) {
					for (let x = 0; x < 2; x++) {
						const _isOdd = y % 2 !== 0
						if (y === 0 || y === _h - 1) {
							const _x = marginX + (1 + x * 2) * gap
							const _y = marginY + y * gap
							let i = undefined

							if (y === 0) i = 0
							else i = Math.ceil(y * 1.5) + 1
							this.points[i + x].specDraw(_x, _y)
						} else if (y === 1) {
							const _x = marginX + x * 4 * gap
							const _y = marginY + gap
							this.points[2 + x].specDraw(_x, _y)
						} else {
							if (!_isOdd) {
								const _x = marginX + gap * 2
								const _y = marginY + gap * y
								const i = 4 + Math.ceil((y - 2) * 1.5)
								this.points[i].specDraw(_x, _y)

								continue
							} else {
								const _x = marginX + x * 4 * gap
								const _y = marginY + gap * y
								const i = 5 + Math.floor((y - 3) * 1.5)
								this.points[i + x].specDraw(_x, _y)
							}
						}
					}
				}
			}
		}
	}
	random() {
		this.drawPoint = { method: 'random', fn: undefined }
	}

	draw() {
		coverCtx.clearRect(0, 0, banner.width, banner.height)
		requestAnimationFrame(() => {
			return this.draw()
		})

		for (let s = 0; s < this.maxPoints; s++) {
			for (let e = s + 1; e < this.maxPoints; e++) {
				this._drawLine(s, e)
			}
		}

		if (this.drawPoint.method === 'random') {
			for (let s = 0; s < this.maxPoints; s++) {
				this.points[s].randDraw()
			}
		}
		if (this.drawPoint.method === 'specific') {
			this.drawPoint.fn()
		}
	}

	animateStart() {
		this.draw()
		for (let s = 0; s < this.maxPoints; s++) {
			this.points[s].move = true
		}
	}
	animateStop() {
		for (let s = 0; s < this.maxPoints; s++) {
			this.points[s].move = false
		}
	}

	/**
	 * @param {number} start 起始的points[索引]
	 * @param {number} end 結束的points[索引]
	 */
	_drawLine(start, end) {
		const _x = this.points[start].x - this.points[end].x
		const _y = this.points[start].y - this.points[end].y
		const distance = Math.sqrt(Math.abs(_x ** 2) + Math.abs(_y ** 2))
		const opacity = 1 - distance / this.maxDistance

		coverCtx.beginPath()
		coverCtx.moveTo(this.points[start].x, this.points[start].y)
		coverCtx.lineTo(this.points[end].x, this.points[end].y)
		coverCtx.closePath()
		coverCtx.lineWidth = 1
		coverCtx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
		coverCtx.stroke()
	}
}

const graph = new Graph(MAX_POINTS, POINT_SIZE, MAX_DISTANCE)
const position = {} // { element: { top, bottom, width, height }, ... }

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

Init()
function Init() {
	CoverInit()
	CoverElemAni()

	const DOM = {
		game: {
			ul: game.querySelector('ul'),
			li: game.querySelectorAll('li'),
			next: game.querySelector('.next'),
			prev: game.querySelector('.prev'),
			des: game.querySelector('.describe'),
		},
		canvas: {}
	}
	;(async () => {
		const res = await fetch('./exhibit.json')
		const data = await res.json()

		GameInit(data.Game, DOM.game)
		CanvasInit(data.Canvas, DOM.canvas)
	})()
}
function CoverInit() {
	banner.width = window.innerWidth
	banner.height = window.innerHeight

	graph.animateStart()

	cards.forEach((element) => {
		const x = getRandom(50, banner.clientWidth - element.offsetWidth - 50)
		const y = getRandom(50, banner.clientHeight - element.offsetHeight - 50)
		element.style.transform = `translate(${x}px, ${y}px)`
		const _c = {
			top: y,
			left: x,
			width: element.offsetWidth,
			height: element.offsetHeight,
		}
		position[element.id] = _c

		element.onclick = () => {
			location = '#' + element.id.slice(1)
		}
		element.onmouseenter = () => {
			graph.align(element.id, goSidePoint)
		}
		element.onmouseleave = () => {
			graph.random()
		}
	})
}
function CoverElemAni() {
	const SPEED = 50
	let lastTime = Date.now()
	const animate = {
		state: true,
		stop() {
			if (this.state) this.state = false
		},
		start() {
			if (!this.state) {
				this.state = true
				lastTime = Date.now()
				move()
			}
		},
	}
	class Position {
		constructor(target) {
			this.target = target
			this.left = position[target.id].left
			this.top = position[target.id].top
			this.width = position[target.id].width
			this.height = position[target.id].height
			this.signX = getRandom(0, 1) ? -1 : 1
			this.signY = getRandom(0, 1) ? -1 : 1
			this.speedX = getRandom(10, SPEED)
			this.speedY = Math.floor(Math.sqrt(SPEED ** 2 - this.speedX ** 2))
		}
		moveX(offsetTime) {
			const clientWidth = document.body.clientWidth
			if (this.left <= 0) {
				this.signX = 1
				this.left = 1
			} else if (this.left >= clientWidth - this.width) {
				this.signX = -1
				this.left = clientWidth - this.width - 1
			} else this.left += this.speedX * offsetTime * this.signX

			position[this.target.id].left = this.left
		}
		moveY(offsetTime) {
			if (this.top <= 0) {
				this.signY = 1
				this.top = 1
			} else if (this.top >= banner.height - this.height) {
				this.signY = -1
				this.top = banner.height - this.height - 1
			} else this.top += this.speedY * offsetTime * this.signY

			position[this.target.id].top = this.top
		}
		collider() {
			for (let key in position) {
				if (key === this.target.id) continue

				const value = position[key]
				const _rX =
					_inRange(this.left + this.width, [
						value.left,
						value.left + value.width,
					]) ||
					_inRange(this.left, [value.left, value.left + value.width])
				const _rY =
					_inRange(this.top, [value.top, value.top + value.height]) ||
					_inRange(this.top + this.height, [
						value.top,
						value.top + value.height,
					])
				if (_rX && _rY) {
					const r = Math.abs(this.left + this.width - value.left)
					const l = Math.abs(this.left - (value.left + value.width))
					const t = Math.abs(this.top - (value.top + value.height))
					const b = Math.abs(this.top + this.height - value.top)

					const min = Math.min(r, l, t, b)
					if (r === min) {
						this.signX = -1
					} else if (l === min) {
						this.signX = 1
					}
					if (t === min) {
						this.signY = 1
					} else if (b === min) {
						this.signY = -1
					}
				}
			}
		}
	}
	const pos = []

	cards.forEach((target) => {
		pos.push(new Position(target))
	})
	;(function move() {
		if (animate.state) requestAnimationFrame(move)

		const offsetTime = (Date.now() - lastTime) / 1000
		for (const p of pos) {
			p.moveX(offsetTime)
			p.moveY(offsetTime)
			p.collider()
			p.target.style.transform = `translate(${p.left}px, ${p.top}px)`
		}
		lastTime = Date.now()
	})()

	/**
	 * @param {Number} value -
	 * @param {Array} block - [top, bottom] or [left, right]
	 * @returns {Boolean} -
	 */
	function _inRange(value, block) {
		return value >= block[0] && value <= block[1]
	}
}
function GameInit(data, dom) {
	// 自動加入所有Game底下的遊戲到ul裡
	const fragment = document.createDocumentFragment()
	let _c = 0
	for (const item in data) {
		const li = document.createElement('li')
		const img = document.createElement('img')
		img.setAttribute('src', `./Images/Game_${item}_0.gif`)
		li.append(img)
		li.setAttribute('data-game', item)
		fragment.append(li)
		_c++
	}
	for (let i = 0; i < Math.min(_c, dom.li.length); i++) {
		dom.li[i].remove()
	}
	dom.ul.append(fragment)
	dom.li = dom.ul.querySelectorAll('li') // 更新li

	// 輪播圖模組
	const gameCaro = Slide(dom.li, dom.ul)
	dom.li = dom.ul.querySelectorAll('li') // 更新li
	gameCaro.infinity()
	dom.next.onclick = () => {
		gameCaro.next()
	}
	dom.prev.onclick = () => {
		gameCaro.prev()
	}
	// 描述
	for (const item of dom.li) {
		const g = item.getAttribute('data-game')
		item.onmouseenter = () => {
			dom.des.style.opacity = '1'
			dom.des.textContent = g ? data[g].des : '尚未開發'
			gameCaro.stop()
		}
		item.onmouseleave = () => {
			dom.des.textContent = ''
			dom.des.style.opacity = '0'
			gameCaro.infinity()
		}
		item.querySelector('img').onerror = function() {
			this.src = './assets/laptop-code-solid.svg'
		}
		if (g){
			item.onclick =()=>{
				location = `./Game/${g}/`
			}
		}
		
	}
}
function CanvasInit (data, dom){

}

// go.onclick = () => {
// 	window.location = './Game/Go/'
// }
// go.onmouseenter = () => {
// 	graph.align('go', goSidePoint)
// }
// go.onmouseleave = () => {
// 	graph.random()
// }
// minesweeper.onclick = () => {
// 	window.location = './Game/Minesweeper/'
// }
// minesweeper.onmouseenter = () => {
// 	graph.align('go', goSidePoint)
// }
// minesweeper.onmouseleave = () => {
// 	graph.random()
// }
// fireworks.onclick = () => {
// 	window.location = './Canvas/Fireworks/'
// }
// fireworks.onmouseenter = () => {
// 	graph.overflow('arroundY')
// 	graph.changeSpeedY(-100)
// }
// fireworks.onmouseleave = () => {
// 	graph.overflow('rebound')
// 	graph.recoverySpeed()
// }
// menuSur.onclick = () => {
// 	window.location = './Menu/Surround/'
// }
// menuSur.onmouseenter = () => {
// 	graph.align('menu', menuSidePoint)
// }
// menuSur.onmouseleave = () => {
// 	graph.random()
// }
// scrollAni.onclick = () => {
// 	window.location = './Scrolling%20Effect/Animation/'
// }
// scrollAni.onmouseenter = () => {
// 	graph.overflow('arroundY')
// 	graph.changeSpeedY(-100)
// }
// scrollAni.onmouseleave = () => {
// 	graph.overflow('rebound')
// 	graph.recoverySpeed()
// }
// scrollSli.onclick = () => {
// 	window.location = './Scrolling%20Effect/Slideshow/'
// }
// scrollSli.onmouseenter = () => {
// 	graph.overflow('arroundY')
// 	graph.changeSpeedY(-100)
// }
// scrollSli.onmouseleave = () => {
// 	graph.overflow('rebound')
// 	graph.recoverySpeed()
// }
// web.onclick = () => {
// 	window.location = './WebDemo/Demo1/'
// }
