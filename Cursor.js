import { Store } from './Store'
import { Parser } from './Parser'
import { Cell } from './Cell'

class CursorSingleton {
  constructor([x, y]) {
    this.x = x
    this.y = y
    this.pos = [x, y]
    this.rows = 640 / (640 / 24)
    this.cols = 640 / (640 / 24)

    this.offsetX = 500
    this.offsetY = 500
    window.addEventListener('keydown', evt => this.onKey(evt))
  }

  onKey(evt) {
    const { key, ctrlKey } = evt
    const cellKey = `${this.x}:${this.y}`
    switch (key) {
      case 'h':
        this.move('left')
        break
      case 'j':
        this.move('down')
        break
      case 'k':
        this.move('up')
        break
      case 'l':
        this.move('right')
        break
      case 'Backspace':
        Store.cells[cellKey] = null
        break
      case 'Control':
        break
      case 'Shift':
        break
      case 'Meta':
        break
      case 'c':
        if (ctrlKey) {
          Parser.parse([this.x, this.y])
        } else {
          this.addCell(cellKey, key)
        }
        break
      default:
        this.addCell(cellKey, key)
        return
    }
  }

  addCell(cellKey, key) {
    if (Store.cells[cellKey]) {
      Store.cells[cellKey].value = key
    } else {
      Store.cells[cellKey] = new Cell(key)
    }
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.y = (this.y + this.rows - 1) % this.rows
        break
      case 'down':
        this.y = (this.y + 1) % this.rows
        break
      case 'left':
        this.x = (this.x + this.cols - 1) % this.cols
        break
      case 'right':
        this.x = (this.x + 1) % this.cols
        break
      default:
        return
    }
  }
}

const Cursor = new CursorSingleton([0, 0])

export { Cursor, CursorSingleton }
