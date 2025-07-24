import { Chart } from '../index.js'

new Chart('#svg', {
  yData: {
    type: 'number',
    min: 100,
    max: 500,
    splitNumber: 5,
  },
  xData: {
    type: 'number',
    min: 100,
    max: 500,
    splitNumber: 5,
  },
}).render()
