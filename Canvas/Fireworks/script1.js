const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

class Partical {
	constructor({ size, x, y, speedX, speedY, color }) {
		this.size = size
		this.x = x
		this.y = y
		this.speedX = speedX
		this.speedY = speedY
		this.color = color
		this.fallen = 1
		this.lastTime = Date.now()
	}

	draw() {
		const offsetTime = (Date.now() - this.lastTime) / 1000

		this.x += this.speedX * offsetTime
		this.y += (this.speedY + this.fallen) * offsetTime
		this.speedX *= 0.98
		this.speedY *= 0.98
		this.fallen *= this.fallen < 50 ? 1.1 : 1
		const r = this.color[0]
		const g = this.color[1]
		const b = this.color[2]

		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		ctx.fillStyle = `rgba(${r},${g},${b},1)`
		ctx.fill()

		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI)
		ctx.fillStyle = `white`
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
		this.speed = 500
		this.alive = 1.5
		this.particals = []

		this._init()
	}

	_init() {
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
		const layer = 8
		let _c = 0
		for (let l = 0; l < layer; l++) {
			const n = 1 + l * 5
			const r = this.speed * Math.sin(l * (Math.PI / 16))
			const radian = (2 * Math.PI) / n

			for (let i = 0; i < n; i++) {
				const _sX = r * Math.cos(radian * i)
				const _sY = r * Math.sin(radian * i)
				const param = {
					size: 5,
					x: this.x,
					y: this.y,
					speedX: _sX,
					speedY: _sY,
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
		for (let p of this.particals) {
			p.draw()
		}
	}
}
class Fireworks {
	constructor(type, magnitude, color = null, effect = null) {
		this.type = type
		this.size = magnitude
		this.color = color
		this.effect = effect
		this.bloom = []
		this.lastTime = Date.now()

		this._init()
	}

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
		// ctx.globalAlpha = 0.1
		ctx.fillStyle = 'rgba(0,0,0,0.1)'
		ctx.fillRect(0, 0, cvs.width, cvs.height)
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
