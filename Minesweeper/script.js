const start = document.querySelector('.start')
const beginner = document.getElementById('beginner')
const intermediate = document.getElementById('intermediate')
const expert = document.getElementById('expert')
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

let origin = []
let difficulty = 0 // 0: Beginner, 2: Intermediate, 3: Expert
let mines = 1
let board = []

function GameStart() {
	Init()
}
function GameOver(isWin) {
	cvs.onclick = null

	// cavas 動畫
	if (isWin) window.alert('贏了')
	else window.alert('你已經輸了')

	start.style.display = 'flex'
}

function Init() {
	let width = 0
	let height = 0
	if (difficulty === 0) {
		width = 9
		height = 9
		mines = 9
	} else if (difficulty === 1) {
		width = 16
		height = 16
		mines = 40
	} else if (difficulty === 2) {
		width = 30
		height = 24
		mines = 99
	}

	board = Array.from({ length: height }, () => Array(width).fill('[]'))
	origin = Array.from({ length: height }, () => Array(width).fill(0))

	// 先用一維模擬二維，取一維的亂數index，再依index轉origin位置
	const len = width * height
	let _origin = Array.from({ length: len }, (_, index) => index)
	for (let i = len - 1; i >= len - mines; i--) {
		const r = getRandom(0, i)

		const _random = _origin[r]
		const x = _random % width
		const y = Math.floor(_random / width)
		_setNum(x, y)
		origin[y][x] = -1

		_origin[r] = _origin[i]
	}

	function _setNum(x, y) {
		for (let _x = x - 1; _x <= x + 1; _x++) {
			if (_x < 0 || _x >= width) continue

			for (let _y = y - 1; _y <= y + 1; _y++) {
				if (_y < 0 || _y >= height) continue
				const isMines = origin[_y][_x] === -1 || (_x === x && _y === y)
				if (isMines) continue

				origin[_y][_x] += 1
			}
		}
	}
}

function Click(x, y) {
	const DIRECTION = [
		[-1, 0],
		[1, 0],
		[0, 1],
		[0, -1],
	]
	let res = []

	if (origin[y][x] < 0) {
		if (origin[y][x] === -1) return false
		else return [[x, y]]
	} else if (origin[y][x] === 0) {
		_findSpace([x, y])
	} else {
		board[y][x] = origin[y][x]
		return [[x, y]]
	}

	// if (!origin.some((row) => row.includes(0))) return true

	function _findSpace(cur) {
		origin[cur[1]][cur[0]] = -2
		board[cur[1]][cur[0]] = 0
		res.push(`[${cur[0]}, ${cur[1]}]`)
		for (let i = 0; i < 4; i++) {
			const x = cur[0] + DIRECTION[i][0]
			const y = cur[1] + DIRECTION[i][1]
			const maxX = origin[0].length - 1
			const maxY = origin.length - 1
			const overflow = x < 0 || x > maxX || y < 0 || y > maxY
			if (overflow) continue
			if (origin[y][x] > 0) {
				board[y][x] = origin[y][x]
				res.push(`[${x}, ${y}]`)
				continue
			}
			if (origin[y][x] !== 0) continue

			_findSpace([x, y])
		}
	}

	return [...new Set(res)].map(JSON.parse)
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// 事件函數
beginner.onclick = () => {
	difficulty = 0
	GameStart()
	setCanvas()
	start.style.display = 'none'
}
intermediate.onclick = () => {
	difficulty = 1
	GameStart()
	setCanvas()
	start.style.display = 'none'
}
expert.onclick = () => {
	difficulty = 2
	GameStart()
	setCanvas()
	start.style.display = 'none'
}

// canvas
function setCanvas() {
	/** @type {HTMLCanvasElement} */
	const _bh = window.innerHeight * 0.8
	const _c = _bh / board.length < 25 ? 25 : _bh / board.length
	const cell = Math.floor(_c)

	const width = cell * board[0].length
	const height = cell * board.length

	cvs.width = width
	cvs.height = height

	ctx.beginPath()
	for (let x = 0; x <= board[0].length; x++) {
		for (let y = 0; y <= board.length; y++) {
			const _x = y * cell
			const _y = x * cell

			ctx.fillStyle = (x + y) % 2 ? '#86D58A' : '#68CA6D'

			ctx.fillRect(_x, _y, cell, cell)
		}
	}
	ctx.closePath()

	cvs.onclick = (e) => {
		const x = Math.floor(e.offsetX / cell)
		const y = Math.floor(e.offsetY / cell)

		const res = Click(x, y)
		if (typeof res === 'boolean') {
			GameOver(res)
		} else {
			ctx.font = cell + 'px sans-serif'
			ctx.fillStyle = '#000'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			res.forEach((pos) => {
				const num = origin[pos[1]][pos[0]]
				const originX = Math.round(cell * pos[0] + cell / 2)
				const originY = Math.floor(cell * pos[1] + cell / 2 + 3)

				ctx.fillText(num, originX, originY, cell, cell)
			})
		}

		const _rem = board.reduce((s, r) => {
			return s + r.reduce((_s, i) => _s + (i === '[]'), 0)
		}, 0)
		if (_rem === mines) GameOver(true)
	}
}

function check() {
	console.table(board)
	console.table(origin)
}
