const toggle = document.querySelector('.toggle')
const ul = document.querySelector('ul')
const itemList = document.querySelectorAll('li')

let clicked = false
toggle.addEventListener('click', (e) => {
	menuEvent(clicked)
	clicked = !clicked

	toggle.innerText = clicked ? 'X' : 'O'
})

const n = itemList.length
const deg = 360 / n
const speed = 0.06
/**
 * Menu surround
 * 
 * 原理：用transform-origin改變該元素transform的基準點，將基準點設遠離該元素，並根據數量多寡設置rotate的角度，以其基準點為中心畫出一個圓
 * @param {boolean} clicked 是否已點擊
 */
function menuEvent(clicked) {
	if (!clicked) {
		ul.style.top = 'calc(50% - 125px)'
		ul.style.transitionDelay = '0s'
        ul.style.opacity = 1
		itemList.forEach((item, i) => {
			item.style.transform = `rotate(${deg * i}deg)`
			item.style.transitionDuration = `${i * speed}s`
			item.style.transitionDelay = '0.5s'
		})
	} else {
		itemList.forEach((item, i) => {
			item.style.transform = `rotate(0deg)`
			item.style.transitionDuration = `${i * speed}s`
			item.style.transitionDelay = `${(n - i - 1) * speed}s`
		})
		ul.style.top = '25px'
		ul.style.transitionDelay = `${speed * 9}s`
        ul.style.opacity = 0
	}
}
