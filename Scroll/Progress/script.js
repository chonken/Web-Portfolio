const slide = document.querySelector('.slide')
const fade = document.querySelector('.fade')
const slideY = slide.offsetHeight
const fadeY = fade.offsetHeight

window.addEventListener('scroll', () => {
	const scrollY = Math.round(window.scrollY)
	if (
		scrollY >= slide.offsetTop &&
		scrollY <= slide.offsetTop + slide.offsetHeight
	) {
		slideProgress(progress(slide))
	} else if (
		scrollY >= fade.offsetTop &&
		scrollY <= fade.offsetTop + fade.offsetHeight
	) {
		fadeProgress(progress(fade))
	}
})

function progress(element) {
	const screen = element.querySelector('.screen')
	const screenY = screen.offsetTop
	const screenH = screen.offsetHeight
	const elementH = element.offsetHeight
	return Math.round((screenY / (elementH - screenH)) * 100)
}

const slideArea = document.querySelector('.slide-area')
function slideProgress(progress) {
	slideArea.style.left = -(100 - progress) + '%'
	slideArea.style.opacity = (progress - 30) / 50
}

const fadeArea = fade.querySelectorAll('.card')
function fadeProgress(progress) {
	const deg = Math.round(progress * 3.6)
	fadeArea.forEach((item, index) => {
		item.style.transform = `perspective(500px) rotateX(${deg}deg)`
		item.style.opacity = (progress - index * 33) / (80 - index * 33)
	})
}
