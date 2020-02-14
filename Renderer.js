import { Store } from './Store'
import { Cursor } from './Cursor'
import colors from './Colors'

class Renderer {
  constructor(id) {
    this.id = id
    this.canvas = document.getElementById(this.id)

    this.setupCanvas(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.fillCol = colors.bg
    this.cursorCol = 'rgba(255, 255, 255, 0.0)'
    this.cursorStroke = colors.lightest
    this.drawCursorStroke = true
    this.w = 640
    this.h = 640
    this.cellSize = this.w / 30
    this.ctx.font = '16px IBM Plex Mono'
  }

  setupCanvas() {
    var dpr = window.devicePixelRatio || 1
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect()
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    var ctx = canvas.getContext('2d')
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr)
    return ctx
  }

  update() {
    for (let x = 0; x < this.w / this.cellSize; x += 1) {
      for (let y = 0; y < this.h / this.cellSize; y += 1) {
        const cell = Store.cells[`${x + Cursor.offsetX}:${Cursor.offsetY + y}`]
        if (cell) {
          // draw the cell
          this.ctx.fillStyle = cell.color
          const pos = [x * this.cellSize, y * this.cellSize]
          this.ctx.fillRect(pos[0], pos[1], this.cellSize, this.cellSize)
          this.ctx.fillStyle = cell.textColor
          this.ctx.fillText(
            cell.value,
            x * this.cellSize + this.cellSize * 0.3,
            y * this.cellSize + this.cellSize * 0.8
          )
        } else {
          // this.ctx.fillStyle = '#202020'
          // const pos = [
          //   x * this.cellSize + this.cellSize * 0.5 - this.cellSize * 0.05,
          //   y * this.cellSize + this.cellSize * 0.5 - this.cellSize * 0.05
          // ]
          // this.ctx.fillRect(pos[0], pos[1], this.cellSize * 0.1, this.cellSize * 0.1)
        }

        if (Cursor.x == x && Cursor.y == y) {
          this.ctx.fillStyle = this.cursorCol
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
          if (this.drawCursorStroke) {
            this.ctx.strokeStyle = this.cursorStroke
            this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
            // this.ctx.beginPath()
            // this.ctx.moveTo(x * this.cellSize, y * this.cellSize)
            // this.ctx.lineTo(x * this.cellSize, y * this.cellSize + this.cellSize)
            // this.ctx.lineTo(x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize)
            // this.ctx.stroke()
          }
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
