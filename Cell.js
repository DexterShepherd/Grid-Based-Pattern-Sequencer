import anime from 'animejs'
import colors from './Colors'

class Cell {
  constructor(value) {
    this.value = value || null
    this.baseColor = colors.bg
    this.color = this.baseColor
    this.flashColor = colors.lightest + '80'
    this.textColor = colors.dark
    this.tween = null
    this.commentColor = '#808080'
  }

  flash() {
    if (this.tween) {
      this.tween.pause()
    }
    this.tween = anime({
      targets: this,
      color: [this.flashColor, this.baseColor],
      duration: 200,
      easing: 'easeOutQuart'
    })
  }

  isFunction(a) {
    if (a) {
      this.textColor = colors.light
    } else {
      this.textColor = colors.med
    }
  }

  set active(a) {
    if (!a) {
      this.textColor = colors.dark
    }
  }
}

export { Cell }
