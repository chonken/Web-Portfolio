const container = document.querySelector(".container");
const frames = container.querySelectorAll(".frame");
const width = container.clientWidth;
const height = container.clientHeight;

container.addEventListener("mousedown", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  lookAt(x, y, true);

  container.onmousemove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    lookAt(x, y, false);
  };
});
container.addEventListener("mouseup", function () {
  this.onmousemove = null;
  for (const frame of frames) {
    frame.firstElementChild.style.animationPlayState = "running";
    frame.style.transition = "0.5s linear";
    frame.style.transform = `rotate(0)`;
  }
});

function lookAt(x, y, transition) {
  for (const frame of frames) {
    const selfX = frame.offsetLeft + frame.clientWidth / 2;
    const selfY = frame.offsetTop + frame.clientHeight / 2;

    const rx = ((x - selfX) / width) * 100;
    const ry = -((y - selfY) / height) * 100;
    frame.firstElementChild.style.animationPlayState = "paused";
    frame.style.transition = transition ? "0.8s cubic-bezier(0.2, 1, 0.9, 0.99)" : "none";
    frame.style.transform = `rotateX(${ry}deg) rotateY(${rx}deg)`;
  }
}
