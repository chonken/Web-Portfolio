const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

class Partical {
	constructor({
		size,
		x,
		y,
		color,
		move = { type: '', x: null, y: null },
		effect = null,
	}) {
		this.size = size
		this.x = x
		this.y = y
		this.color = color
		this.moveType = move.type
		if (move.type === 'distance') {
			this.speed = 300
			this.targetX = move.x
			this.targetY = move.y
			this.dX = move.x - this.x
			this.dY = move.y - this.y
		}
		if (move.type === 'speed') {
			this.speedX = move.x
			this.speedY = move.y
		}
		this.effect = effect
		this.gravity = 0
		this.resistance = 0.975
		this.accumulated = 0
		this.alive = true
	}

	move(offsetTime) {
		if (this.moveType === 'speed') {
			this.speedX *= this.resistance
			this.speedY *= this.resistance
			this.x += this.speedX * offsetTime
			this.y += this.speedY * offsetTime + this.gravity * 0.1
		}

		if (this.moveType === 'distance') {
			const _x = this.targetX - this.x
			const _y = this.targetY - this.y
			const _s = this.speed

			let _dX = 0
			let _dY = 0
			if (Math.abs(_x) > offsetTime * _s) _dX = _x > 0 ? _s : -_s
			if (Math.abs(_y) > offsetTime * _s) _dY = _y > 0 ? _s : -_s

			// this.x += Math.abs(_x) > 0.1 ? _x * offsetTime : 0
			// this.y += Math.abs(_y) > 0.1 ? _y * offsetTime : 0
			if (!_dX && !_dY) this.alive = false

			this.x += _dX * offsetTime + this.spiraling(_s, offsetTime)
			this.y += _dY * offsetTime
			this.resistance =
				(this.speed - 50) * ((this.dY - _y) / this.dY) * offsetTime
			this.speed -= this.resistance
		}
	}

	spiraling(speed, offsetTime) {
		this.accumulated += offsetTime * 50
		return (speed * Math.sin(this.accumulated)) / 300
	}

	draw(offsetTime) {
		this.move(offsetTime)
		this.gravity += 9.81 * offsetTime

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
	}
}
class Bloom {
	constructor({ x, y, type, magnitude, color = null, effect = null }) {
		this.x = x
		this.y = y
		this.type = type
		this.size = magnitude
		this.color = color
		this.effect = effect
		this.speed = 400
		this.quantity = 100
		this.alive = 1.5
		this.particals = []

		this._init()
	}

	_init() {
		switch (this.type) {
			case 'Chrysanthemum':
				if (this.size === 'huge') {
					this.quantity = 150
					this.speed = 600
				} else if (this.size === 'normal') {
					this.quantity = 100
					this.speed = 400
				} else if (this.size === 'tiny') {
					this.quantity = 30
					this.speed = 250
				}
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

		if (this.size === 'tiny') {
			this.alive = 1.5
		} else if (this.size === 'normal') {
			//
		} else if (this.size === 'huge') {
			//
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
		const layQua = Math.ceil(this.quantity / (layer / 2) / (layer - 1))
		let _q = this.quantity
		let _c = 0
		for (let l = 0; l < layer; l++) {
			const n = l * layQua < _q ? l * layQua : _q
			const r = this.speed * Math.sin(l * (Math.PI / 16))
			const radian = (2 * Math.PI) / n
			const seed = 10 + (layer - l) * 2

			for (let i = 0; i < n; i++) {
				const _sX = r * Math.cos(radian * i) + getRandom(-seed, seed)
				const _sY = r * Math.sin(radian * i) + getRandom(-seed, seed)
				const param = {
					size: 3.5,
					x: this.x,
					y: this.y,
					move: { type: 'speed', x: _sX, y: _sY },
					color: this.color,
				}
				this.particals.push(new Partical(param))

				_c++
			}
			_q -= n
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

	draw(offsetTime) {
		for (let p of this.particals) {
			p.draw(offsetTime)
		}
	}
}
class Flight {
	constructor({ x, height, color = null, effect = null }) {
		this.x = x
		this.height = height
		this.color = color
		this.effect = effect
		this.alive = true
		this.partical = this._init()
	}

	_init() {
		const param = {
			size: 3,
			x: this.x,
			y: cvs.height,
			move: {
				type: 'distance',
				x: this.x,
				y: this.height,
			},
			color: this.color,
		}
		return new Partical(param)
	}

	draw(offsetTime) {
		if (this.partical.alive) this.partical.draw(offsetTime)
		else this.alive = false
	}
}
class Fireworks {
	constructor() {
		this.TYPE = ['Chrysanthemum']
		this.COLOR = [
			[255, 0, 0],
			[255, 165, 0],
			[255, 255, 0],
			[0, 128, 0],
			[0, 0, 255],
			[128, 0, 128],
			[192, 192, 192],
			[255, 255, 255],
		]
		this.SIZE = ['huge', 'normal', 'tiny']
		this.fireworks = []
		this.lastTime = Date.now()
	}

	add({ x, type, magnitude, color, height } = {}) {
		x = x || getRandom(cvs.width * 0.1, cvs.width * 0.9)
		// const y = cvs.height,
		type = type || this.TYPE[0]
		magnitude = magnitude || this.SIZE[getRandom(0, 2)]
		color = color || this.COLOR[getRandom(0, 7)]
		// const effect = null
		if (!height) {
			if (magnitude === 'huge') {
				// 改響應式
				height = getRandom(100, 200)
			} else if (magnitude === 'normal') {
				height = getRandom(200, 300)
			} else if (magnitude === 'tiny') {
				height = getRandom(200, 400)
			}
		}

		this.fireworks.push({
			bloom: new Bloom({
				x: x,
				y: height,
				type: type,
				magnitude: magnitude,
				color: color,
			}),
			flight: new Flight({
				x: x,
				height: height,
				color: color,
			}),
		})
	}

	Animation() {
		ctx.fillStyle = 'rgba(0,0,0,0.15)'
		ctx.fillRect(0, 0, cvs.width, cvs.height)
		requestAnimationFrame(() => {
			return this.Animation()
		})

		const offsetTime = (Date.now() - this.lastTime) / 1000
		for (let i = 0; i < this.fireworks.length; i++) {
			const bloom = this.fireworks[i].bloom
			const flight = this.fireworks[i].flight

			if (bloom.alive <= 0 && !flight.alive) this.fireworks.splice(i, 1)

			if (flight.alive) {
				flight.draw(offsetTime)
			} else if (bloom.alive >= 0) {
				bloom.draw(offsetTime)
				bloom.alive -= offsetTime
			}
		}
		this.lastTime = Date.now()
	}
}

const fireworks = new Fireworks()
CanvasInit()

function CanvasInit() {
	/** @type {HTMLCanvasElement} */
	const width = window.innerWidth
	const height = window.innerHeight

	cvs.width = width
	cvs.height = height

	fireworks.Animation()
	fireworks.add({ magnitude: 'huge' })
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// 事件函數
cvs.onclick = (e) => {
	fireworks.add({ x: e.offsetX })
}
