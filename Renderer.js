import { Store } from './Store'
import { Cursor } from './Cursor'

class Renderer {
  constructor(id) {
    this.id = id
    console.log(this.id)
    this.canvas = document.getElementById(this.id)
    this.ctx = this.canvas.getContext('2d')
    this.fillCol = '#303030'
    this.cursorCol = 'rgba(0, 0, 0, 0.3)'
    this.cursorStroke = '#808080'
    this.w = 640
    this.h = 640
    this.cellSize = this.w / 24
    this.ctx.font = '20px SF Mono Powerline'
  }

  update() {
    for (let x = 0; x < this.w / this.cellSize; x += 1) {
      for (let y = 0; y < this.h / this.cellSize; y += 1) {
        if (Store.cells[`${x}:${y}`]) {
          // draw the cell
          this.ctx.fillStyle = '#505050'
          const pos = [x * this.cellSize, y * this.cellSize]
          this.ctx.fillRect(pos[0], pos[1], this.cellSize, this.cellSize)
          this.ctx.fillStyle = '#fff'
          this.ctx.fillText(
            Store.cells[`${x}:${y}`].value,
            x * this.cellSize + this.cellSize * 0.3,
            y * this.cellSize + this.cellSize * 0.8
          )
        } else {
          this.ctx.fillStyle = '#505050'
          const pos = [
            x * this.cellSize + this.cellSize * 0.5 - this.cellSize * 0.05,
            y * this.cellSize + this.cellSize * 0.5 - this.cellSize * 0.05
          ]
          this.ctx.fillRect(pos[0], pos[1], this.cellSize * 0.1, this.cellSize * 0.1)
        }

        if (Cursor.x == x && Cursor.y == y) {
          this.ctx.fillStyle = this.cursorCol
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
          this.ctx.strokeStyle = this.cursorStroke
          this.ctx.beginPath()
          this.ctx.moveTo(x * this.cellSize, y * this.cellSize + this.cellSize)
          this.ctx.lineTo(x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize)
          this.ctx.stroke()
        }
      }
    }
  }

  render() {
    this.background()
    this.update()
    requestAnimationFrame(() => this.render())
  }

  background() {
    this.ctx.fillStyle = this.fillCol
    this.ctx.fillRect(0, 0, this.w, this.h)
  }
}

export { Renderer }
