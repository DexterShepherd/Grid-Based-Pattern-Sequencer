import { Cell } from './Cell'

const saved = {}
const Store = {
  cells: {},
  commands: [],
  commandKeys: {}
}

Object.keys(saved).forEach(key => {
  Store.cells[key] = new Cell(saved[key].value)
})

export { Store }

window.logCells = () => {
  console.log(JSON.stringify(Store.cells))
}
