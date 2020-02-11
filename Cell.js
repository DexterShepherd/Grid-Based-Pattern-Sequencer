import anime from 'animejs'

class Cell {
  constructor(value) {
    this.value = value || null
    this.baseColor = '#181818'
    this.color = this.baseColor
    this.flashColor = '#404040'
    this.textColor = '#afafaf'
    this.tween = null
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
}

export { Cell }
