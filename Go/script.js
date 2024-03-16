let go = undefined
let move = 0
let koFight = []
let moveRecord = []

const board = document.querySelector('.board')

GameStart()

function GoInit() {
	return Array.from({ length: 19 }, () => Array(19).fill(0))
}

function GameStart() {
	go = GoInit()
	CreateStone(9, 9, board)
	move = 1
}
function GamePause() {}
function GameOver() {}

function SetStone(x, y) {
	const _DIRECTION = [
		[0, -1],
		[1, 0],
		[0, 1],
		[-1, 0],
	]
	let _computedCaptured = undefined

	if (_validate()) {
		go[x][y] = move
		if (_computedCaptured()) _capture(_computedCaptured())

		CreateStone(x, y, board)

		move += 1
	} else {
		return false
	}
	// console.table(go)

	function _validate() {
		// 同時滿足此步棋: 下在空地、不在劫禁中、不是自殺棋
		// 執行計算提子數
		if (go[x][y] !== 0) return false

		if (koFight[0] === x && koFight[1] === y) return
		else koFight = []

		_computedCaptured = (() => {
			let _hasExcuted = false
			let _captured = []

			return function () {
				if (!_hasExcuted) {
					const _enemy = (move + 1) % 2

					for (let i = 0; i < 4; i++) {
						const _nextX = x + _DIRECTION[i][0]
						const _nextY = y + _DIRECTION[i][1]

						if (_inChecked(_nextX, _nextY, _captured)) continue

						const _res = _searchLiberty(_nextX, _nextY, _enemy)

						if (_res) {
							_captured.push(..._res)
						}
					}

					_hasExcuted = true
				}

				return _captured.length !== 0 ? _captured : false
			}
		})()

		if (_isCapture()) {
			if (_isKo()) {
				console.log(1)
				koFight = _computedCaptured()[0]
			}
		} else if (_isSuicide()) {
			return false
		}

		return true
	}
	function _capture(_captured) {
		_captured.forEach((i) => {
			const stone = board.querySelector(`[data-move="${go[i[0]][i[1]]}"]`)
			RemoveStone(stone)
			go[i[0]][i[1]] = 0
		})
	}
	function _searchLiberty(_x, _y, camp, _checked = []) {
		// console.log(x, y, ' => ', _x, _y, ' c => ', ..._checked)
		if (!InRange(_x, _y)) return _checked

		let _valid = true
		let _self = go[_x][_y]

		// 判斷是否有氣
		const liberty = _self === 0 && (_x !== x || _y !== y)
		// 判斷是不是同陣營棋子
		const distinctCamp = _self !== 0 && _self % 2 === camp

		if (liberty) {
			return false
		} else if (distinctCamp) {
			// inTemp保險
			_checked.push([_x, _y])
			for (let i = 0; i < 4; i++) {
				const _nextX = _x + _DIRECTION[i][0]
				const _nextY = _y + _DIRECTION[i][1]

				if (_inChecked(_nextX, _nextY, _checked)) continue

				const _res = _searchLiberty(_nextX, _nextY, camp, _checked)

				if (!_res) {
					_valid = false
					break
				}
				_checked = _res
			}
		}

		return _valid ? _checked : false
	}
	function _inChecked(_x, _y, _checked) {
		return _checked.some((arr) => arr[0] === _x && arr[1] === _y)
	}

	function _isCapture() {
		return _computedCaptured() ? true : false
	}
	function _isKo() {
		// 如果此步棋下在四周被敵方棋子包圍，且可以吃掉敵方一子，此情況就一定是劫
		const _ally = move % 2
		const _isCapturedOne = _computedCaptured()?.length === 1 || false
		let _isSurrounded = true

		for (let i = 0; i < 4; i++) {
			const _x = x + _DIRECTION[i][0]
			const _y = y + _DIRECTION[i][1]

			if (!InRange(_x, _y)) continue

			if (go[_x][_y] === 0 || go[_x][_y] % 2 === _ally)
				_isSurrounded = false
		}

		return _isSurrounded && _isCapturedOne
	}
	function _isSuicide() {
		// 如果此步會導致自身亦或是其周圍之友軍沒有氣，此步就是自殺棋
		const _ally = move % 2

		go[x][y] = move
		const _res = _searchLiberty(x, y, _ally)
		go[x][y] = 0

		return _res ? true : false
	}
}
function SetPositionOfStone(x, y, stone) {
	stone.style.top = `${2.575 + x * 5}%`
	stone.style.left = `${2.575 + y * 5}%`
}

function CreateStone(x, y, container) {
	const stone = document.createElement('div')
	stone.setAttribute('data-move', move)

	stone.classList.add('stone')

	if (move === 0) {
		stone.classList.add('preview-next', 'dark')
	} else {
		stone.classList.add(move % 2 === 1 ? 'dark' : 'light')
	}

	SetPositionOfStone(x, y, stone)

	container.appendChild(stone)
}
function RemoveStone(stone) {
	// 移到棋盤旁
	stone.remove()
}

function InRange(_x, _y) {
	return _x >= 0 && _x <= 18 && _y >= 0 && _y <= 18
}
function RecordMove() {}
function Scoring(method) {}

function checkGo() {
	console.table(go)
}

// 事件函數
const stoneSize = board.clientHeight / 20
board.addEventListener('click', function (e) {
	const { mouseX, mouseY } = ComputeMousePosition(e)

	SetStone(
		Math.round(mouseY / stoneSize) - 1,
		Math.round(mouseX / stoneSize) - 1
	)

	// console.log(mouseY / stoneSize - 1, mouseX / stoneSize - 1)
})
const MOUSELIMIT = board.clientHeight / 40
let lastX = 0
let lastY = 0
board.addEventListener('mousemove', function (e) {
	const { mouseX, mouseY } = ComputeMousePosition(e)

	// const distanceX = Math.abs(mouseX - lastMouseX)
	// const distanceY = Math.abs(mouseY - lastMouseY)
	const x = Math.round(mouseY / stoneSize) - 1
	const y = Math.round(mouseX / stoneSize) - 1

	// if (distanceX + distanceY > MOUSELIMIT) {
	if (x !== lastX || y !== lastY) {
		const previewStone = board.querySelector(`[data-move="0"]`)
		if (!InRange(x, y)) return
		if (move % 2 === 1 || move === 0) {
			previewStone.classList.remove('light')
			previewStone.classList.add('dark')
		} else {
			previewStone.classList.remove('dark')
			previewStone.classList.add('light')
		}

		SetPositionOfStone(x, y, previewStone)

		lastX = x
		lastY = y
	}
})

// 一般函數
function ComputeMousePosition(event) {
	const rect = board.getBoundingClientRect()
	// 邊框5px
	const mouseX = event.clientX - rect.left - 5
	const mouseY = event.clientY - rect.top - 5

	return { mouseX, mouseY }
}
// Canvas
;(function () {
	const cvs = document.querySelector('canvas')
	const ctx = cvs.getContext('2d')
	const _cellSize =
		Math.round((board.clientHeight * 0.9) / 18) * devicePixelRatio
	const _cvsSize = _cellSize * 18 + 2
	cvs.width = _cvsSize
	cvs.height = _cvsSize

	for (let i = 0; i < 19; i++) {
		const _size = _cellSize * i + 1
		// 水平線
		ctx.moveTo(0, _size)
		ctx.lineTo(cvs.width, _size)
		// 垂直線
		ctx.moveTo(_size, 0)
		ctx.lineTo(_size, cvs.width)
	}
	ctx.strokeStyle = '#fff'
	ctx.lineWidth = 2
	ctx.stroke()

	for (let x = 1; x <= 5; x += 2) {
		for (let y = 1; y <= 5; y += 2) {
			// 星位
			ctx.beginPath()
			ctx.arc(
				x * 3 * _cellSize,
				y * 3 * _cellSize,
				_cellSize / 4,
				0,
				Math.PI * 2
			)
			ctx.fillStyle = '#fff'
			ctx.fill()
		}
	}
})()
