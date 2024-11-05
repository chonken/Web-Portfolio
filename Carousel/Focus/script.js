import { Focus } from '../Carousel.js'

const next = document.querySelector('.carousel .next')
const prev = document.querySelector('.carousel .prev')
const target = document.getElementById("focus");
const itemList = target.querySelectorAll(".card");
console.log(next, prev)

prev.onclick = () =>  {
  focus.prev()
}
next.onclick = () =>  {
  focus.next()
}

const focus = Focus(itemList, target);
focus.infinity();

for (const item of itemList) {
  item.addEventListener("click", function () {
    if (focus.active() !== item) {
      focus.index(this);
    }
  });
  item.onmouseenter = () => {
    focus.stop();
  };
  item.onmouseleave = () => {
    focus.infinity();
  };
  item.querySelector("img").onerror = function () {
    this.src = "./assets/laptop-code-solid.svg";
  };
}
