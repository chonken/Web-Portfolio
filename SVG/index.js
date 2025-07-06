const NS = 'http://www.w3.org/2000/svg'

export function coord(id) {
  const pt = 15
  const pb = 30
  const pl = 30
  const pr = 15
  const width = 500
  const height = 500
  const contentW = width - pl - pr
  const contentH = height - pt - pb
  const lineXs = 6
  const lineYs = 6

  const svg = document.querySelector(id)
  svg.setAttributeNS(NS, 'viewBox', `0 0 ${width} ${height}`)
  const path = document.createElementNS(NS, 'path')

  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', '#ccc')
  path.setAttribute('stroke-width', 1)
  let d = ''
  for (let x = 0; x < lineXs; x++) {
    d += `M${pl + x * (contentW / (lineXs - 1))} ${pt} V${height - pb} `
  }
  for (let y = 0; y < lineYs; y++) {
    d += `M${pl} ${pt + y * (contentH / (lineYs - 1))} H${width - pr} `
  }
  path.setAttribute('d', d)
  if (svg.children?.length) svg.insertBefore(path, svg.children[0])
  else svg.appendChild(path)

  // 參數輸入: 最大值、區間、數量
  const yMax = 500
  const yMin = 0
  const ySpace = (yMax - yMin) / (lineYs - 1)
  const yGroup = document.createElementNS(NS, 'g')
  yGroup.classList.add('y-text')
  for (let i = 0; i < lineYs; i++) {
    const text = document.createElementNS(NS, 'text')
    text.setAttribute('x', '0')
    text.setAttribute('y', `${pt + (i * contentH) / (lineYs - 1)}`)
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('font-family', 'Arial')
    text.setAttribute('font-size', '16px')
    text.textContent = yMax - i * ySpace
    yGroup.appendChild(text)
  }
  svg.appendChild(yGroup)

  // 參數輸入: 最大值、區間、數量
  const xMax = 500
  const xMin = 0
  const xSpace = (xMax - xMin) / (lineXs - 1)
  const xGroup = document.createElementNS(NS, 'g')
  xGroup.classList.add('x-text')
  for (let i = 0; i < lineXs; i++) {
    const text = document.createElementNS(NS, 'text')
    text.setAttribute('x', `${pl + (i * contentW) / (lineXs - 1)}`)
    text.setAttribute('y', height)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'end')
    text.setAttribute('font-family', 'Arial')
    text.setAttribute('font-size', '16px')
    text.textContent = xMin + i * xSpace
    xGroup.appendChild(text)
  }
  svg.appendChild(xGroup)
}
