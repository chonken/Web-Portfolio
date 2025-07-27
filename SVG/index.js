'use strict'
const NS = 'http://www.w3.org/2000/svg'

/**
 * @typedef {Object} CoordData
 * @property {'number'|'string'} type - 資料類型，可為 'number' 或 'string'
 * @property {number} [min] - 數值型最小值（type 為 'number' 時適用）
 * @property {number} [max] - 數值型最大值（type 為 'number' 時適用）
 * @property {number} [splitNumber] - 分段數（含起點與終點）
 * @property {string[]} [labels] - 字串型刻度資料（type 為 'string' 時適用）
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
   * @param {Object[]} [options.data] - 資料
   * @param {CoordData} [options.xLabel] - x 軸設定資料
   * @param {CoordData} [options.yLabel] - y 軸設定資料
   */
  constructor(selector, options = {}) {
    this.svg = document.querySelector(selector)
    this.type = options.type || 'line'
    this.width = options.width || 500
    this.height = options.height || 500
    this.pt = options.pt || 20
    this.pb = options.pb || 30
    this.pl = options.pl || 40
    this.pr = options.pr || 15
    this.contentW = this.width - this.pl - this.pr
    this.contentH = this.height - this.pt - this.pb

    this.xLabel = options.xLabel
    this.yLabel = options.yLabel
    this.data = options.data
    this._init()
  }

  _init() {
    switch (this.type) {
      case 'line':
        this.xLabel = this.xLabel || { type: 'string', labels: ['A', 'B', 'C', 'D', 'E'], splitNumber: 5 }
        this.yLabel = this.yLabel || { type: 'number', min: 100, max: 500, splitNumber: 5 }
        this.xLabel.splitNumber = this.xLabel.splitNumber || this.xLabel.labels?.length
        this.yLabel.splitNumber = this.yLabel.splitNumber || this.yLabel.labels?.length
        this.data = this.data || [200, 400, 300, 500, 100]
        break
      case 'bar':
        break
      case 'column':
        this.xLabel = this.xLabel || { type: 'string', labels: ['A', 'B', 'C', 'D', 'E'], splitNumber: 5 }
        this.yLabel = this.yLabel || { type: 'number', min: 100, max: 500, splitNumber: 5 }
        this.xLabel.splitNumber = this.xLabel.splitNumber || this.xLabel.labels?.length
        this.yLabel.splitNumber = this.yLabel.splitNumber || this.yLabel.labels?.length
        this.data = this.data || [200, 400, 300, 500, 100]
        break
      case 'pie':
        break
    }
  }

  render() {
    switch (this.type) {
      case 'line':
        this.renderCoord()
        this.renderLineChart()
        break
      case 'bar':
        this.renderCoord()
        this.renderBarChart()
        break
      case 'column':
        this.renderCoord()
        this.renderColumnChart()
        break
      case 'pie':
        this.renderPieChart()
        break
    }
  }

  renderCoord() {
    this.svg.setAttributeNS(NS, 'viewBox', `0 0 ${this.width} ${this.height}`)
    this.drawGrid()
    this.drawYLabels()
    this.drawXLabels()
  }

  /**
   * 繪製折線圖
   */
  renderLineChart() {
    const group = document.createElementNS(NS, 'g')
    group.classList.add('line-chart')

    const points = this.data.map((data, i) => {
      const svgX = this.pl + (this.xLabel.type === 'number' ? (data - this.xLabel.min) / (this.xLabel.max - this.xLabel.min) : i / (this.xLabel.splitNumber - 1)) * this.contentW
      const svgY = this.pt + (this.yLabel.type === 'number' ? 1 - (data - this.yLabel.min) / (this.yLabel.max - this.yLabel.min) : i / (this.yLabel.splitNumber - 1)) * this.contentH
      return { ...data, svgX, svgY }
    })

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]

      // 畫點
      const circle = document.createElementNS(NS, 'circle')
      circle.setAttribute('cx', p1.svgX)
      circle.setAttribute('cy', p1.svgY)
      circle.setAttribute('r', 4)
      circle.setAttribute('fill', '#fff')
      circle.setAttribute('stroke', '#007bff')
      circle.setAttribute('stroke-width', 4)
      circle.style.cursor = 'pointer'
      circle.style.transition = '.4s'

      // 提示
      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', p1.svgX + 6)
      text.setAttribute('y', p1.svgY - 6)
      text.setAttribute('font-size', '14px')
      text.setAttribute('font-family', 'Arial')
      text.setAttribute('fill', '#333')
      text.textContent = this.data[i]
      text.style.opacity = 0
      text.style.transition = '.4s'
      circle.onmouseenter = () => ((text.style.opacity = 1), circle.setAttribute('r', 8))
      circle.onmouseleave = () => ((text.style.opacity = 0), circle.setAttribute('r', 4))

      // 畫線
      if (i < points.length - 1) {
        const line = document.createElementNS(NS, 'line')
        line.setAttribute('x1', p1.svgX)
        line.setAttribute('y1', p1.svgY)
        line.setAttribute('x2', p2.svgX)
        line.setAttribute('y2', p2.svgY)
        line.setAttribute('stroke', '#007bff')
        line.setAttribute('stroke-width', 2)
        group.appendChild(line)
      }

      group.appendChild(circle)
      group.appendChild(text)
    }

    this.svg.appendChild(group)
  }

  drawGrid() {
    const path = document.createElementNS(NS, 'path')
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', '#ccc')
    path.setAttribute('stroke-width', 1)

    let d = ''
    for (let x = 0; x < this.xLabel.splitNumber; x++) {
      const xPos = this.pl + x * (this.contentW / (this.xLabel.splitNumber - 1))
      d += `M${xPos} ${this.pt} V${this.height - this.pb} `
    }
    for (let y = 0; y < this.yLabel.splitNumber; y++) {
      const yPos = this.pt + y * (this.contentH / (this.yLabel.splitNumber - 1))
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

    const labels = this.getLabels(this.yLabel)

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

    const labels = this.getLabels(this.xLabel)

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

  getLabels(label) {
    if (label.type === 'string' && Array.isArray(label.labels)) {
      return label.labels
    } else if (label.type === 'number') {
      const max = label.max ?? 500
      const min = label.min ?? 100
      const splitNumber = label.splitNumber ?? 5
      const space = (max - min) / (splitNumber - 1)
      return Array.from({ length: splitNumber }, (_, i) => (min + i * space).toFixed(2).replace(/\.00$/, ''))
    }
    return []
  }
}
