const NS = 'http://www.w3.org/2000/svg'

/**
 * @typedef {Object} CoordData
 * @property {'number'|'string'} type - 資料類型，可為 'number' 或 'string'
 * @property {number} [min=100] - 數值型最小值（type 為 'number' 時適用）
 * @property {number} [max=500] - 數值型最大值（type 為 'number' 時適用）
 * @property {number} [splitNumber=5] - 分段數（含起點與終點）
 * @property {string[]} [datas] - 字串型刻度資料（type 為 'string' 時適用）
 */
export class Chart {
  /**
   * @param {string} selector - SVG 的選擇器
   * @param {Object} [options={}] - 設定參數
   * @param {'line'} [options.type='line'] - 圖表類型
   * @param {number} [options.width=500] - SVG 寬度
   * @param {number} [options.height=500] - SVG 高度
   * @param {number} [options.pt=15] - 上邊距
   * @param {number} [options.pb=30] - 下邊距
   * @param {number} [options.pl=30] - 左邊距
   * @param {number} [options.pr=15] - 右邊距
   * @param {CoordData} [options.xData] - x 軸設定資料
   * @param {CoordData} [options.yData] - y 軸設定資料
   */
  constructor(selector, options = {}) {
    this.svg = document.querySelector(selector)
    this.type = options.type || 'line'
    this.width = options.width || 500
    this.height = options.height || 500
    this.pt = options.pt || 15
    this.pb = options.pb || 30
    this.pl = options.pl || 30
    this.pr = options.pr || 15

    this.xData = options.xData || { type: 'number', min: 100, max: 500, splitNumber: 5 }
    this.yData = options.yData || { type: 'number', min: 100, max: 500, splitNumber: 5 }

    this.lineXs = this.xData.datas?.length || this.xData.splitNumber
    this.lineYs = this.yData.datas?.length || this.yData.splitNumber

    this.contentW = this.width - this.pl - this.pr
    this.contentH = this.height - this.pt - this.pb
  }

  render() {
    this.renderCoord()
    switch (this.type) {
      case 'line':
        this.renderLineChart()
        break
      case 'bar':
        this.renderBarChart()
        break
      case 'column':
        this.renderColumnChart()
        break
    }
  }

  renderCoord() {
    this.svg.setAttributeNS(NS, 'viewBox', `0 0 ${this.width} ${this.height}`)
    this.drawGrid()
    this.drawYLabels()
    this.drawXLabels()
  }

  renderLineChart(
    dataPoints = [
      { x: 100, y: 200 },
      { x: 200, y: 300 },
      { x: 300, y: 250 },
      { x: 400, y: 350 },
    ]
  ) {
    const group = document.createElementNS(NS, 'g')
    group.classList.add('line-chart')

    const points = dataPoints.map((point) => {
      // 尚未處理純字串輸入值
      const svgX = this.pl + ((point.x - this.xData.min) / (this.xData.max - this.xData.min)) * this.contentW
      const svgY = this.pt + (1 - (point.y - this.yData.min) / (this.yData.max - this.yData.min)) * this.contentH
      return { ...point, svgX, svgY }
    })

    // 畫點
    for (const p of points) {
      const circle = document.createElementNS(NS, 'circle')
      circle.setAttribute('cx', p.svgX)
      circle.setAttribute('cy', p.svgY)
      circle.setAttribute('r', 4)
      circle.setAttribute('fill', '#007bff')
      group.appendChild(circle)

      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', p.svgX + 6)
      text.setAttribute('y', p.svgY - 6)
      text.setAttribute('font-size', '14px')
      text.setAttribute('font-family', 'Arial')
      text.setAttribute('fill', '#333')
      text.textContent = p.x + ',' + p.y
      group.appendChild(text)
    }

    // 畫線
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const line = document.createElementNS(NS, 'line')
      line.setAttribute('x1', p1.svgX)
      line.setAttribute('y1', p1.svgY)
      line.setAttribute('x2', p2.svgX)
      line.setAttribute('y2', p2.svgY)
      line.setAttribute('stroke', '#007bff')
      line.setAttribute('stroke-width', 2)
      group.appendChild(line)
    }

    this.svg.appendChild(group)
  }

  drawGrid() {
    const path = document.createElementNS(NS, 'path')
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', '#ccc')
    path.setAttribute('stroke-width', 1)

    let d = ''
    for (let x = 0; x < this.lineXs; x++) {
      const xPos = this.pl + x * (this.contentW / (this.lineXs - 1))
      d += `M${xPos} ${this.pt} V${this.height - this.pb} `
    }
    for (let y = 0; y < this.lineYs; y++) {
      const yPos = this.pt + y * (this.contentH / (this.lineYs - 1))
      d += `M${this.pl} ${yPos} H${this.width - this.pr} `
    }

    path.setAttribute('d', d)
    if (this.svg.children?.length) {
      this.svg.insertBefore(path, this.svg.children[0])
    } else {
      this.svg.appendChild(path)
    }
  }

  drawYLabels() {
    const group = document.createElementNS(NS, 'g')
    group.classList.add('y-text')

    const labels = this.getLabels(this.yData)

    for (let i = 0; i < labels.length; i++) {
      const yPos = this.pt + (i * this.contentH) / (labels.length - 1)
      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', '0')
      text.setAttribute('y', `${yPos}`)
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('font-family', 'Arial')
      text.setAttribute('font-size', '16px')
      text.textContent = labels[labels.length - 1 - i]
      group.appendChild(text)
    }

    this.svg.appendChild(group)
  }

  drawXLabels() {
    const group = document.createElementNS(NS, 'g')
    group.classList.add('x-text')

    const labels = this.getLabels(this.xData)

    for (let i = 0; i < labels.length; i++) {
      const xPos = this.pl + (i * this.contentW) / (labels.length - 1)
      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', `${xPos}`)
      text.setAttribute('y', this.height)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'end')
      text.setAttribute('font-family', 'Arial')
      text.setAttribute('font-size', '16px')
      text.textContent = labels[i]
      group.appendChild(text)
    }

    this.svg.appendChild(group)
  }

  getLabels(data) {
    if (data.type === 'string' && Array.isArray(data.datas)) {
      return data.datas
    } else if (data.type === 'number') {
      const max = data.max ?? 500
      const min = data.min ?? 100
      const splitNumber = data.splitNumber ?? 5
      const space = (max - min) / (splitNumber - 1)
      return Array.from({ length: splitNumber }, (_, i) => (min + i * space).toFixed(2).replace(/\.00$/, ''))
    }
    return []
  }
}
