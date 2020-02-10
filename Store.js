import { Cell } from './Cell'

const saved = {
  '4:2': { value: 'P' },
  '5:2': { value: '1' },
  '4:3': { value: 'D' },
  '5:3': { value: '1' },
  '5:4': { value: '0' },
  '5:5': { value: '0' },
  '5:6': { value: '0' },
  '4:7': { value: 'O' },
  '5:7': { value: '1' }
}
const Store = {
  cells: {},
  commands: []
}

Object.keys(saved).forEach(key => {
  Store.cells[key] = new Cell(saved[key].value)
})

export { Store }

window.logCells = () => {
  console.log(JSON.stringify(Store.cells))
}
