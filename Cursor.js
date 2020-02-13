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
    this.scrollThresh = 2
    window.addEventListener('keydown', evt => this.onKey(evt))
  }

  onKey(evt) {
    const { key, ctrlKey } = evt
    const cellKey = `${this.x + this.offsetX}:${this.y + this.offsetY}`
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
          Parser.parse([this.x + this.offsetX, this.y + this.offsetY])
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

  shouldPan() {
    const trueY = this.y
    const trueX = this.x
    return (
      trueY < this.scrollThresh ||
      trueY > this.cols - this.scrollThresh ||
      trueX < this.scrollThresh ||
      trueX > this.rows - this.scrollThresh
    )
  }

  pan() {
    const trueY = this.y
    const trueX = this.x

    if (trueY < this.scrollThresh) {
      this.offsetY -= 1
      this.y += 1
    } else if (trueY > this.rows - this.scrollThresh) {
      this.offsetY += 1
      this.y -= 1
    }

    if (trueX < this.scrollThresh) {
      this.offsetX -= 1
      this.x += 1
    } else if (trueX > this.cols - this.scrollThresh) {
      this.offsetX += 1
      this.x -= 1
    }
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.y -= 1
        break
      case 'down':
        this.y += 1
        break
      case 'left':
        this.x -= 1
        break
      case 'right':
        this.x += 1
        break
    }

    if (this.shouldPan()) {
      this.pan()
    }
  }
}

const Cursor = new CursorSingleton([12, 12])

export { Cursor, CursorSingleton }
