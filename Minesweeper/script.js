let origin = []
let difficulty = 0 // 0: Beginner, 2: Intermediate, 3: Expert
let mines = 1
let board = []

GameStart()
function GameStart() {
	difficulty = 0 // click diff
	Init()
}
function GameOver(isWin) {
	if (isWin) console.log('贏了')
	else console.log('你已經輸了')
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
		const x = Math.floor(_random / width)
		const y = _random % width
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
	if (origin[y][x] < 0) {
		if (origin[y][x] === -1) GameOver(false)
		else return
	} else if (origin[y][x] === 0) {
		_findSpace([x, y])
	} else {
		board[y][x] = origin[y][x]
	}

	if (!origin.some((row) => row.includes(0))) GameOver(true)

	function _findSpace(cur) {
		console.log(cur)
		origin[cur[1]][cur[0]] = -2
		board[cur[1]][cur[0]] = 0
		for (let i = 0; i < 4; i++) {
			const x = cur[0] + DIRECTION[i][0]
			const y = cur[1] + DIRECTION[i][1]
			const maxX = origin[0].length - 1
			const maxY = origin.length - 1
			const overflow = x < 0 || x > maxX || y < 0 || y > maxY
			if (overflow) continue
			if (origin[y][x] > 0) {
				board[y][x] = origin[y][x]
				continue
			}
			if (origin[y][x] !== 0) continue

			console.log(i)
			_findSpace([x, y])
		}
	}
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function check() {
	console.table(board)
	console.table(origin)
}
