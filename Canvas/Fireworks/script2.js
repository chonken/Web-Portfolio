const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

class Partical {
	constructor({ size, x, y, color }) {
		this.size = size
		this.x = x
		this.y = y
		this.color = color
		this.opacity = 1
		this.lastTime = Date.now()
	}

	draw() {
		if (this.opacity <= 0) return

		const offsetTime = (Date.now() - this.lastTime) / 1000

		// this.x += this.speedX * offsetTime
		// this.y += this.speedY * offsetTime
		// this.speedX *= 0.98
		// this.speedY *= 0.98
		const r = this.color[0]
		const g = this.color[1]
		const b = this.color[2]
		this.opacity -= offsetTime * 3.5

		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`
		ctx.fill()

		this.lastTime = Date.now()
	}
}
class Bloom {
	constructor({ x, y, type, magnitude, color = null, effect = null }) {
		const COLOR = [
			[255, 0, 0],
			[255, 165, 0],
			[255, 255, 0],
			[0, 128, 0],
			[0, 0, 255],
			[128, 0, 128],
			[192, 192, 192],
			[255, 255, 255],
		]
		this.x = x
		this.y = y
		this.type = type
		this.size = magnitude
		this.color = color || COLOR[getRandom(0, 7)]
		this.effect = effect
		this.speedX = undefined
		this.speedY = undefined
		this.speed = 500
		this.alive = 1.5
		this.fallen = 1
		this.pObj = {}
		this.particals = []
		this.lastTime = Date.now()
	}

	ball() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		const quantity = 250
		for (let i = 0; i < quantity; i++) {
			const pn = i % 2 ? 1 : -1
			const _sZ = getRandom(-this.speed, this.speed)

			const _sX = this.speed * Math.cos(i * ((Math.PI * 2) / quantity))
			const _sY = pn * Math.sqrt(this.speed ** 2 - _sX ** 2 - _sZ ** 2)
			const x = this.x + _sX * offsetTime
			const y = this.y + _sY * offsetTime

			const param = {
				size: 2,
				x: x,
				y: y,
				color: this.color,
			}
			this.particals.push(new Partical(param))
		}
	}
	chrysanthemum() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		const layer = 8
		let _c = 0
		for (let l = 0; l < layer; l++) {
			const n = 1 + l * 5
			const r = this.speed * Math.sin(l * (Math.PI / 16))
			const radian = (2 * Math.PI) / n

			for (let i = 0; i < n; i++) {
				if (this.pObj[_c]) {
					this.pObj[_c]['sX'] *= 0.98
					this.pObj[_c]['sY'] *= 0.98
					this.pObj[_c]['x'] += this.pObj[_c]['sX'] * offsetTime
					this.pObj[_c]['y'] += this.pObj[_c]['sY'] * offsetTime
				} else {
					this.pObj[_c] = {}
					this.pObj[_c]['sX'] = r * Math.cos(radian * i)
					this.pObj[_c]['sY'] = r * Math.sin(radian * i)
					this.pObj[_c]['x'] =
						this.x + this.pObj[_c]['sX'] * offsetTime
					this.pObj[_c]['y'] =
						this.y + this.pObj[_c]['sY'] * offsetTime
				}

				this.fallen +=
					this.fallen <= 50
						? (this.fallen * offsetTime) / 50
						: offsetTime

				const param = {
					size: 2,
					x: this.pObj[_c]['x'],
					y: this.pObj[_c]['y'] + this.fallen,
					color: this.color,
				}
				this.particals.push(new Partical(param))

				_c++
			}
		}
	}
	peony() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		//
	}
	saturn() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		const quantity = 40
		const _sZ = getRandom(this.speed / 4, (this.speed * 3) / 4)
		let tilt = getRandom(0, Math.PI)
		for (let i = 0; i < quantity; i++) {
			const radian = i * ((Math.PI * 2) / quantity)
			const _sX = this.speed * Math.cos(radian)
			const _sY = _sZ * Math.sin(radian)
			// 矩陣轉換
			this.speedX = _sX * Math.cos(tilt) - _sY * Math.sin(tilt)
			this.speedY = _sX * Math.sin(tilt) + _sY * Math.cos(tilt)

			const param = {
				size: 2,
				x: 500,
				y: 400,
				color: color,
			}
			this.particals.push(new Partical(param))
		}
	}
	willow() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		//
	}
	flower() {
		const offsetTime = (Date.now() - this.lastTime) / 1000
		const quantity = 250
		for (let i = 0; i < quantity; i++) {
			const pn = i % 2 ? 1 : -1
			const _s = i + 1
			this.speedX = _s * Math.sin((quantity / 360) * i)
			this.speedY = pn * Math.sqrt(_s ** 2 - this.speedX ** 2)

			const param = {
				size: 2,
				x: 500,
				y: 400,
				color: color,
			}
			this.particals.push(new Partical(param))
		}
	}

	draw() {
		switch (this.type) {
			case 'Chrysanthemum':
				this.chrysanthemum()
				break
			case 'Peony':
				this.peony()
				break
			case 'Saturn':
				this.saturn()
				break
			case 'Willow':
				this.willow()
				break
		}

		const f = Date.now()
		for (let p of this.particals) {
			if (!p) continue

			if (p.opacity <= 0) p = null
			else p.draw()
		}

		this.lastTime = Date.now()
	}
}
class Fireworks {
	constructor(type, magnitude, color = null, effect = null) {
		this.type = type
		this.size = magnitude
		this.bloom = []
		this.lastTime = Date.now()

		this._init()
	}
	// constructor(type, magnitude, color = null, effect = null) {
	// 	this.type = type
	// 	this.size = magnitude
	// 	this.color = color
	// 	this.effect = effect
	// 	this.speedX = undefined
	// 	this.speedY = undefined
	// 	this.particals = this._init()
	// }

	// _init() {
	// 	const SPEED = 300
	// 	const COLOR = [
	// 		[255, 0, 0],
	// 		[255, 165, 0],
	// 		[255, 255, 0],
	// 		[0, 128, 0],
	// 		[0, 0, 255],
	// 		[128, 0, 128],
	// 		[192, 192, 192],
	// 		[255, 255, 255],
	// 	]
	// 	const particals = []
	// 	const color = COLOR[getRandom(0, 7)]

	// 	const ball = () => {
	// 		const quantity = 250
	// 		for (let i = 0; i < quantity; i++) {
	// 			const pn = i % 2 ? 1 : -1
	// 			const _sZ = getRandom(-SPEED, SPEED)

	// 			this.speedX = SPEED * Math.cos(i * ((Math.PI * 2) / quantity))
	// 			this.speedY =
	// 				pn * Math.sqrt(SPEED ** 2 - this.speedX ** 2 - _sZ ** 2)

	// 			const param = {
	// 				size: 2,
	// 				x: 500,
	// 				y: 400,
	// 				color: color,
	// 			}
	// 			particals.push(new Partical(param))
	// 		}
	// 	}
	// 	const chrysanthemum = () => {
	// 		const layer = 8
	// 		for (let l = 0; l < layer; l++) {
	// 			const n = 1 + l * 5
	// 			const r = SPEED * Math.sin(l * (Math.PI / 16))
	// 			const radian = (2 * Math.PI) / n

	// 			for (let i = 0; i < n; i++) {
	// 				this.speedX = r * Math.cos(radian * i)
	// 				this.speedY = r * Math.sin(radian * i)

	// 				const param = {
	// 					size: 2,
	// 					x: 500,
	// 					y: 400,
	// 					color: color,
	// 				}
	// 				particals.push(new Partical(param))
	// 			}
	// 		}
	// 	}
	// 	const peony = () => {
	// 		//
	// 	}
	// 	const saturn = () => {
	// 		const quantity = 40
	// 		const _sZ = getRandom(SPEED / 4, (SPEED * 3) / 4)
	// 		let tilt = getRandom(0, Math.PI)
	// 		for (let i = 0; i < quantity; i++) {
	// 			const radian = i * ((Math.PI * 2) / quantity)
	// 			const _sX = SPEED * Math.cos(radian)
	// 			const _sY = _sZ * Math.sin(radian)
	// 			// 矩陣轉換
	// 			this.speedX = _sX * Math.cos(tilt) - _sY * Math.sin(tilt)
	// 			this.speedY = _sX * Math.sin(tilt) + _sY * Math.cos(tilt)

	// 			const param = {
	// 				size: 2,
	// 				x: 500,
	// 				y: 400,
	// 				color: color,
	// 			}
	// 			particals.push(new Partical(param))
	// 		}
	// 	}
	// 	const willow = () => {
	// 		//
	// 	}
	// 	const flower = () => {
	// 		const quantity = 250
	// 		for (let i = 0; i < quantity; i++) {
	// 			const pn = i % 2 ? 1 : -1
	// 			const _s = i + 1
	// 			this.speedX = _s * Math.sin((quantity / 360) * i)
	// 			this.speedY = pn * Math.sqrt(_s ** 2 - this.speedX ** 2)

	// 			const param = {
	// 				size: 2,
	// 				x: 500,
	// 				y: 400,
	// 				color: color,
	// 			}
	// 			particals.push(new Partical(param))
	// 		}
	// 	}

	// 	switch (this.type) {
	// 		case 'Chrysanthemum':
	// 			chrysanthemum()
	// 			break
	// 		case 'Peony':
	// 			peony()
	// 			break
	// 		case 'Saturn':
	// 			saturn()
	// 			break
	// 		case 'Willow':
	// 			willow()
	// 			break
	// 	}

	// 	return particals
	// }

	_init() {
		this.bloom.push(
			new Bloom({
				x: 500,
				y: 400,
				type: 'Chrysanthemum',
				magnitude: 'big',
			})
		)
	}

	Animation() {
		ctx.clearRect(0, 0, cvs.width, cvs.height)
		requestAnimationFrame(() => {
			return this.Animation()
		})

		const offsetTime = (Date.now() - this.lastTime) / 1000
		for (let b = 0; b < this.bloom.length; b++) {
			if (this.bloom[b].alive <= 0) {
				this.bloom.splice(b, 1)
			} else {
				this.bloom[b].draw()
				this.bloom[b].alive -= offsetTime
			}
		}
		this.lastTime = Date.now()
	}
}
const fireworks = new Fireworks('Chrysanthemum', 'big')
fireworks.Animation()

CanvasInit()

function CanvasInit() {
	/** @type {HTMLCanvasElement} */
	const width = window.innerWidth
	const height = window.innerHeight

	cvs.width = width
	cvs.height = height
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
